"use client"

import React, { useState } from 'react';
import { Menu, X, Construction, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { redirect } from 'next/navigation';
import { logout } from '@/store/slice/authSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userLoading } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()

  const handleLogInOut = async () => {
    if (!user) {
      redirect('/login')
    } else {
      if (window.confirm('Are you want to loggedOut?')) {
        try {
          await dispatch(logout()).unwrap()
          toast.success("logout successfully")
        } catch (error: any) {
          toast.error(error.message)
        }
      }
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo Section */}
        <Link href={'/'} className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-amber-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Construction size={24} className="text-slate-900" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">
            Labor<span className="text-amber-600">Ledger</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {
            !user && userLoading && <>
              <Link href="/features" className="text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors uppercase tracking-wider">Features</Link>
              <Link href="/how-it-works" className="text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors uppercase tracking-wider">How it works</Link>
              <Link href="/pricing" className="text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors uppercase tracking-wider">Pricing</Link>
            </>
          }

          {/* supervisor */}
          {
            user && user?.role === "supervisor" && <>
              <Link href="/supervisor/dashboard" className="text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors uppercase tracking-wider">Dashboard</Link>
            </>
          }

          {/* admin */}
          {
            user && user?.role === "admin" && <>
              <Link href="/admin/supervisors" className="text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors uppercase tracking-wider">Supervisors</Link>
              <Link href="/admin/dashboard" className="text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors uppercase tracking-wider">Dashboard</Link>
            </>
          }

          <div className="h-6 w-px bg-slate-200"></div>

          {!userLoading ? (
            <div className="w-27.5 h-11 bg-slate-700 rounded-xl animate-pulse flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
              <div className="w-12 h-3 bg-slate-800 rounded-full mr-2"></div>
              <div className="w-4 h-4 bg-slate-800 rounded-md"></div>
            </div>
          ) : (
            <button
              onClick={handleLogInOut}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 group shadow-lg shadow-slate-200"
            >
              {user ? "Logout" : "Login"}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-6 shadow-xl animate-in slide-in-from-top duration-300 z-50">
          {
            !user && userLoading && <>
              <Link href="/features" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 hover:text-amber-600 transition-colors">Features</Link>
              <Link href="/how-it-works" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 hover:text-amber-600 transition-colors">How it works</Link>
              <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 hover:text-amber-600 transition-colors">Pricing</Link>
            </>
          }

          {/* supervisor */}
          {
            user && user?.role === "supervisor" && <>
              <Link href="/supervisor/deshboard" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 hover:text-amber-600 transition-colors">Dashboard</Link>
            </>
          }

          {/* admin */}
          {
            user && user?.role === "admin" && <>
              <Link href="/admin/supervisors" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 hover:text-amber-600 transition-colors">Supervisors</Link>
              <Link href="/admin/deshboard" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 hover:text-amber-600 transition-colors">Dashboard</Link>
            </>
          }

          <hr className="border-slate-100" />
          {!userLoading ? (
            <div className="w-full h-14 bg-slate-700 rounded-2xl animate-pulse flex items-center justify-center gap-2">
              <div className="w-16 h-3 bg-slate-800 rounded-full"></div>
              <div className="w-5 h-5 bg-slate-800 rounded-lg"></div>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogInOut()
              }}
              className="bg-slate-900 text-white w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-slate-200"
            >
              {user ? "Logout" : "Login"}
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;