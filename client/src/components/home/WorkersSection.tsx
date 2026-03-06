import React from 'react';
import { UserPlus, Clock, Calculator, FileText } from 'lucide-react';

const WorkersSection = () => {
  const steps = [
    {
      id: "01",
      icon: <UserPlus className="text-white" size={28} />,
      title: "Add Workers",
      description: "Register workers with wage type (Daily/Hourly) and fixed base rates.",
      color: "bg-blue-600",
      emoji: "1️⃣"
    },
    {
      id: "02",
      icon: <Clock className="text-white" size={28} />,
      title: "Mark Attendance",
      description: "Supervisor marks daily check-in and check-out times with one click.",
      color: "bg-orange-500",
      emoji: "2️⃣"
    },
    {
      id: "03",
      icon: <Calculator className="text-white" size={28} />,
      title: "Auto Calculation",
      description: "System automatically calculates total hours, half-days, and overtime pay.",
      color: "bg-green-600",
      emoji: "3️⃣"
    },
    {
      id: "04",
      icon: <FileText className="text-white" size={28} />,
      title: "Weekly Wage Report",
      description: "Generate a summary of the week and mark payments as 'Paid' once cleared.",
      color: "bg-purple-600",
      emoji: "4️⃣"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-2">
            Workflow
          </h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900">
            How LaborLedger Works
          </h3>
          <div className="w-20 h-1.5 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-slate-200 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="group">
                <div className="flex flex-col items-center text-center">
                  
                  {/* Icon Circle */}
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mb-6`}>
                    {step.icon}
                  </div>

                  {/* Step Info */}
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 group-hover:border-amber-300 group-hover:bg-white group-hover:shadow-xl transition-all duration-300 w-full">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {step.id}</span>
                    <h4 className="text-xl font-bold text-slate-800 mt-1 mb-3 flex justify-center items-center gap-2">
                      {step.title}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA or Note */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-lg">
            "Simple, transparent, and built for the real world."
          </p>
        </div>
      </div>
    </section>
  );
};

export default WorkersSection;