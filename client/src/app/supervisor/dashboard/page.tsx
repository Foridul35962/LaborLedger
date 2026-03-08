"use client"

import { supervisorDashboard } from '@/store/slice/supervisorSlice'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Users, UserCheck, UserX, Clock,
  Zap, Calendar, Loader2, ArrowRight,
  ClipboardCheck
} from 'lucide-react'
import Link from 'next/link'

const SupervisorDashboard = () => {
  const { supervisorDashboardData, supLoading } = useSelector((state: RootState) => state.supervisor)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(supervisorDashboard(null)).unwrap()
  }, [dispatch])

  if (supLoading && !supervisorDashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={48} />
        <p className="text-slate-500 font-bold font-sans">Syncing site data...</p>
      </div>
    )
  }

  const { stats, todaySummary, weeklySummary } = supervisorDashboardData || {}

  return (
    <div className="pt-24 pb-20 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-6">

        {/* --- Supervisor Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Site Supervisor Mode</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Field Overview</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage your team and monitor today's shift performance.</p>
          </div>

          <Link href={'/supervisor/workers'} className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg shadow-amber-200 active:scale-95">
            <ClipboardCheck size={20} />
            Mark Today's Attendance
          </Link>
        </div>

        {/* --- Quick Status Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatusCard
            label="Total Crew"
            value={stats?.totalWorkers || 0}
            icon={<Users size={24} />}
            sub="Managed Workers"
            borderColor="border-slate-200"
          />
          <StatusCard
            label="Present Now"
            value={stats?.presentToday || 0}
            icon={<UserCheck size={24} />}
            sub="Active On Site"
            accentColor="text-emerald-500"
            borderColor="border-emerald-100"
          />
          <StatusCard
            label="Absent"
            value={stats?.absentToday || 0}
            icon={<UserX size={24} />}
            sub="Missing Today"
            accentColor="text-rose-500"
            borderColor="border-rose-100"
          />
        </div>

        {/* --- Performance Bento Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Today's Stats Card */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-amber-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg">
                  <Zap size={24} fill="currentColor" />
                </div>
                <h3 className="text-xl font-black">Today's Shift Pulse</h3>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Work Hours</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">{todaySummary?.totalWorkHoursToday || 0}</span>
                    <span className="text-slate-400 font-bold">hrs</span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Overtime</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-amber-600">{todaySummary?.totalOvertimeToday || 0}</span>
                    <span className="text-slate-400 font-bold">hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Insight Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Weekly Performance</p>
                <Calendar className="text-amber-500" size={24} />
              </div>
              <h2 className="text-5xl font-black tracking-tighter mb-4">
                {weeklySummary?.weeklyWorkHours || 0}
                <span className="text-2xl text-slate-500 ml-2 font-bold tracking-normal">hrs</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-70">
                Total cumulative work hours logged by your crew this week.
              </p>
            </div>

            <div className="mt-8">
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[65%]"></div>
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-[10px] font-black text-slate-500 uppercase">Target: 160h</span>
                <span className="text-[10px] font-black text-amber-500 uppercase">65% Reached</span>
              </div>
            </div>
          </div>

        </div>

        {/* --- Secondary Action --- */}
        <div className="mt-10 flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-4xl shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Clock size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black">History & Logs</h4>
            <p className="text-xs text-slate-500 font-medium">Review previous day records and attendance logs.</p>
          </div>
          <button className="p-3 hover:bg-slate-50 rounded-xl transition-all">
            <ArrowRight size={20} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Reusable Small Status Card
const StatusCard = ({ label, value, icon, sub, accentColor = "text-slate-900", borderColor }: any) => (
  <div className={`bg-white p-8 rounded-4xl border ${borderColor} shadow-sm transition-all hover:shadow-md`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${accentColor} bg-opacity-10`}>
        {icon}
      </div>
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{sub}</span>
    </div>
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <h2 className={`text-4xl font-black ${accentColor}`}>{value}</h2>
    </div>
  </div>
)

export default SupervisorDashboard