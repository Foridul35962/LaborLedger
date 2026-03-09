"use client"

import PaymentHistoryNotFound from '@/components/notFound/PaymentHistoryNotFound'
import { paymentHistory } from '@/store/slice/supervisorSlice'
import { AppDispatch, RootState } from '@/store/store'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    ArrowLeft, Calendar, DollarSign, Receipt,
    Clock, CheckCircle2, Loader2, Download, Filter
} from 'lucide-react'

const PaymentHistoryPage = () => {
    const { paymentLoading, paymentHistoryData } = useSelector((state: RootState) => state.supervisor)
    const { workerId } = useParams()
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    useEffect(() => {
        if (workerId) {
            dispatch(paymentHistory({ workerId: workerId as string }))
        }
    }, [workerId, dispatch])

    if (paymentLoading && !paymentHistoryData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
                <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
                <p className="text-slate-500 font-black tracking-tight uppercase text-xs">Loading Ledgers...</p>
            </div>
        )
    }

    if (!paymentHistoryData || paymentHistoryData.length === 0) {
        return <PaymentHistoryNotFound />
    }

    return (
        <div className="pt-24 pb-20 bg-[#F8FAFC] min-h-screen font-sans">
            <div className="max-w-4xl mx-auto px-6">

                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold text-xs bg-white px-4 py-2 rounded-xl border border-slate-200 w-fit shadow-sm mb-2"
                        >
                            <ArrowLeft size={16} /> Back to Profile
                        </button>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                            Payment <span className="text-amber-500">History</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-sm">Review all past settlements and digital receipts.</p>
                    </div>

                    <div className="bg-white p-4 rounded-4xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="bg-amber-500 p-3 rounded-2xl text-white shadow-lg shadow-amber-200">
                            <Receipt size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payouts</p>
                            <p className="text-xl font-black text-slate-900">{paymentHistoryData.length} Records</p>
                        </div>
                    </div>
                </div>

                {/* --- History List --- */}
                <div className="space-y-6">
                    {paymentHistoryData.map((payment: any) => (
                        <div
                            key={payment._id}
                            className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
                        >
                            {/* Status Tag */}
                            <div className="absolute top-0 right-0 bg-emerald-500 text-white px-8 py-2 rounded-bl-4xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                <CheckCircle2 size={12} /> {payment.status}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

                                {/* Date Section */}
                                <div className="md:col-span-3 flex items-center gap-4 border-r border-slate-100">
                                    <div className="bg-slate-50 w-16 h-16 rounded-3xl flex flex-col items-center justify-center text-center group-hover:bg-amber-50 transition-colors">
                                        <p className="text-[10px] font-black text-slate-400 uppercase">
                                            {new Date(payment.createdAt).toLocaleString('default', { month: 'short' })}
                                        </p>
                                        <p className="text-2xl font-black text-slate-900">
                                            {new Date(payment.createdAt).getDate()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Date</p>
                                        <p className="text-sm font-black text-slate-800">Year {new Date(payment.createdAt).getFullYear()}</p>
                                    </div>
                                </div>

                                {/* Period Details */}
                                <div className="md:col-span-5 space-y-3">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <Calendar size={16} className="text-amber-500" />
                                        <div className="text-xs font-bold">
                                            <span className="text-slate-400 font-black uppercase text-[9px] block tracking-widest">Work Period</span>
                                            {new Date(payment.periodStart).toLocaleDateString()} — {new Date(payment.periodEnd).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-slate-400" />
                                            <span className="text-xs font-black text-slate-700">{payment.totalDays} Days Worked</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={14} className="text-slate-400" />
                                            <span className="text-xs font-black text-slate-700">Rate: ৳{payment.baseRate}/hr</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount & Action */}
                                <div className="md:col-span-4 flex flex-col items-end gap-3">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount Settled</p>
                                        <p className="text-3xl font-black text-slate-900 font-mono">
                                            ৳{payment.totalAmount.toLocaleString()}
                                        </p>
                                    </div>
                                    <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                                        <Download size={14} /> Download Receipt
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* --- Footer Stats --- */}
                <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 px-6">
                    <div className="flex items-center gap-3">
                        <Filter size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Showing all records since 2026</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Labor Ledger Security v2.0</p>
                </div>

            </div>
        </div>
    )
}

export default PaymentHistoryPage