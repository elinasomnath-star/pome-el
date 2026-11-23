import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import CompanyBrandIcon from '../common/CompanyBrandIcon';
import { generateShockTimeline } from '../../engine/timeline';
import {
  Rocket,
  Flame,
  Scale,
  TrendingUp,
  Snowflake,
  ShieldAlert,
  RotateCcw,
  Sliders,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';

export default function ShockLabView() {
  const {
    allShocks,
    activeShocks,
    toggleShock,
    resetShocks,
    shockParams,
    setShockSeverity,
    setShockDuration,
    baselineForces,
    currentCompanies,
    baselineCompanies
  } = useSimStore();

  const [expandedTheory, setExpandedTheory] = useState({});

  const toggleTheory = (id) => {
    setExpandedTheory(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const shockIcons = {
    new_funded_entrant: Rocket,
    price_war: Flame,
    gst_regulation_spike: Scale,
    supplier_cost_spike: TrendingUp,
    funding_drought: Snowflake
  };

  const activeWithParams = activeShocks.map(s => ({
    shock: s,
    severity: shockParams[s.id]?.severity || 1.0,
    durationQuarters: shockParams[s.id]?.durationQuarters || 4,
    startQuarter: 1
  }));

  const timelineData = generateShockTimeline(baselineForces, baselineCompanies, activeWithParams, 8);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-6">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
              Macro & Competitive Shock Lab
            </h2>
            <span className="text-xs px-3 py-1 rounded-full font-mono font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30">
              Stress-Testing Engine
            </span>
          </div>
          <p className="text-sm text-slate-300">
            Apply external disruptions with adjustable severity and multi-quarter duration to stress-test market resilience.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 font-mono text-xs text-slate-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Active: <strong className="text-white">{activeShocks.length}</strong> / {allShocks.length} Shocks</span>
          </div>

          <button
            onClick={resetShocks}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-mono text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-950/30"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Shocks</span>
          </button>
        </div>
      </div>

      {/* Grid of Shock Cards (Spacious, clean layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allShocks.map(shock => {
          const isActive = activeShocks.some(s => s.id === shock.id);
          const IconComponent = shockIcons[shock.id] || ShieldAlert;
          const currentSeverity = shockParams[shock.id]?.severity || 1.0;
          const currentDuration = shockParams[shock.id]?.durationQuarters || 4;
          const isTheoryOpen = expandedTheory[shock.id];

          return (
            <SpotlightCard
              key={shock.id}
              spotlightColor={isActive ? "rgba(244, 63, 94, 0.2)" : "rgba(139, 92, 246, 0.12)"}
              className={`p-6 border transition-all duration-300 flex flex-col justify-between space-y-5 ${
                isActive
                  ? 'border-rose-500/60 bg-gradient-to-b from-dark-800 to-rose-950/20 shadow-xl shadow-rose-950/25'
                  : 'border-slate-800 bg-dark-800/80 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${
                      isActive
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : 'bg-dark-900 border-slate-700 text-slate-400'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold tracking-wider">
                        {shock.category}
                      </span>
                      <h3 className="text-base font-bold text-white leading-tight font-sans">
                        {shock.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleShock(shock.id)}
                    className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600'
                        : 'bg-dark-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {isActive ? 'ACTIVE' : 'APPLY'}
                  </button>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {shock.summary}
                </p>

                {/* Impact Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-dark-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Market Growth:</span>
                    <span className={`text-sm font-bold ${shock.marketGrowthDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {shock.marketGrowthDelta > 0 ? '+' : ''}{shock.marketGrowthDelta}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-dark-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Operating Cost:</span>
                    <span className={`text-sm font-bold ${shock.costDelta <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {shock.costDelta > 0 ? '+' : ''}{shock.costDelta}%
                    </span>
                  </div>
                </div>

                {/* Severity & Duration Tuning */}
                <div className="p-3.5 rounded-xl bg-dark-950/70 border border-slate-800 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Severity:
                      </span>
                      <strong className="text-cyan-300 font-bold">{currentSeverity}x</strong>
                    </div>
                    <input
                      type="range"
                      min="0.25"
                      max="2.0"
                      step="0.25"
                      value={currentSeverity}
                      onChange={(e) => setShockSeverity(shock.id, parseFloat(e.target.value))}
                      className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-violet-400" /> Duration:
                      </span>
                      <strong className="text-violet-300 font-bold">{currentDuration} Quarters</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="1"
                      value={currentDuration}
                      onChange={(e) => setShockDuration(shock.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
                    />
                  </div>
                </div>

                {/* Progressive Disclosure: Theory Link & Notes */}
                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => toggleTheory(shock.id)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                    <span>{isTheoryOpen ? 'Hide Theory Connection' : 'Show Theory & POSDCORB'}</span>
                    {isTheoryOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isTheoryOpen && (
                    <div className="mt-3 space-y-2 p-3.5 rounded-xl bg-dark-950 border border-slate-800 text-xs animate-in fade-in">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">POSDCORB:</span>
                        {shock.posdcorbTags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Approach:</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-violet-950 text-violet-300 border border-violet-500/30">
                          {shock.managementApproach}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 italic pt-1 leading-snug">
                        {shock.managementNote}
                      </p>
                    </div>
                  )}
                </div>

              </div>

              <div className="pt-3 border-t border-slate-800/60 text-[10px] font-mono text-slate-500 truncate">
                Precedent: {shock.source}
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      {/* Multi-Quarter Trajectory Table */}
      <div className="rounded-2xl border border-slate-800 bg-dark-900/90 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Multi-Quarter Shock Timeline (Q1 - Q8 Trajectory)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Simulates dynamic propagation across 8 quarters as shocks take effect, scale up, and expire.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {activeShocks.length === 0 ? 'No active shocks (steady state)' : `${activeShocks.length} Shocks Active`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3">Timeline Quarter</th>
                <th className="py-3 px-3">Active Disruptions</th>
                <th className="py-3 px-3">Attractiveness Index</th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <CompanyBrandIcon id="blinkit" className="w-5 h-5" showBg={true} />
                    <span>Blinkit</span>
                  </div>
                </th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <CompanyBrandIcon id="zepto" className="w-5 h-5" showBg={true} />
                    <span>Zepto</span>
                  </div>
                </th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <CompanyBrandIcon id="swiggy_instamart" className="w-5 h-5" showBg={true} />
                    <span>Instamart</span>
                  </div>
                </th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <CompanyBrandIcon id="bigbasket_now" className="w-5 h-5" showBg={true} />
                    <span>BB Now</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {timelineData.map(q => (
                <tr key={q.quarter} className="hover:bg-dark-800/40">
                  <td className="py-3.5 px-3 font-bold text-white font-mono">{q.quarter}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded text-xs bg-dark-800 border border-slate-700 text-slate-300 font-semibold">
                      {q.activeShockCount} active
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-cyan-300 text-sm">
                    {q.attractivenessIndex.toFixed(2)} / 10
                  </td>
                  <td className="py-3.5 px-3 text-yellow-300 font-medium">{q.firms.blinkit}%</td>
                  <td className="py-3.5 px-3 text-pink-300 font-medium">{q.firms.zepto}%</td>
                  <td className="py-3.5 px-3 text-orange-300 font-medium">{q.firms.swiggy_instamart}%</td>
                  <td className="py-3.5 px-3 text-emerald-300 font-medium">{q.firms.bigbasket_now}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
