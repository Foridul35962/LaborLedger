import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/admin`

export const getAllSupervisor = createAsyncThunk(
    "admin/getSupervisors",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${SERVER_URL}/supervisors`,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

interface addSupervisorTypes {
    fullName: string,
    email: string,
    password: string,
    image: File
}

export const addSupervisor = createAsyncThunk(
    "admin/addSupervisor",
    async (data: addSupervisorTypes, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/add-supervisor`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

interface editSupervisorTypes {
    fullName: string | null,
    email: string | null,
    image: File | null
}

export const editSupervisor = createAsyncThunk(
    "admin/editSupervisor",
    async (data: editSupervisorTypes, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${SERVER_URL}/edit-supervisor`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const deleteSupervisor = createAsyncThunk(
    "admin/deleteSupervisor",
    async (supervisorId: string, { rejectWithValue }) => {
        try {
            const res = await axios.delete(`${SERVER_URL}/delete-supervisor/${supervisorId}`,
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
    adminLoading: boolean,
    supervisors: any
}

const initialState: initialStateType = {
    adminLoading: false,
    supervisors: []
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //get all supervisor
        builder
            .addCase(getAllSupervisor.pending, (state) => {
                state.adminLoading = true
            })
            .addCase(getAllSupervisor.fulfilled, (state, action) => {
                state.adminLoading = false
                state.supervisors = action.payload.data
            })
            .addCase(getAllSupervisor.pending, (state) => {
                state.adminLoading = false
            })
        //add supervisor
        builder
            .addCase(addSupervisor.pending, (state) => {
                state.adminLoading = true
            })
            .addCase(addSupervisor.fulfilled, (state, action) => {
                state.adminLoading = false
                state.supervisors = [...state.supervisors, action.payload.data]
            })
            .addCase(addSupervisor.pending, (state) => {
                state.adminLoading = false
            })
        //edit supervisor
        builder
            .addCase(editSupervisor.pending, (state) => {
                state.adminLoading = true
            })
            .addCase(editSupervisor.fulfilled, (state, action) => {
                state.adminLoading = false
                const user = action.payload.data
                const index = state.supervisors.findIndex((supervisor: any) => user._id === supervisor._id)
                if (index > -1) {
                    state.supervisors[index] = user
                }
            })
            .addCase(editSupervisor.pending, (state) => {
                state.adminLoading = false
            })
        //delete supervisor
        builder
            .addCase(editSupervisor.pending, (state) => {
                state.adminLoading = true
            })
            .addCase(editSupervisor.fulfilled, (state, action) => {
                state.adminLoading = false
                const userId = action.payload.data
                state.supervisors = state.supervisors.filter((supervisor: any) => supervisor._id !== userId)
            })
            .addCase(editSupervisor.pending, (state) => {
                state.adminLoading = false
            })
    }
})

export default adminSlice.reducer