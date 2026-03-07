import Footer from '@/components/footer/Footer'
import Navbar from '@/components/navbar/Navbar'
import AdminProvider from '@/provider/AdminProvider'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AdminProvider >
            <Navbar />
            {children}
            <Footer />
        </AdminProvider>
    )
}

export default layout