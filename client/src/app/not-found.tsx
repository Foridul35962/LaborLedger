import React from 'react'
import Link from 'next/link'
import { Home, Search, FileX, ArrowLeft, BotMessageSquare, ShieldAlert } from 'lucide-react'

// purely Server Component - (No "use client" directive)
const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 font-sans relative overflow-hidden">

            {/* Decorative Large Background Icons (Static) */}
            <div className="absolute top-20 left-20 text-slate-600 opacity-20 rotate-12">
                <BotMessageSquare size={160} strokeWidth={1} />
            </div>
            <div className="absolute bottom-20 right-20 text-amber-600 opacity-30 -rotate-12">
                <ShieldAlert size={160} strokeWidth={1} />
            </div>

            <div className="max-w-5xl w-full text-center relative z-10">

                {/* --- Main Visual Section --- */}
                <div className="relative mb-4 flex justify-center items-center gap-6">
                    <div className="bg-white px-10 py-6 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 relative group transition-all">
                        {/* Bounce Animation (CSS Class) */}
                        <div className="animate-bounce-slow">
                            <FileX size={120} className="text-amber-500" strokeWidth={1} />
                        </div>
                        {/* Absolute Decorative Pulse */}
                        <div className="absolute inset-0 bg-amber-500/10 blur-[90px] rounded-full scale-150 group-hover:scale-110 transition-transform duration-700"></div>
                    </div>
                    {/* Decorative Large Text */}
                    <span className="text-[14rem] md:text-[20rem] font-black text-gray-700 leading-none select-none tracking-tighter">
                        404
                    </span>
                </div>

                {/* --- Text Content --- */}
                <div className="space-y-4 mb-6 max-w-xl mx-auto px-4">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                        Oops! Path <span className='text-amber-500'>Not Found</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-lg leading-relaxed max-w-md mx-auto">
                        The page you are looking for has been moved, deleted, or has never existed in our site ledger.
                    </p>
                </div>

                {/* --- Action Buttons (Standard Links) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto pb-10">
                    <Link
                        href="/supervisor" // standard URL approach for server component
                        className="flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-900 py-5 rounded-[2.5rem] font-black text-sm hover:border-slate-900 transition-all active:scale-95 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                        Crew Dashboard
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                    >
                        <Home size={20} />
                        Site Overview
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NotFound