import React from 'react'
import Link from 'next/link'
import { UserX, ArrowLeft, Search, Plus, ShieldAlert, Construction } from 'lucide-react'

const WorkerNotFound = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-20 font-sans">
      <div className="max-w-4xl w-full pt-10">

        {/* Main Card - Matching your "Worker Details" Card Style */}
        <div className="bg-white rounded-[3.5rem] p-12 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group">

          {/* Background Decorative Element */}
          <div className="absolute -top-10 -right-10 bg-slate-50 w-64 h-64 rounded-full blur-3xl group-hover:bg-amber-50 transition-colors duration-700"></div>

          <div className="relative z-10 flex flex-col items-center text-center">

            {/* Icon Circle */}
            <div className="w-28 h-28 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-400 border-4 border-slate-50 mb-8 relative">
              <UserX size={48} strokeWidth={1.5} />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 p-2 rounded-2xl shadow-lg border-4 border-white text-white">
                <ShieldAlert size={18} />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3 mb-10">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                Worker <span className="text-amber-500 text-stroke">Not Found</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm max-w-sm mx-auto leading-relaxed">
                The profile you are looking for doesn't exist. It may have been deleted or the ID is incorrect.
              </p>
            </div>

            {/* Action Buttons - Matching your Dashboard Style */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link
                href="/supervisor/workers"
                className="flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-500 hover:text-slate-900 px-8 py-5 rounded-4xl font-black text-sm transition-all active:scale-95 shadow-sm"
              >
                <ArrowLeft size={18} />
                Back to Crew List
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Helper Section - Matching your Stat Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-white/60 p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
              <Search size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Tip</p>
              <p className="text-xs font-bold text-slate-600">Check the Worker ID from your dashboard list.</p>
            </div>
          </div>

          <div className="bg-white/60 p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4">
            <div className="bg-slate-900 p-3 rounded-2xl text-white">
              <Construction size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support</p>
              <p className="text-xs font-bold text-slate-600">Contact site admin if you think this is a bug.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default WorkerNotFound