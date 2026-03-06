"use client"

import React, { useState } from 'react';
import { Menu, X, Construction, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <Link href="/features" className="text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors uppercase tracking-wider">Features</Link>
          <Link href="/how-it-works" className="text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors uppercase tracking-wider">How it works</Link>
          <Link href="/pricing" className="text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors uppercase tracking-wider">Pricing</Link>
          
          <div className="h-6 w-px bg-slate-200"></div>
          
          <Link href={'/login'} className="text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors">Login</Link>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 group">
            Get Started
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
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
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-6 shadow-xl animate-in slide-in-from-top duration-300">
          <Link href="/features" onClick={()=>setIsOpen(false)} className="text-lg font-bold text-slate-700">Features</Link>
          <Link href="/how-it-works" onClick={()=>setIsOpen(false)} className="text-lg font-bold text-slate-700">How it works</Link>
          <Link href="/pricing" onClick={()=>setIsOpen(false)} className="text-lg font-bold text-slate-700">Pricing</Link>
          <hr className="border-slate-100" />
          <Link href={'/login'} onClick={()=>setIsOpen(false)} className="text-lg font-bold text-slate-900 text-left">Login</Link>
          <button className="bg-amber-500 text-slate-900 w-full py-4 rounded-xl font-black text-lg">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;