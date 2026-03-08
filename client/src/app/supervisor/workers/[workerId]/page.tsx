"use client"

import { deleteWorker, editWorker, workerDetails } from '@/store/slice/supervisorSlice'
import { AppDispatch, RootState } from '@/store/store'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ArrowLeft, Calendar, Clock, DollarSign,
  User, Phone, Briefcase, CreditCard,
  Loader2, History, TrendingUp, Filter, Trash2, AlertCircle, XCircle, Edit3, X, Save
} from 'lucide-react'

const WorkerDetailsPage = () => {
  const { supFetLoading, workerData } = useSelector((state: RootState) => state.supervisor)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { workerId } = useParams()

  const [deleteError, setDeleteError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [paymentToDate, setPaymentToDate] = useState(new Date().toISOString().split('T')[0])

  // --- Edit Mode States ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phoneNumber: "",
    baseRate: ""
  })

  useEffect(() => {
    if (workerId) {
      dispatch(workerDetails({
        workerId: workerId as string,
        paymentToDate: new Date(paymentToDate)
      }))
    }
  }, [workerId, paymentToDate, dispatch])

  // Initializing edit form with worker data
  const handleOpenEdit = () => {
    if (workerData) {
      setEditFormData({
        fullName: workerData.worker.fullName,
        phoneNumber: workerData.worker.phoneNumber,
        baseRate: workerData.worker.baseRate.toString()
      })
      setIsEditModalOpen(true)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(true)
    try {
      await dispatch(editWorker({
        workerId: workerId as string,
        data: editFormData
      })).unwrap()

      setIsEditModalOpen(false)
      dispatch(workerDetails({ workerId: workerId as string, paymentToDate: new Date(paymentToDate) }))
    } catch (err: any) {
      alert(err?.message || "Failed to update worker")
    } finally {
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this worker?");
    if (!confirmDelete) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await dispatch(deleteWorker({ workerId: workerId as string })).unwrap();
      router.push('/supervisor/workers');
    } catch (err: any) {
      const msg = err?.message || (typeof err === 'string' ? err : "Something went wrong");
      setDeleteError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (supFetLoading && !workerData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
        <p className="text-slate-500 font-bold tracking-tight">Recalculating dues...</p>
      </div>
    )
  }

  if (!workerData) return null

  return (
    <div className="pt-24 pb-20 bg-[#F8FAFC] min-h-screen font-sans relative">
      <div className="max-w-6xl mx-auto px-6">

        {/* --- Top Bar --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold text-sm bg-white px-4 py-2 rounded-xl border border-slate-200 w-fit shadow-sm"
          >
            <ArrowLeft size={18} /> Back to Crew
          </button>

          <div className="flex items-center gap-3 bg-white p-2 pl-4 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
            <div className="flex items-center gap-2 text-slate-400 border-r border-slate-100 pr-3">
              <Filter size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Calculate Up To</span>
            </div>
            <input
              type="date"
              value={paymentToDate}
              onChange={(e) => setPaymentToDate(e.target.value)}
              className="outline-none text-sm font-black text-slate-800 cursor-pointer bg-transparent py-1 pr-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-400 border-4 border-slate-50 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 relative">
                  <User size={40} />
                  {/* Edit Button Hooked Here */}
                  <button
                    onClick={handleOpenEdit}
                    className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-lg border border-slate-100 text-slate-500 hover:text-amber-500 transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900">{workerData.worker.fullName}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                      <Phone size={12} className="text-amber-500" /> {workerData.worker.phoneNumber}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                      <Briefcase size={12} className="text-amber-500" /> Rate: ৳{workerData.worker.baseRate}/hr
                    </span>
                  </div>
                </div>
                <div className="bg-slate-900 text-white px-10 py-6 rounded-[2.5rem] text-center shadow-2xl shadow-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Due</p>
                  <p className="text-4xl font-black text-amber-500">
                    ৳{supFetLoading ? '...' : workerData.money.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<Calendar size={18} />} label="Days" value={workerData.workingDays} color="text-blue-500" bg="bg-blue-50" />
              <StatCard icon={<Clock size={18} />} label="Hours" value={workerData.workingHours.toFixed(2)} color="text-purple-500" bg="bg-purple-50" />
              <StatCard icon={<TrendingUp size={18} />} label="OT Hours" value={workerData.overTimes} color="text-orange-500" bg="bg-orange-50" />
              <StatCard icon={<DollarSign size={18} />} label="Avg/Day" value={(workerData.money / (workerData.workingDays || 1)).toFixed(0)} color="text-emerald-500" bg="bg-emerald-50" />
            </div>

            {/* History Table */}
            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-black flex items-center text-black gap-3 px-2">
                <History size={20} className="text-slate-600" /> Work History Records
              </h2>
              <div className="space-y-3">
                {workerData.workedDays.map((day: any, idx: any) => (
                  <div key={idx} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="bg-slate-50 px-4 py-2 rounded-2xl group-hover:bg-amber-50 transition-colors">
                        <p className="text-[10px] font-black text-slate-400 uppercase text-center">{new Date(day.date).toLocaleString('default', { month: 'short' })}</p>
                        <p className="text-xl font-black text-slate-900 text-center">{new Date(day.date).getDate()}</p>
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">
                          {new Date(day.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                          {day.checkOut ? new Date(day.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ' Pending'}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-black text-slate-500 uppercase tracking-tighter">{day.hours.toFixed(2)} Hrs</span>
                          {day.overtimeHours > 0 && <span className="text-[10px] bg-orange-100 px-2 py-0.5 rounded font-black text-orange-600 uppercase tracking-tighter">+{day.overtimeHours} OT</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900 text-lg">৳{day.dayMoney.toFixed(2)}</p>
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Verified</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              <h2 className="text-xl font-black flex items-center text-black gap-3 px-2">
                <CreditCard size={20} className="text-slate-400" /> Settlement
              </h2>

              <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4">Payout Summary</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-500">Regular Wages</span>
                      <span className="text-sm font-black text-slate-800">৳{(workerData.money - (workerData.overTimes * workerData.worker.baseRate)).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200/60">
                      <span className="text-sm font-bold text-slate-500">Overtime Bonus</span>
                      <span className="text-sm font-black text-emerald-600">+৳{(workerData.overTimes * workerData.worker.baseRate).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-slate-900 uppercase">Net Payable</span>
                      <span className="text-xl font-black text-amber-600 font-mono">৳{workerData.money.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                      <DollarSign size={20} /> Record Full Payment
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-red-50/50 rounded-[2.5rem] p-6 border border-red-100">
                <h3 className="text-red-600 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Trash2 size={12} /> Danger Zone
                </h3>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full bg-white text-red-600 border border-red-200 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Delete Worker Account
                </button>
              </div>

              {deleteError && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 pb-10">
                  <div className="bg-red-600 border border-red-700 p-5 rounded-4xl flex items-start gap-4 text-white shadow-lg shadow-red-200">
                    <div className="bg-white/20 p-2 rounded-xl shrink-0">
                      <XCircle size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1.5 opacity-80">Deletion Blocked</p>
                      <p className="text-xs font-bold leading-relaxed">{deleteError}</p>
                    </div>
                    <button onClick={() => setDeleteError("")} className="opacity-60 hover:opacity-100 transition-opacity">
                      <AlertCircle size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- Edit Worker Modal --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/20 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                <Edit3 size={20} />
              </div>
              Edit Profile
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={editFormData.phoneNumber}
                  onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hourly Rate (৳)</label>
                <input
                  required
                  type="number"
                  value={editFormData.baseRate}
                  onChange={(e) => setEditFormData({ ...editFormData, baseRate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>

              <button
                disabled={isEditing}
                type="submit"
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 mt-4 shadow-xl shadow-slate-200"
              >
                {isEditing ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Update Information
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const StatCard = ({ icon, label, value, color, bg }: any) => (
  <div className="bg-white p-5 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
    <div className={`w-10 h-10 ${bg} ${color} rounded-2xl flex items-center justify-center mb-3`}>{icon}</div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-xl font-black text-slate-900 mt-0.5">{value}</p>
  </div>
)

export default WorkerDetailsPage