"use client"

import { getAllWorkers, addWorker, checkInWorker, checkOutWorker } from '@/store/slice/supervisorSlice'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    UserPlus, Search, Phone, Clock, CheckCircle2,
    LogOut, LogIn, Loader2, X, User, PlusCircle,
    HardHat, Banknote
} from 'lucide-react'
import { toast } from 'react-toastify'
import { redirect } from 'next/navigation'

const AttendancePage = () => {
    const { supFetLoading, workers, supLoading } = useSelector((state: RootState) => state.supervisor)
    const dispatch = useDispatch<AppDispatch>()

    // Local States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [search, setSearch] = useState("")

    // Initialized baseRate as 0 (number)
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        baseRate: 0
    })

    const [actionId, setActionId] = useState<string | null>(null)

    useEffect(() => {
        dispatch(getAllWorkers(null))
    }, [dispatch])

    // --- Handlers ---
    const handleCheckIn = async (workerId: string) => {
        setActionId(workerId)
        try {
            await dispatch(checkInWorker({ workerId })).unwrap()
            toast.success("Checked in successfully")
        } catch (err: any) {
            toast.error(err.message || "Check-in failed")
        } finally {
            setActionId(null)
        }
    }

    const handleCheckOut = async (workerId: string) => {
        setActionId(workerId)
        try {
            await dispatch(checkOutWorker({ workerId })).unwrap()
            toast.success("Checked out successfully")
        } catch (err: any) {
            toast.error(err.message || "Check-out failed")
        } finally {
            setActionId(null)
        }
    }

    const handleAddWorker = async (e: React.FormEvent) => {
        e.preventDefault()
        // Final safety check: ensuring baseRate is a positive number
        if (formData.baseRate <= 0) return toast.error("Base rate must be greater than 0")

        try {
            await dispatch(addWorker(formData)).unwrap()
            toast.success("Worker added to your crew!")
            setIsModalOpen(false)
            setFormData({ fullName: '', phoneNumber: '', baseRate: 0 })
        } catch (err: any) {
            toast.error(err.message || "Failed to add worker")
        }
    }

    const filteredWorkers = workers?.filter((w: any) =>
        w.fullName.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="pt-24 pb-20 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
            <div className="max-w-7xl mx-auto px-6">

                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <HardHat size={18} className="text-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Daily Operations</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">Crew Attendance</h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">Manage check-ins and add new workers to your site.</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-slate-900 cursor-pointer text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl hover:bg-slate-800 active:scale-95"
                    >
                        <UserPlus size={20} />
                        New Worker
                    </button>
                </div>

                {/* --- Control Bar --- */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search crew members..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none text-sm transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-6 px-4">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                            <p className="font-bold">{workers?.length || 0}</p>
                        </div>
                        <div className="h-8 w-px bg-slate-100"></div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Present</p>
                            <p className="font-bold">{workers?.filter((w: any) => w.isCheckedInToday).length || 0}</p>
                        </div>
                    </div>
                </div>

                {/* --- Workers List --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {supFetLoading ? (
                        <div className="col-span-full py-20 flex flex-col items-center">
                            <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
                            <p className="text-slate-400 font-bold">Loading crew list...</p>
                        </div>
                    ) : filteredWorkers?.length === 0 ? (
                        <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center">
                            <User size={48} className="text-slate-200 mb-4" />
                            <p className="text-slate-500 font-bold">No workers found</p>
                        </div>
                    ) : (
                        filteredWorkers?.map((worker: any, idx: any) => (
                            <div
                                key={worker._id}
                                onClick={() => redirect(`/supervisor/workers/${worker._id}`)}
                                className="bg-white cursor-pointer p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-black hover:underline text-lg leading-tight">{worker.fullName}</h3>
                                            <div className="flex flex-col gap-1 mt-1">
                                                <p className="text-slate-400 text-xs flex items-center gap-1 font-medium">
                                                    <Phone size={10} /> {worker.phoneNumber}
                                                </p>
                                                {worker.todayCheckIn && (
                                                    <p className="text-amber-600 text-[10px] font-black flex items-center gap-1 bg-amber-50 w-fit px-2 py-0.5 rounded-md">
                                                        <Clock size={10} />
                                                        IN: {new Date(worker.todayCheckIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {worker.isCheckedOutToday && (
                                        <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-full">
                                            <CheckCircle2 size={18} />
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    {!worker.isCheckedInToday ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Redirect bondho korbe
                                                handleCheckIn(worker._id);
                                            }}
                                            disabled={actionId === worker._id}
                                            className="flex-1 bg-amber-500 text-slate-900 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-100"
                                        >
                                            {actionId === worker._id ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                                            CHECK IN
                                        </button>
                                    ) : !worker.isCheckedOutToday ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Redirect bondho korbe
                                                handleCheckOut(worker._id);
                                            }}
                                            disabled={actionId === worker._id}
                                            className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                                        >
                                            {actionId === worker._id ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                                            CHECK OUT
                                        </button>
                                    ) : (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            className="flex-1 cursor-default bg-slate-50 text-slate-400 py-3 rounded-xl font-black text-[10px] text-center uppercase tracking-widest border border-slate-100">
                                            Shift Completed
                                        </div>
                                    )}

                                    <button
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-4 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all"
                                    >
                                        <Clock size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* --- Add Worker Modal --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !supLoading && setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black">Add to Crew</h3>
                                <p className="text-slate-500 text-xs font-medium">Register a new worker to this site.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-white rounded-full transition-all shadow-sm text-slate-400"
                            >
                                <X />
                            </button>
                        </div>
                        <form onSubmit={handleAddWorker} className="p-8 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Worker Name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="01..."
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1 text-black">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Rate (Per Hour)</label>
                                <div className="relative">
                                    <Banknote size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        required
                                        type="number"
                                        placeholder="e.g. 150" value={formData.baseRate || ""}
                                        onChange={(e) => setFormData({ ...formData, baseRate: Number(e.target.value) })}
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={supLoading}
                                className="w-full cursor-pointer bg-slate-900 text-white py-5 rounded-3xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                            >
                                {supLoading ? <Loader2 className="animate-spin" size={20} /> : <><PlusCircle size={20} /> Confirm Registration</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AttendancePage