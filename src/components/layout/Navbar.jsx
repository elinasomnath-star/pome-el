import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import { Zap, ShieldAlert, Sparkles, Building2, TrendingUp, Info } from 'lucide-react';
import ShinyText from '../reactbits/ShinyText';

export default function Navbar() {
  const {
    selectedCompanyId,
    setSelectedCompanyId,
    baselineCompanies,
    activeShocks,
    industryAttractiveness,
    activeTab,
    setActiveTab
  } = useSimStore();

  const currentCompany = baselineCompanies.find(c => c.id === selectedCompanyId) || baselineCompanies[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-dark-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Course Tag */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('overview')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-pink-500 to-cyan-400 p-0.5 shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
              <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/30" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white font-sans">
                  StratSim
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  v1.0 Edu
                </span>
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                Strategy Under Fire &bull; Indian Quick Commerce
              </div>
            </div>
          </div>
        </div>

        {/* Global Status Telemetry */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          {/* Industry Attractiveness pill */}
          <div
            onClick={() => setActiveTab('forces')}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-800 border border-slate-700/80 hover:border-slate-600 transition-colors"
          >
            <span className="text-slate-400">Industry Attractiveness:</span>
            <span className={`font-bold ${
              industryAttractiveness.attractivenessIndex >= 4.5 ? 'text-emerald-400' :
              industryAttractiveness.attractivenessIndex >= 3.0 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {industryAttractiveness.attractivenessIndex.toFixed(1)} / 10
            </span>
          </div>

          {/* Active Shocks indicator */}
          <div
            onClick={() => setActiveTab('shocks')}
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              activeShocks.length > 0
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 shadow-sm shadow-rose-500/20'
                : 'bg-dark-800 border-slate-700/80 text-slate-400'
            }`}
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${activeShocks.length > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
            <span>
              {activeShocks.length === 0 ? 'No Shocks Active' : `${activeShocks.length} Active Shock${activeShocks.length > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* Company Selector Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="appearance-none bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-medium text-slate-100 hover:border-violet-500/60 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all cursor-pointer shadow-md"
            >
              {baselineCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.marketShare}%)
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}

