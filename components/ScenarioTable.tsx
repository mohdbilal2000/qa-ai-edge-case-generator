
import React from 'react';
import { TestCase, Severity } from '../types';

interface ScenarioTableProps {
  scenarios: TestCase[];
}

export const ScenarioTable: React.FC<ScenarioTableProps> = ({ scenarios }) => {
  if (scenarios.length === 0) return null;

  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('security') || cat.includes('input')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (cat.includes('api') || cat.includes('network')) return 'bg-sky-100 text-sky-800 border-sky-200';
    if (cat.includes('concurrency') || cat.includes('state')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (cat.includes('business') || cat.includes('logic')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (cat.includes('data') || cat.includes('limit')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getSeverityStyles = (severity: Severity) => {
    switch (severity) {
      case 'Critical': return 'bg-slate-900 text-rose-500 border-rose-900/50';
      case 'High': return 'bg-rose-500 text-white border-rose-600';
      case 'Medium': return 'bg-amber-500 text-white border-amber-600';
      case 'Low': return 'bg-blue-500 text-white border-blue-600';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="mt-12 overflow-hidden bg-white border border-slate-200 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800">
              <th scope="col" className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tier</th>
              <th scope="col" className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Strategy</th>
              <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Destructive Scenario</th>
              <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Simulation Data / Action</th>
              <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Defense Validation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scenarios.map((scenario, idx) => (
              <tr key={idx} className="group hover:bg-slate-50 transition-all duration-200">
                <td className="px-6 py-6 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border ${getSeverityStyles(scenario.severity)}`}>
                    {scenario.severity}
                  </span>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getCategoryColor(scenario.category)}`}>
                    {scenario.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <p className="text-base font-bold text-slate-900 leading-snug">
                    {scenario.description}
                  </p>
                </td>
                <td className="px-8 py-6">
                  <div className="relative group/code">
                    <code className="block bg-slate-900 text-indigo-300 px-4 py-3 rounded-xl text-sm font-mono border border-slate-800 shadow-inner break-all overflow-hidden max-w-[280px] group-hover:bg-slate-800 transition-colors">
                      {scenario.testData}
                    </code>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                    {scenario.expectedResult}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
