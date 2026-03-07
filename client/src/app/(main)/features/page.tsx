import React from 'react';
import { 
  Users, 
  Clock, 
  Calculator, 
  CalendarCheck, 
  FileSpreadsheet, 
  ShieldCheck,
  CheckCircle2,
  Construction
} from 'lucide-react';

const FeaturesPage = () => {
  const mainFeatures = [
    {
      icon: <Users size={32} />,
      title: "Worker Management",
      description: "Easily add and categorize workers by wage type (Daily or Hourly) and set custom rates.",
      points: ["Store worker details", "Set base & overtime rates", "Quick search & edit"]
    },
    {
      icon: <Clock size={32} />,
      title: "Smart Attendance",
      description: "A digital punch-in/out system that records precise arrival and departure times.",
      points: ["One-tap check-in", "Automated hours logic", "Real-time daily status"]
    },
    {
      icon: <Calculator size={32} />,
      title: "Auto Wage Logic",
      description: "Eliminate manual math. Our system calculates total pay including overtime automatically.",
      points: ["Overtime detection", "Half-day/Full-day logic", "Error-free calculations"]
    },
    {
      icon: <CalendarCheck size={32} />,
      title: "Leave Management",
      description: "Track worker absences without messing up your payroll records.",
      points: ["Mark full/half day leaves", "Exclude leaves from wages", "Historical leave logs"]
    },
    {
      icon: <FileSpreadsheet size={32} />,
      title: "Weekly Wage Reports",
      description: "Generate professional reports every week to settle payments with total transparency.",
      points: ["Total hours & overtime", "Mark payment status", "Downloadable summaries"]
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Multi-Role Access",
      description: "Secure roles for Supervisors and Admins to manage site operations effectively.",
      points: ["Supervisor dashboards", "Admin site visibility", "Role-based permissions"]
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full mb-6 text-sm font-bold uppercase tracking-wider">
          <Construction size={16} /> Powerful Features
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
          Everything you need to <br /> 
          <span className="text-amber-600">manage your workforce.</span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
          LaborLedger digitizes the messy paperwork of construction sites into a clean, 
          automated dashboard that saves time and money.
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300 group"
            >
              <div className="mb-6 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                {feature.description}
              </p>
              
              <ul className="space-y-3 pt-6 border-t border-slate-100">
                {feature.points.map((point, pIndex) => (
                  <li key={pIndex} className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Final Logic Callout */}
      <div className="max-w-5xl mx-auto px-6 mt-24">
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-32 -mt-32"></div>
          
          <div className="flex-1 z-10 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4">Precision Logic Included</h3>
            <p className="text-slate-400 text-sm">
              Our system automatically calculates overtime based on a standard 8-hour workday. 
              Less than 4 hours? It's a half-day. More than 8? The overtime engine kicks in.
            </p>
          </div>
          
          <div className="shrink-0 z-10">
            <button className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-amber-500 transition-colors">
              Explore Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;