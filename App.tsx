
import React, { useState } from 'react';
import { Platform, TestCase, GeneratorParams } from './types';
import { generateTestScenarios } from './services/geminiService';
import { Button } from './components/Button';
import { ScenarioTable } from './components/ScenarioTable';

const App: React.FC = () => {
  const [params, setParams] = useState<GeneratorParams>({
    featureName: '',
    platform: Platform.Web,
    context: ''
  });
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState<TestCase[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!params.featureName) {
      setError('Required: Please enter a target feature name to begin analysis.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await generateTestScenarios(params);
      setScenarios(results);
    } catch (err) {
      setError('Critical Error: Failed to communicate with the SDET Engine. Check network connectivity.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (scenarios.length === 0) return;

    const headers = ['Category', 'Severity', 'Description', 'Test Data / Action', 'Expected Result'];
    const csvContent = [
      headers.join(','),
      ...scenarios.map(s => [
        `"${s.category.replace(/"/g, '""')}"`,
        `"${s.severity.replace(/"/g, '""')}"`,
        `"${s.description.replace(/"/g, '""')}"`,
        `"${s.testData.replace(/"/g, '""')}"`,
        `"${s.expectedResult.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `destructive_matrix_v2_${params.featureName.toLowerCase().replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F1F5F9] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar - Command Center Style */}
      <aside className="w-full md:w-80 bg-[#0F172A] text-white p-6 flex flex-col border-r border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-10 relative z-10">
          <div className="p-2.5 bg-indigo-500 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white uppercase">SDET <span className="text-indigo-400">v2.0</span></h1>
        </div>

        <div className="flex-1 space-y-10 relative z-10">
          <div>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Architectural Engine</h2>
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-100">Principal Agent</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-emerald-400 font-black uppercase">Live</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Modeling race conditions and business logic violations.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Matrix Coverage</h2>
            <ul className="space-y-4 text-sm font-semibold">
              {[
                { label: 'Distributed Systems', color: 'bg-indigo-500' },
                { label: 'Concurrency & Race', color: 'bg-rose-500' },
                { label: 'API & Idempotency', color: 'bg-sky-500' },
                { label: 'Business Invariants', color: 'bg-emerald-500' }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors cursor-default group">
                  <span className={`w-2 h-2 ${item.color} rounded-full group-hover:scale-125 transition-transform`}></span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800/60 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-slate-700 flex items-center justify-center text-[10px] font-bold">MB</div>
            <p className="text-xs font-bold text-slate-200">Mohd Bilal</p>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Principal SDET Architect</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <div className="inline-flex items-center px-3 py-1 mb-6 text-[10px] font-black tracking-widest text-indigo-700 uppercase bg-indigo-100 rounded-lg border border-indigo-200">
              Architectural Analysis v2.0
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">
              QA <span className="text-indigo-600">Test Matrix</span> Generator
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl font-medium leading-relaxed">
              Analyze system architecture for concurrency issues, logic gaps, and API resilience.
            </p>
          </header>

          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200/50 mb-10 transition-all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div className="group">
                <label className="block text-xs font-black text-slate-500 mb-3 uppercase tracking-[0.15em] transition-colors group-focus-within:text-indigo-600">Target Feature</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-bold text-slate-800 text-lg shadow-sm"
                  placeholder="e.g. Distributed Inventory Lock"
                  value={params.featureName}
                  onChange={(e) => setParams({ ...params, featureName: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="block text-xs font-black text-slate-500 mb-3 uppercase tracking-[0.15em] transition-colors group-focus-within:text-indigo-600">Infrastructure Tier</label>
                <div className="relative">
                  <select 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-800 text-lg appearance-none cursor-pointer shadow-sm"
                    value={params.platform}
                    onChange={(e) => setParams({ ...params, platform: e.target.value as Platform })}
                  >
                    {Object.values(Platform).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10 group">
              <label className="block text-xs font-black text-slate-500 mb-3 uppercase tracking-[0.15em] transition-colors group-focus-within:text-indigo-600">Architecture Details & Flow</label>
              <textarea 
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all min-h-[160px] font-bold text-slate-800 text-lg placeholder:text-slate-400 shadow-sm leading-relaxed"
                placeholder="Describe microservices involved, database constraints, auth roles, or external dependencies..."
                value={params.context}
                onChange={(e) => setParams({ ...params, context: e.target.value })}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Button 
                onClick={handleGenerate} 
                isLoading={loading} 
                className="w-full sm:w-auto text-lg py-5 px-12 rounded-2xl font-black shadow-xl shadow-indigo-600/20 active:scale-95 transition-transform"
              >
                🚀 INITIATE v2.0 AUDIT
              </Button>
              
              {scenarios.length > 0 && (
                <Button 
                  variant="secondary" 
                  onClick={downloadCSV}
                  className="w-full sm:w-auto py-5 px-10 rounded-2xl font-black border-2 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  EXPORT MATRIX
                </Button>
              )}
            </div>

            {error && (
              <div className="mt-8 p-5 bg-rose-50 text-rose-800 border-2 border-rose-100 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex flex-col gap-1">
                  <span className="font-black text-sm uppercase tracking-wider">System Alert</span>
                  <p className="font-bold text-base">{error}</p>
                </div>
              </div>
            )}
          </section>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-8">
              <div className="relative">
                <div className="w-24 h-24 border-8 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-2xl animate-pulse">🏛️</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">System Modeling...</h3>
                <p className="text-slate-500 font-bold text-lg">Performing architectural stress analysis for v2.0 matrix.</p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-700">
              <ScenarioTable scenarios={scenarios} />
            </div>
          )}

          {scenarios.length === 0 && !loading && !error && (
            <div className="text-center py-28 px-6 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm">
              <div className="mb-8 inline-flex p-6 bg-slate-50 rounded-[2rem] text-slate-300 border border-slate-100 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-3 uppercase tracking-tight">Audit Ready</h3>
              <p className="text-slate-500 max-w-md mx-auto font-bold text-lg leading-relaxed">
                Provide architectural parameters to initiate a deep system audit and generate the test matrix.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
