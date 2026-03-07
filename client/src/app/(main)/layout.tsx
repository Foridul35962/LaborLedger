import Footer from '@/components/footer/Footer'
import Navbar from '@/components/navbar/Navbar'
import AuthProvider from '@/provider/AuthProvider'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <Navbar />
            {children}
            <Footer />
        </AuthProvider>
    )
}

export default layout