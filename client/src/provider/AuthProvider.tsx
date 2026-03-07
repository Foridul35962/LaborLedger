"use client"

import FirstLoad from '@/loading/FirstLoad'
import { RootState } from '@/store/store'
import { redirect } from 'next/navigation'
import React from 'react'
import { useSelector } from 'react-redux'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, userLoading } = useSelector((state: RootState) => state.auth)
    if (user && userLoading) {
        redirect('/')
    }
    return (
        <>
            {
                !userLoading ? <FirstLoad /> : children
            }
        </>
    )
}

export default AuthProvider