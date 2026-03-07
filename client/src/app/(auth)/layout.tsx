import AuthProvider from '@/provider/AuthProvider'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider >
            {children}
        </AuthProvider>
    )
}

export default layout