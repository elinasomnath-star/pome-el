import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import CompanyBrandIcon from '../common/CompanyBrandIcon';
import {
  Zap,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Layers,
  Eye,
  Maximize2,
  Minimize2,
  Sparkle
} from 'lucide-react';

export default function Navbar({
  onOpenDemo,
  onOpenGlossary,
  onOpenScenarios,
  reduceEffects,
  onToggleReduceEffects,
  presentationMode,
  onTogglePresentationMode
}) {
  const {
    selectedCompanyId,
    setSelectedCompanyId,
    baselineCompanies,
    activeShocks,
    industryAttractiveness,
    setActiveTab
  } = useSimStore();

  const currentCompany = baselineCompanies.find(c => c.id === selectedCompanyId) || baselineCompanies[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-dark-900/80 backdrop-blur-xl print:hidden">
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
                  v2.0 Edu
                </span>
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                Strategy Under Fire &bull; Indian Quick Commerce
              </div>
            </div>
          </div>
        </div>

        {/* Center Actions: Guided Demo, Scenarios, Glossary */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
          <button
            onClick={onOpenDemo}
            className="px-3 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 flex items-center gap-1.5 transition-all shadow-sm shadow-violet-950"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Guided Demo</span>
          </button>

          <button
            onClick={onOpenScenarios}
            className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-slate-700 text-slate-300 flex items-center gap-1.5 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scenarios</span>
          </button>

          <button
            onClick={onOpenGlossary}
            className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-slate-700 text-slate-300 flex items-center gap-1.5 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            <span>Glossary</span>
          </button>
        </div>

        {/* Global Controls & Company Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Reduce Effects Toggle (Requirement 12) */}
          <button
            onClick={onToggleReduceEffects}
            className={`p-2 rounded-xl border text-xs font-mono transition-all ${
              reduceEffects
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                : 'bg-dark-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={reduceEffects ? "Effects reduced (Low CPU mode)" : "Reduce GPU/Canvas effects"}
          >
            <Sparkle className="w-3.5 h-3.5" />
          </button>

          {/* Presentation Mode Toggle (Requirement 14) */}
          <button
            onClick={onTogglePresentationMode}
            className={`p-2 rounded-xl border text-xs font-mono transition-all ${
              presentationMode
                ? 'bg-violet-600 text-white border-violet-500'
                : 'bg-dark-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Presentation Mode (or press 'F')"
          >
            {presentationMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Company Selector Dropdown with Brand Icon */}
          <div className="relative flex items-center gap-2 bg-dark-800 border border-slate-700 rounded-xl px-2.5 py-1 hover:border-violet-500/60 transition-colors shadow-md">
            <CompanyBrandIcon id={selectedCompanyId} className="w-7 h-7" showBg={true} />
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="appearance-none bg-transparent pr-6 text-xs font-bold text-slate-100 focus:outline-none cursor-pointer"
            >
              {baselineCompanies.map((c) => (
                <option key={c.id} value={c.id} className="bg-dark-900 text-slate-100 py-1">
                  {c.name} ({c.marketShare}%)
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
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
