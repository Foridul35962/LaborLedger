"use client"

import store from '@/store/store'
import { ToastContainer } from 'react-toastify';
import React from 'react'
import { Provider } from 'react-redux'
import UseGetUser from '@/hooks/UseGetUser';

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <ToastContainer />
            {children}
            <UseGetUser />
        </Provider>
    )
}

export default ReduxProvider