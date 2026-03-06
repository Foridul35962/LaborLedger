import React from 'react';
import { UserPlus, Clock, Zap, FileCheck, ArrowRight, PlayCircle, CheckCircle2 } from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      number: "01",
      title: "Onboard Your Workforce",
      description: "Supervisors register workers by entering their names, phone numbers, and wage types—either Daily or Hourly. Set custom base rates and overtime multipliers for each worker.",
      icon: <UserPlus className="text-white" size={28} />,
      color: "bg-blue-600",
      details: ["Define Wage Types", "Set Base Rates", "Overtime Logic Configuration"]
    },
    {
      number: "02",
      title: "Digital Attendance Log",
      description: "Eliminate paper logs. When a worker arrives at the site, the supervisor simply taps 'Check-In'. At the end of the shift, 'Check-Out' captures the exact departure time.",
      icon: <Clock className="text-white" size={28} />,
      color: "bg-amber-500",
      details: ["One-Tap Recording", "Timestamp Verification", "Real-time Attendance Status"]
    },
    {
      number: "03",
      title: "Automated Calculation Engine",
      description: "The system automatically processes the hours. It applies the 4-hour half-day rule, detects overtime beyond 8 hours, and calculates the total daily payable amount instantly.",
      icon: <Zap className="text-white" size={28} />,
      color: "bg-emerald-600",
      details: ["Daily Wage Math", "Overtime Multiplier", "Leave Deduction Logic"]
    },
    {
      number: "04",
      title: "Settlement & Reporting",
      description: "At the end of the week, generate a comprehensive wage report. Review total hours, overtime, and final pay. Once the cash is handed over, mark the status as 'Paid'.",
      icon: <FileCheck className="text-white" size={28} />,
      color: "bg-purple-600",
      details: ["Weekly Pay Summaries", "Transparency Logs", "Payment Status Tracking"]
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen font-sans">
      
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
          How LaborLedger <br />
          <span className="text-amber-600">Automates Your Workflow</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          From the first check-in to the final weekly payout, LaborLedger ensures 
          every minute is recorded and every cent is calculated accurately.
        </p>
      </div>

      {/* Vertical Steps Layout */}
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* The Vertical Connecting Line (Desktop Only) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-100 -translate-x-1/2 hidden md:block"></div>

        <div className="space-y-32">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col md:flex-row items-center gap-16 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Content Side */}
              <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <span className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${step.color} shadow-lg text-white font-bold text-xl`}>
                    {step.number}
                  </span>
                  <span className="h-0.5 w-12 bg-slate-200 hidden md:block"></span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-slate-900">{step.title}</h2>
                <p className="text-slate-500 leading-relaxed text-lg">
                  {step.description}
                </p>
                
                <ul className="grid grid-cols-1 gap-3 pt-4">
                  {step.details.map((detail, dIndex) => (
                    <li key={dIndex} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <CheckCircle2 size={18} className="text-amber-500" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual "App Mockup" Side */}
              <div className="flex-1 w-full">
                <div className="bg-slate-50 border-2 border-slate-100 rounded-[3rem] p-4 shadow-inner">
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 aspect-video flex flex-col items-center justify-center group hover:border-amber-400 transition-all duration-500 transform hover:-translate-y-2">
                    <div className={`${step.color} w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl`}>
                      {step.icon}
                    </div>
                    <div className="w-full space-y-3">
                      <div className="h-3 w-3/4 bg-slate-100 rounded-full mx-auto"></div>
                      <div className="h-3 w-1/2 bg-slate-100 rounded-full mx-auto"></div>
                    </div>
                    <p className="mt-8 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Process Visualization</p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Final Logic Note */}
      <div className="mt-32 max-w-4xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-500 to-transparent"></div>
          <h3 className="text-white text-3xl font-bold mb-4">Built for Reliability</h3>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Our backend logic is designed to handle mid-day shifts and various worker types 
            automatically, reducing supervisor workload by 70%.
          </p>
          <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-2xl font-black flex items-center gap-3 mx-auto transition-all">
            Start Digital Tracking Now <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;