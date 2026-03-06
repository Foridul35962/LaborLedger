import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const CallToAction = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main CTA Box */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
          
          {/* Subtle Accent Background Decorations */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Tagline */}
            <div className="flex justify-center mb-6">
              <span className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-amber-400 text-sm font-bold uppercase tracking-wider border border-white/10">
                <Sparkles size={14} /> Ready to go digital?
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Start Managing Your <br /> Site Efficiently
            </h2>
            
            {/* Description */}
            <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Digitize attendance, automate calculations, and 
              <span className="text-white font-semibold"> avoid wage disputes</span> with LaborLedger.
            </p>

            {/* Button */}
            <div className="flex justify-center">
              <Link href={"/login"} className="group bg-amber-500 hover:bg-amber-600 text-slate-900 px-10 py-5 rounded-2xl font-black text-xl transition-all duration-300 shadow-xl hover:shadow-amber-500/20 flex items-center gap-3 active:scale-95">
                Start Using LaborLedger
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;