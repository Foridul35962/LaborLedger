import React from 'react';
import { ClipboardList, Calculator, ClockAlert, FileWarning, Construction } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: <ClipboardList className="text-amber-600" size={32} />,
      title: "Manual Attendance Tracking",
      description: "Paper logs and verbal check-ins lead to lost data and human error.",
      emoji: "🚧"
    },
    {
      icon: <Calculator className="text-amber-600" size={32} />,
      title: "Wage Calculation Mistakes",
      description: "Inconsistent math for daily vs. hourly rates causes financial leaks.",
      emoji: "💰"
    },
    {
      icon: <ClockAlert className="text-amber-600" size={32} />,
      title: "Overtime Not Recorded Properly",
      description: "Workers lose trust when their extra hours aren't accurately captured.",
      emoji: "⏱"
    },
    {
      icon: <FileWarning className="text-amber-600" size={32} />,
      title: "Weekly Payment Disputes",
      description: "Lack of clear reports makes it hard to settle wages at the end of the week.",
      emoji: "📄"
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Construction className="text-amber-500 animate-bounce" size={48} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Problems in Construction Site Management
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Traditional methods fail both supervisors and workers. SiteTrack bridges the gap 
            by digitizing the workflow to eliminate these common industry hurdles.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-4">
                {problem.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="text-2xl">{problem.emoji}</span> {problem.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Visual Callout */}
        <div className="mt-12 bg-amber-100 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-amber-800 font-medium italic">
            "Supervisors lose time, and workers lose trust. We’re here to fix that."
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;