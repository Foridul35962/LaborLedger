import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slice/authSlice'
import adminReducer from './slice/adminSlice'
import supervisorReducer from './slice/supervisorSlice'

const store = configureStore({
    reducer:{
        auth: authReducer,
        admin: adminReducer,
        supervisor: supervisorReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store