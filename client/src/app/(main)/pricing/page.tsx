import React from 'react';
import { Check, Zap, Building2, HardHat, ShieldCheck } from 'lucide-react';

const PricingPage = () => {
  const plans = [
    {
      name: "Starter",
      icon: <HardHat className="text-slate-400" size={24} />,
      price: "0",
      description: "Perfect for small local projects and individual contractors.",
      features: [
        "Up to 15 Workers",
        "Daily Attendance Marking",
        "Basic Wage Calculation",
        "Weekly Summary Reports",
        "Mobile Responsive Access"
      ],
      buttonText: "Start for Free",
      highlight: false
    },
    {
      name: "Site Pro",
      icon: <Zap className="text-amber-500" size={24} />,
      price: "29",
      description: "Advanced features for busy supervisors managing large teams.",
      features: [
        "Up to 100 Workers",
        "Automated Overtime Logic",
        "PDF Report Export",
        "Leave Management System",
        "Payment Status Tracking",
        "Priority Support"
      ],
      buttonText: "Get Pro Access",
      highlight: true
    },
    {
      name: "Enterprise",
      icon: <Building2 className="text-slate-400" size={24} />,
      price: "99",
      description: "Complete visibility for companies with multiple construction sites.",
      features: [
        "Unlimited Workers",
        "Multiple Site Management",
        "Admin Expense Dashboard",
        "Audit Logs & History",
        "API Access for ERP",
        "Dedicated Account Manager"
      ],
      buttonText: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
            Simple, Transparent <span className="text-amber-600">Pricing</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            No hidden fees. Choose a plan that fits your site size and start 
            digitizing your attendance and payroll today.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-300 hover:shadow-2xl flex flex-col ${
                plan.highlight ? 'border-amber-500 shadow-xl scale-105 z-10' : 'border-slate-100'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">${plan.price}</span>
                  <span className="text-slate-400 font-medium">/month</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-tighter">Billed monthly</p>
              </div>

              <ul className="space-y-4 mb-10 grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <Check size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95 ${
                plan.highlight 
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-lg shadow-amber-200' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
              }`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Preview / Trust Note */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-12 border-t border-slate-200 pt-16">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <ShieldCheck className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Cancel Anytime</p>
              <p className="text-xs text-slate-500 leading-tight">Switch plans or cancel whenever your project ends.</p>
            </div>
          </div>
          <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
          <div className="text-center md:text-left">
            <p className="text-slate-600 text-sm font-medium">
              Need a custom plan for a government contract or mega-project? 
              <span className="text-amber-600 font-bold ml-1 cursor-pointer hover:underline">Talk to us.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;