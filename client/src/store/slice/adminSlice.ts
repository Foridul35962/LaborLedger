import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin`

export const getSupervisor = createAsyncThunk(
    "admin/getSupervisor",
    async (supervisorId: any, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${SERVER_URL}/supervisor/${supervisorId}`,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

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

export const addSupervisor = createAsyncThunk(
    "admin/addSupervisor",
    async (data: FormData, { rejectWithValue }) => {
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

export const editSupervisor = createAsyncThunk(
    "admin/editSupervisor",
    async (data: FormData, { rejectWithValue }) => {
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

export const adminDashboard = createAsyncThunk(
    "admin/dashboard",
    async(_, {rejectWithValue})=>{
        try {
            const res = await axios.get(`${SERVER_URL}/dashboard`,
                {withCredentials:true}
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
    deleteLoading: boolean,
    supervisorData: any
    supervisors: any,
    adminDashboardData: any
}

const initialState: initialStateType = {
    adminLoading: false,
    deleteLoading: false,
    supervisorData: null,
    supervisors: [],
    adminDashboardData: null
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //get supervisor details
        builder
            .addCase(getSupervisor.pending, (state) => {
                state.adminLoading = true
            })
            .addCase(getSupervisor.fulfilled, (state, action) => {
                state.adminLoading = false,
                    state.supervisorData = action.payload.data
            })
            .addCase(getSupervisor.rejected, (state) => {
                state.adminLoading = false
            })
        //get all supervisor
        builder
            .addCase(getAllSupervisor.pending, (state) => {
                state.adminLoading = true
            })
            .addCase(getAllSupervisor.fulfilled, (state, action) => {
                state.adminLoading = false
                state.supervisors = action.payload.data
            })
            .addCase(getAllSupervisor.rejected, (state) => {
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
            .addCase(addSupervisor.rejected, (state) => {
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
                state.supervisorData.supervisor.fullName = user.fullName
                state.supervisorData.supervisor.photo.url = user.photo.url
            })
            .addCase(editSupervisor.rejected, (state) => {
                state.adminLoading = false
            })
        //delete supervisor
        builder
            .addCase(deleteSupervisor.pending, (state) => {
                state.deleteLoading = true
            })
            .addCase(deleteSupervisor.fulfilled, (state, action) => {
                state.deleteLoading = false
                const userId = action.payload.data
                state.supervisors = state.supervisors.filter((supervisor: any) => supervisor._id !== userId)
            })
            .addCase(deleteSupervisor.rejected, (state) => {
                state.deleteLoading = false
            })
        //admin dashboard
        builder
            .addCase(adminDashboard.pending, (state)=>{
                state.adminLoading = true
            })
            .addCase(adminDashboard.fulfilled, (state, action)=>{
                state.adminLoading = false
                state.adminDashboardData = action.payload.data
            })
            .addCase(adminDashboard.rejected, (state)=>{
                state.adminLoading = false
            })
    }
})

export default adminSlice.reducer