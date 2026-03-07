"use client"

import React, { useEffect, useState } from 'react';
import { Construction, HardHat } from 'lucide-react';

const FirstLoad = () => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 1 : 100));
        }, 30);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-9999 bg-slate-900 flex flex-col items-center justify-center overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                <div
                    className="h-full bg-amber-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="relative flex flex-col items-center">

                <div className="relative mb-8">
                    <div className="w-24 h-24 bg-amber-500 rounded-3xl rotate-12 animate-pulse absolute inset-0 blur-xl opacity-20"></div>
                    <div className="relative w-24 h-24 bg-slate-800 border-2 border-amber-500/30 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
                        <Construction size={48} className="text-amber-500" />
                    </div>
                    <div className="absolute -top-4 -right-4 bg-white p-2 rounded-lg shadow-lg animate-bounce delay-150">
                        <HardHat size={20} className="text-slate-900" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
                    Site<span className="text-amber-500">Track</span>
                </h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
                    Setting up your workspace...
                </p>

                <div className="mt-8 text-amber-500/50 font-mono text-sm">
                    {progress}%
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-4 flex">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className={`flex-1 h-full ${i % 2 === 0 ? 'bg-amber-500' : 'bg-slate-900'} -skew-x-12`}
                    ></div>
                ))}
            </div>

        </div>
    );
};

export default FirstLoad;