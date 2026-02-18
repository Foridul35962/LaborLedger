import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/supervisor`

export const addWorker = createAsyncThunk(
    "supervisor/addWorker",
    async (data: {
        fullName: string,
        phoneNumber: string,
        baseRate: number
    }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/add-worker`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

interface EditWorkerType {
    data: {
        fullName?: string
        phoneNumber?: string
        baseRate?: string
    }
    workerId: string
}


export const editWorker = createAsyncThunk(
    "supervisor/editWorker",
    async ({ data, workerId }: EditWorkerType, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${SERVER_URL}/edit-worker/${workerId}`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const deleteWorker = createAsyncThunk(
    "supervisor/deleteWorker",
    async (workerId: string, { rejectWithValue }) => {
        try {
            const res = await axios.delete(`${SERVER_URL}/delete-worker`,
                {
                    data: workerId,
                    withCredentials: true
                }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const getAllWorkers = createAsyncThunk(
    "supervisor/allWorkers",
    async (_: null, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${SERVER_URL}/all-workers`,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

interface workerIdType {
    workerId: string
}

export const checkInWorker = createAsyncThunk(
    "supervisor/checkIn",
    async (data: workerIdType, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/checkIn-worker`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const checkOutWorker = createAsyncThunk(
    "supervisor/checkOut",
    async (data: workerIdType, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${SERVER_URL}/checkOut-worker`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const leaveStart = createAsyncThunk(
    "supervisor/leaveStart",
    async (data: workerIdType, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${SERVER_URL}/leaveStart-worker`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const leaveEnd = createAsyncThunk(
    "supervisor/leaveEnd",
    async (data: workerIdType, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${SERVER_URL}/leaveEnd-worker`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const workerDetails = createAsyncThunk(
    "supervisor/workerDetails",
    async (data: {
        workerId: string,
        paymentToDate: Date
    }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/worker-detail`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

interface initialStateType {
    supLoading: boolean,
    supFetLoading: boolean,
    supCheckLoading: boolean,
    workers: any
}

const initialState: initialStateType = {
    supLoading: false,
    supFetLoading: false,
    supCheckLoading: false,
    workers: []
}

const supervisorSlice = createSlice({
    name: "supervisor",
    initialState,
    reducers: {},
    extraReducers: (builer) => {
        //add worker
        builer
            .addCase(addWorker.pending, (state) => {
                state.supLoading = true
            })
            .addCase(addWorker.fulfilled, (state, action) => {
                state.supLoading = false
                state.workers = [...state.workers, action.payload.data]
            })
            .addCase(addWorker.rejected, (state) => {
                state.supLoading = false
            })
        //edit worker
        builer
            .addCase(editWorker.pending, (state) => {
                state.supLoading = true
            })
            .addCase(editWorker.fulfilled, (state, action) => {
                state.supLoading = false
                const user = action.payload.data
                const index = state.workers.findIndex((worker: any) => worker._id === user._id)
                if (index > -1) {
                    state.workers[index] = user
                }
            })
            .addCase(editWorker.rejected, (state) => {
                state.supLoading = false
            })
        //delete worker
        builer
            .addCase(deleteWorker.pending, (state) => {
                state.supLoading = true
            })
            .addCase(deleteWorker.fulfilled, (state, action) => {
                state.supLoading = false
                const userId = action.payload.data
                state.workers = state.workers.filter((worker: any) => worker._id !== userId)
            })
            .addCase(deleteWorker.rejected, (state) => {
                state.supLoading = false
            })
        //get all worker
        builer
            .addCase(getAllWorkers.pending, (state) => {
                state.supFetLoading = true
            })
            .addCase(getAllWorkers.fulfilled, (state, action) => {
                state.supFetLoading = false
                state.workers = action.payload.data
            })
            .addCase(getAllWorkers.rejected, (state) => {
                state.supFetLoading = false
            })
        //checkIn worker
        builer
            .addCase(checkInWorker.pending, (state) => {
                state.supCheckLoading = true
            })
            .addCase(checkInWorker.fulfilled, (state) => {
                state.supCheckLoading = false
            })
            .addCase(checkInWorker.rejected, (state) => {
                state.supCheckLoading = false
            })
        //checkOut worker
        builer
            .addCase(checkOutWorker.pending, (state) => {
                state.supCheckLoading = true
            })
            .addCase(checkOutWorker.fulfilled, (state) => {
                state.supCheckLoading = false
            })
            .addCase(checkOutWorker.rejected, (state) => {
                state.supCheckLoading = false
            })
    }
})