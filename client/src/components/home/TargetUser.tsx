import React from 'react';
import { HardHat, Users, Building2, CheckCircle2 } from 'lucide-react';

const TargetUser = () => {
  const users = [
    {
      role: "Worker",
      title: "👷 Worker",
      icon: <HardHat size={40} className="text-amber-600" />,
      features: [
        "View attendance history",
        "See daily & weekly wage summary",
        "Ensure transparent payment tracking"
      ],
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      role: "Supervisor",
      title: "🧑‍💼 Supervisor",
      icon: <Users size={40} className="text-blue-600" />,
      features: [
        "Quickly add & manage workers",
        "One-tap attendance tracking",
        "Generate weekly wage reports"
      ],
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      role: "Site Owner",
      title: "🏗 Site Owner",
      icon: <Building2 size={40} className="text-emerald-600" />,
      features: [
        "Monitor total site expenses",
        "Track payment status (Paid/Unpaid)",
        "Audit logs for site transparency"
      ],
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-amber-500 font-bold tracking-widest uppercase mb-3">
            Who Is It For?
          </h2>
          <h3 className="text-3xl md:text-5xl font-black mb-6">
            Built For Construction Teams
          </h3>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            LaborLedger helps everyone involved in the construction process stay on the same page.
          </p>
        </div>

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {users.map((user, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden group p-8 rounded-2xl border-2 ${user.borderColor} transition-all duration-500 hover:-translate-y-2 bg-slate-800/50 backdrop-blur-sm`}
            >
              {/* Icon Background Decoration */}
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {user.icon}
              </div>

              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-xl ${user.bgColor} flex items-center justify-center mb-6`}>
                  {user.icon}
                </div>

                <h4 className="text-2xl font-bold mb-6 text-white leading-tight">
                  {user.title}
                </h4>

                <ul className="space-y-4">
                  {user.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3 text-slate-300">
                      <CheckCircle2 size={18} className="text-amber-500 mt-1 shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>

        {/* Industry Trust Note */}
        <div className="mt-16 text-center opacity-60">
          <p className="text-sm uppercase tracking-widest">
            Streamlining Workflow • Reducing Disputes • Increasing Trust
          </p>
        </div>
      </div>
    </section>
  );
};

export default TargetUser;