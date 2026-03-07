"use client"

import { addSupervisor, deleteSupervisor, getAllSupervisor } from '@/store/slice/adminSlice'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    UserPlus, Search, Mail, Camera, X,
    ShieldCheck, Loader2, Trash2
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-toastify'
import Link from 'next/link'

const AdminSupervisorPage = () => {
    const { supervisors, adminLoading } = useSelector((state: RootState) => state.admin)
    const dispatch = useDispatch<AppDispatch>()

    // UI States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', image: null as File | null })
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [search, setSearch] = useState("")
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(getAllSupervisor())
    }, [dispatch])

    // Generic input handler to update state for all text fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Handle Image Selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData({ ...formData, image: file })
            setImagePreview(URL.createObjectURL(file))
        }
    }

    // Form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image) {
            toast.warning('Image is required')
            return
        }
        const form = new FormData()
        form.append('fullName', formData.fullName)
        form.append('email', formData.email)
        form.append('password', formData.password)
        form.append('image', formData.image)
        try {
            await dispatch(addSupervisor(form)).unwrap()
            setIsModalOpen(false)
            toast.success('supervisor added')
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    // Search filtering logic
    const filteredSupervisors = supervisors?.filter((s: any) =>
        s.fullName.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const isPasswordValid = (pass: string) => {
        return pass.length >= 8 && /[A-Za-z]/.test(pass) && /[0-9]/.test(pass);
    }

    const handleDelete = async (supervisorId: string, name: string) => {
        if (window.confirm(`Are you want to remove supervisor: ${name}?`)) {
            setDeletingId(supervisorId);
            try {
                await dispatch(deleteSupervisor(supervisorId)).unwrap();
                toast.success("Removed successfully");
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setDeletingId(null);
            }
        }
    }

    return (
        <div className="pt-24 pb-20 bg-[#F8FAFC] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Supervisor Control</h1>
                        <p className="text-slate-500 text-sm font-medium">Manage and monitor all site supervisors from one place.</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-amber-500 cursor-pointer hover:bg-amber-600 text-slate-900 px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-200 active:scale-95"
                    >
                        <UserPlus size={20} />
                        Add New Supervisor
                    </button>
                </div>

                {/* List Section */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden text-black">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search by name or email..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 transition-all text-sm text-black outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold bg-white px-4 py-2 rounded-lg border border-slate-200 self-start">
                            <ShieldCheck size={16} className="text-emerald-500" />
                            System Active
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] bg-slate-50/30">
                                    <th className="px-8 py-5">Supervisor</th>
                                    <th className="px-8 py-5">Account ID</th>
                                    <th className="px-8 py-5">Email Address</th>
                                    <th className="px-8 py-5 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {adminLoading ? (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center">
                                            <Loader2 className="animate-spin mx-auto text-amber-500" size={32} />
                                            <p className="mt-4 text-slate-400 font-bold">Fetching records...</p>
                                        </td>
                                    </tr>
                                ) : filteredSupervisors?.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center">
                                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Search size={24} className="text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-bold">No supervisors found for "{search}"</p>
                                        </td>
                                    </tr>
                                ) : (filteredSupervisors?.map((s: any) => (
                                    <tr key={s._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                                    <Image
                                                        src={s.photo?.url || "/placeholder-avatar.png"}
                                                        alt={s.fullName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <Link href={`/admin/supervisors/${s._id}`} className="text-slate-900 font-bold text-base hover:underline hover:cursor-pointer leading-none mb-1">{s.fullName}</Link>
                                                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-black uppercase tracking-tighter">Verified</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <code className="text-[11px] bg-slate-100 px-2 py-1 rounded-md text-slate-500 font-mono">
                                                {s._id}
                                            </code>
                                        </td>
                                        <td className="px-8 py-6 text-slate-600 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-slate-400" />
                                                {s.email}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleDelete(s._id, s.fullName)}
                                                    disabled={deletingId === s._id}
                                                    className="p-3 text-slate-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-sm bg-white border border-slate-100 disabled:cursor-not-allowed"
                                                >
                                                    {deletingId === s._id ? <Loader2 size={18} className="animate-spin text-red-500" /> : <Trash2 size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>)
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Supervisor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

                    <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center text-black">
                            <h2 className="text-2xl font-black">Add New Supervisor</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Image Upload Area */}
                            <div className="flex flex-col items-center">
                                <label className="relative cursor-pointer group">
                                    <div className="w-24 h-24 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center group-hover:border-amber-500 transition-all">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera className="text-slate-300 group-hover:text-amber-500" size={32} />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-900 p-1.5 rounded-lg shadow-lg">
                                        <UserPlus size={14} />
                                    </div>
                                </label>
                                <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Profile Photo</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                        className="w-full text-black px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@sitetrack.com"
                                        className="w-full text-black px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Create Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    required
                                    onChange={handleChange}
                                    placeholder="Min. 8 chars, 1 letter, 1 number"
                                    className="w-full px-5 py-4 text-black bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                />
                                {formData.password && !isPasswordValid(formData.password) && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">⚠️ Password must be 8+ chars with at least 1 alphabet and 1 number</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!isPasswordValid(formData.password) || !formData.fullName || !formData.email || adminLoading}
                                className="w-full cursor-pointer bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
                            >
                                {adminLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    "Create Supervisor Account"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminSupervisorPage;