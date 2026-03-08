"use client"

import { editSupervisor, getSupervisor } from '@/store/slice/adminSlice'
import { AppDispatch, RootState } from '@/store/store'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
    Mail, Calendar, Users, DollarSign, Clock,
    Edit3, Camera, X, Loader2, ArrowLeft,
    TrendingUp, Phone, Briefcase
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const SupervisorDetailsPage = () => {
    const { supervisorId } = useParams()
    const dispatch = useDispatch<AppDispatch>()
    const { adminLoading, supervisorData } = useSelector((state: RootState) => state.admin)

    // Modal & Edit States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editData, setEditData] = useState({ fullName: '', image: null as File | null, supervisorId: "" })
    const [preview, setPreview] = useState<string | null>(null)

    useEffect(() => {
        if (supervisorId) {
            dispatch(getSupervisor(supervisorId))
        }
    }, [dispatch, supervisorId])

    // Initialize edit form when supervisor data arrives
    useEffect(() => {
        if (supervisorData?.supervisor) {
            setEditData({
                fullName: supervisorData.supervisor.fullName,
                image: null,
                supervisorId: supervisorData.supervisor._id
            })
            setPreview(supervisorData.supervisor.photo?.url)
        }
    }, [supervisorData])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setEditData({ ...editData, image: file })
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        const myForm = new FormData()
        myForm.append("fullName", editData.fullName)
        myForm.append("supervisorId", editData.supervisorId)

        if (editData.image)
            myForm.append("image", editData.image)
        try {
            await dispatch(editSupervisor(myForm)).unwrap()
            toast.success("Profile updated!")
            setIsEditModalOpen(false)
        } catch (err: any) {
            console.log(err)
            toast.error(err.message || "Update failed")
        }
    }

    if (adminLoading && !supervisorData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
                <Loader2 className="animate-spin text-amber-500 mb-4" size={48} />
                <p className="text-slate-500 font-bold">Loading supervisor profile...</p>
            </div>
        )
    }

    const { supervisor, stats, weeklySummary, workers } = supervisorData || {}

    return (
        <div className="pt-24 pb-20 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
            <div className="max-w-7xl mx-auto px-6">

                {/* --- Top Navigation --- */}
                <Link
                    href="/admin/supervisors"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm transition-all mb-8 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Directory
                </Link>

                {/* --- Profile Header Card --- */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full -mr-32 -mt-32 opacity-50 block"></div>

                    <div className="relative flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100">
                                <Image
                                    src={supervisor?.photo?.url || "/placeholder.png"}
                                    alt="Profile" fill className="object-cover"
                                />
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-black tracking-tight">{supervisor?.fullName}</h1>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                        <Mail size={14} className="text-amber-500" />
                                        {supervisor?.email}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                        <Calendar size={14} className="text-amber-500" />
                                        Joined {new Date(supervisor?.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="bg-slate-900 cursor-pointer text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                        >
                            <Edit3 size={18} />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* --- Stats Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        label="Managed Workers"
                        value={stats?.totalWorkers || 0}
                        icon={<Users className="text-blue-600" />}
                        bg="bg-blue-50"
                    />
                    <StatCard
                        label="Total Base Rate"
                        value={`$${stats?.totalBaseRate || 0}`}
                        icon={<DollarSign className="text-emerald-600" />}
                        bg="bg-emerald-50"
                    />
                    <StatCard
                        label="Estimated Exp."
                        value={`$${weeklySummary?.estimatedExpense || 0}`}
                        icon={<TrendingUp className="text-amber-600" />}
                        bg="bg-amber-50"
                    />
                    <StatCard
                        label="Total Hours"
                        value={`${weeklySummary?.totalWorkHours || 0}h`}
                        icon={<Clock className="text-purple-600" />}
                        bg="bg-purple-50"
                    />
                </div>

                {/* --- Workers Table --- */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-xl font-black">Under-command Workers</h2>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                            Live List
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
                                    <th className="px-8 py-5">Full Name</th>
                                    <th className="px-8 py-5">Phone</th>
                                    <th className="px-8 py-5">Base Rate</th>
                                    <th className="px-8 py-5">Assigned Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {workers?.map((worker: any) => (
                                    <tr key={worker._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6 font-bold">{worker.fullName}</td>
                                        <td className="px-8 py-6 text-slate-500 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Phone size={12} className="text-slate-300" />
                                                {worker.phoneNumber}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-sm font-bold">
                                                ${worker.baseRate}/hr
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-slate-500 text-xs">
                                            {new Date(worker.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- Edit Modal --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-2xl font-black">Edit Supervisor</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-2 cursor-pointer hover:bg-slate-100 rounded-full"
                            >
                                <X />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-8 space-y-6">
                            <div className="flex flex-col items-center gap-4">
                                <label className="relative cursor-pointer group">
                                    <div className="w-24 h-24 rounded-4xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center">
                                        {preview ? (
                                            <img src={preview} className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera className="text-slate-300" />
                                        )}
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    <div className="absolute -bottom-1 -right-1 bg-amber-500 p-1.5 rounded-xl text-white border-4 border-white">
                                        <Edit3 size={12} />
                                    </div>
                                </label>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Photo</span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    type="text"
                                    value={editData.fullName}
                                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={adminLoading}
                                className="w-full cursor-pointer bg-slate-900 text-white py-5 rounded-3xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                {adminLoading ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

// Helper component for stat cards
const StatCard = ({ label, value, icon, bg }: { label: string, value: any, icon: React.ReactNode, bg: string }) => (
    <div className="bg-white p-6 rounded-4xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${bg}`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
            <p className="text-xl font-black">{value}</p>
        </div>
    </div>
)

export default SupervisorDetailsPage