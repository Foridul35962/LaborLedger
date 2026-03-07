"use client"

import FirstLoad from '@/loading/FirstLoad'
import { RootState } from '@/store/store'
import { redirect } from 'next/navigation'
import React from 'react'
import { useSelector } from 'react-redux'

const AdminProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, userLoading } = useSelector((state: RootState) => state.auth)
    if (userLoading && (!user || user.role !== 'admin')) {
        redirect('/')
    }
    return (
        <>
            {!userLoading ? <FirstLoad /> : children}
        </>
    )
}

export default AdminProvider