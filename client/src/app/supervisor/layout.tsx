import Footer from '@/components/footer/Footer'
import Navbar from '@/components/navbar/Navbar'
import SupervisorProvider from '@/provider/SupervisorProvider'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SupervisorProvider >
            <Navbar />
            {children}
            <Footer />
        </SupervisorProvider>
    )
}

export default layout