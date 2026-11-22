import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import GradientText from '../reactbits/GradientText';
import {
  Rocket,
  Flame,
  Scale,
  TrendingUp,
  Snowflake,
  ShieldAlert,
  Clock,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  History,
  Layers
} from 'lucide-react';

export default function ShockLabView() {
  const {
    allShocks,
    activeShocks,
    toggleShock,
    resetShocks,
    shockHistory,
    baselineForces,
    currentForceScores,
    industryAttractiveness,
    currentCompanies,
    baselineCompanies,
    setActiveTab
  } = useSimStore();

  const shockIcons = {
    new_funded_entrant: Rocket,
    price_war: Flame,
    gst_regulation_spike: Scale,
    supplier_cost_spike: TrendingUp,
    funding_drought: Snowflake
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
              Macro & Competitive Shock Lab
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Stress-Testing Engine
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Simulate real-world quick commerce turbulence. Watch changes propagate through Porter's 5 Forces, BCG quadrants, and firm market shares.
          </p>
        </div>

        {/* Global Shock Stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-dark-800 border border-slate-700 font-mono text-xs text-slate-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Active: <strong className="text-white">{activeShocks.length}</strong> / {allShocks.length}</span>
          </div>

          {activeShocks.length > 0 && (
            <button
              onClick={resetShocks}
              className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-rose-950/40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Shocks</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Shock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {allShocks.map(shock => {
          const isActive = activeShocks.some(s => s.id === shock.id);
          const IconComponent = shockIcons[shock.id] || ShieldAlert;

          return (
            <SpotlightCard
              key={shock.id}
              spotlightColor={isActive ? "rgba(244, 63, 94, 0.25)" : "rgba(139, 92, 246, 0.15)"}
              className={`p-5 border transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? 'border-rose-500/60 bg-gradient-to-b from-dark-800 to-rose-950/20 shadow-xl shadow-rose-950/20'
                  : 'border-slate-800 bg-dark-800/80 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      isActive
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : 'bg-dark-900 border-slate-700 text-slate-400'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400">
                        {shock.category}
                      </span>
                      <h3 className="text-base font-bold text-white leading-tight font-sans">
                        {shock.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleShock(shock.id)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
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

                {/* Quantitative Impact Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-dark-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Market Growth:</span>
                    <span className={`font-bold ${shock.marketGrowthDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {shock.marketGrowthDelta > 0 ? '+' : ''}{shock.marketGrowthDelta}%
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-dark-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Operating Cost:</span>
                    <span className={`font-bold ${shock.costDelta <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {shock.costDelta > 0 ? '+' : ''}{shock.costDelta}%
                    </span>
                  </div>
                </div>

                {/* Case Layer: POSDCORB + Management Approach Tags (Unit I) */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono">POSDCORB:</span>
                    {shock.posdcorbTags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-cyan-950/40 text-cyan-300 border border-cyan-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">School:</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-violet-950/40 text-violet-300 border border-violet-500/30">
                      {shock.managementApproach}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 italic leading-snug">
                    {shock.managementNote}
                  </p>
                </div>

              </div>

              {/* Rationale & Source Footer */}
              <div className="pt-3 border-t border-slate-800/80 mt-3 text-[10px] text-slate-500">
                <span>Precedent: {shock.source}</span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      {/* Before vs After Impact Comparative Table */}
      <div className="rounded-2xl border border-slate-800 bg-dark-900/90 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Before vs. After Shock Comparison</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {activeShocks.length} Active Shocks Simulated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Baseline Share</th>
                <th className="py-2.5 px-3">Simulated Share</th>
                <th className="py-2.5 px-3">Delta</th>
                <th className="py-2.5 px-3">Growth Rate</th>
                <th className="py-2.5 px-3">Est Revenue (FY24)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {currentCompanies.map(firm => {
                const base = baselineCompanies.find(b => b.id === firm.id) || firm;
                const shareDelta = Number((firm.marketShare - base.marketShare).toFixed(1));

                return (
                  <tr key={firm.id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: firm.color }} />
                      {firm.name}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{base.marketShare}%</td>
                    <td className="py-3 px-3 font-bold text-white">{firm.marketShare}%</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        shareDelta > 0 ? 'bg-emerald-500/20 text-emerald-400' :
                        shareDelta < 0 ? 'bg-rose-500/20 text-rose-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {shareDelta > 0 ? `+${shareDelta}%` : `${shareDelta}%`}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-cyan-400 font-semibold">
                      +{firm.annualGrowthRate}%
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-semibold">
                      ₹{firm.revenue} Cr
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applied Shocks Timeline Log */}
      {shockHistory.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-dark-900/60 p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <History className="w-4 h-4 text-violet-400" />
            <span>Applied Shocks Timeline Log</span>
          </div>

          <div className="space-y-2">
            {shockHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-dark-800 border border-slate-800 text-xs font-mono"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-slate-500">[{item.timestamp}]</span>
                  <span className="font-bold text-white">{item.shock.name}</span>
                </div>
                <span className="text-cyan-400">{item.impactSummary}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

