"use client"

import store from '@/store/store'
import { ToastContainer } from 'react-toastify';
import React from 'react'
import { Provider } from 'react-redux'

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <ToastContainer />
            {children}
        </Provider>
    )
}

export default ReduxProvider