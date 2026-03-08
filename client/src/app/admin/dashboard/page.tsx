"use client"

import { adminDashboard } from '@/store/slice/adminSlice'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  Users, UserCheck, UserX, Clock,
  TrendingUp, ShieldCheck, Calendar, Loader2,
  LayoutDashboard, ArrowUpRight
} from 'lucide-react'

const AdminDashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { adminDashboardData, adminLoading } = useSelector((state: RootState) => state.admin)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(adminDashboard()).unwrap()
      } catch (error: any) {
        toast.error(error.message || "Failed to load dashboard")
      }
    }
    fetchData()
  }, [dispatch])

  if (adminLoading && !adminDashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={48} />
        <p className="text-slate-500 font-bold">Assembling your dashboard...</p>
      </div>
    )
  }

  const { stats, todaySummary, weeklySummary } = adminDashboardData || {}

  return (
    <div className="pt-24 pb-20 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-6">

        {/* --- Welcome Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LayoutDashboard size={18} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Management Overview</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Real-time insights of your workforce and operations.</p>
          </div>

          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
            <Calendar size={20} className="text-amber-500" />
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Today's Date</p>
              <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* --- Primary Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            label="Supervisors"
            value={stats?.totalSupervisors || 0}
            icon={<ShieldCheck />}
            color="bg-indigo-500"
            trend="Active Leads"
          />
          <DashboardCard
            label="Total Workers"
            value={stats?.totalWorkers || 0}
            icon={<Users />}
            color="bg-blue-500"
            trend="Onboarded"
          />
          <DashboardCard
            label="Present Today"
            value={stats?.presentToday || 0}
            icon={<UserCheck />}
            color="bg-emerald-500"
            trend={`${stats?.presentToday > 0 ? 'Checked In' : 'No Activity'}`}
          />
          <DashboardCard
            label="Absent Today"
            value={stats?.absentToday || 0}
            icon={<UserX />}
            color="bg-rose-500"
            trend="Pending Action"
          />
        </div>

        {/* --- Insights Section (Bento Style) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Weekly Expense Card */}
          <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Financial Forecast</p>
                  <h3 className="text-2xl font-bold">Estimated Weekly Expense</h3>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl">
                  <TrendingUp className="text-amber-400" size={24} />
                </div>
              </div>

              <div className="flex items-end gap-4">
                <h2 className="text-6xl font-black tracking-tighter">${weeklySummary?.estimatedWeeklyExpense || 0}</h2>
                <span className="mb-2 text-emerald-400 font-bold flex items-center gap-1 bg-emerald-400/10 px-3 py-1 rounded-lg text-sm">
                  <ArrowUpRight size={16} />
                  Budgeted
                </span>
              </div>
              <p className="mt-6 text-slate-400 text-sm max-w-sm">
                Estimated cost based on current worker base rates and assigned shifts for the next 7 days.
              </p>
            </div>
          </div>

          {/* Today's Activity Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-black mb-2 text-black">Work Hours</h3>
              <p className="text-slate-500 text-sm font-medium">Monitoring the productivity of today's active workforce.</p>
            </div>

            <div className="mt-10 space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2 text-black">
                  <span>Today's Total</span>
                  <span>{todaySummary?.totalWorkHoursToday || 0} hrs</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <div className="flex justify-between text-sm font-bold mb-2 text-black">
                  <span>Weekly Cumulative</span>
                  <span>{weeklySummary?.weeklyWorkHours || 0} hrs</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden text-black">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- Quick Action Section --- */}
        <div className="mt-8 p-8 bg-amber-500 rounded-4xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-slate-900 font-black text-xl leading-none mb-1">Need to update reports?</h4>
            <p className="text-slate-900/70 text-sm font-bold">Generate a CSV report for the latest labor distribution.</p>
          </div>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg">
            Export Detailed Report
          </button>
        </div>
      </div>
    </div>
  )
}

// Stats Card Component for Dashboard
const DashboardCard = ({ label, value, icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-4xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{trend}</span>
    </div>
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <h2 className="text-3xl font-black text-slate-900">{value}</h2>
    </div>
  </div>
)

export default AdminDashboardPage