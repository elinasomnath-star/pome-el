import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import GradientText from '../reactbits/GradientText';
import { generateShockTimeline } from '../../engine/timeline';
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
  Layers,
  Sliders,
  Calendar
} from 'lucide-react';

export default function ShockLabView() {
  const {
    allShocks,
    activeShocks,
    toggleShock,
    resetShocks,
    shockHistory,
    shockParams,
    setShockSeverity,
    setShockDuration,
    baselineForces,
    currentForceScores,
    industryAttractiveness,
    currentCompanies,
    baselineCompanies
  } = useSimStore();

  const shockIcons = {
    new_funded_entrant: Rocket,
    price_war: Flame,
    gst_regulation_spike: Scale,
    supplier_cost_spike: TrendingUp,
    funding_drought: Snowflake
  };

  // Generate 8-quarter timeline
  const activeWithParams = activeShocks.map(s => ({
    shock: s,
    severity: shockParams[s.id]?.severity || 1.0,
    durationQuarters: shockParams[s.id]?.durationQuarters || 4,
    startQuarter: 1
  }));

  const timelineData = generateShockTimeline(baselineForces, baselineCompanies, activeWithParams, 8);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
              Macro & Competitive Shock Lab (v2 Upgraded)
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Severity (0.25x - 2.0x) & Duration (1-8Q)
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Stack multiple industry disruptions with adjustable severity and multi-quarter duration to model macro resilience.
          </p>
        </div>

        {/* Global Shock Stats & Reset */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-dark-800 border border-slate-700 font-mono text-xs text-slate-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Active: <strong className="text-white">{activeShocks.length}</strong> / {allShocks.length} Stacked</span>
          </div>

          <button
            onClick={resetShocks}
            className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-rose-950/40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Shocks</span>
          </button>
        </div>
      </div>

      {/* Grid of Shock Cards with Severity & Duration Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {allShocks.map(shock => {
          const isActive = activeShocks.some(s => s.id === shock.id);
          const IconComponent = shockIcons[shock.id] || ShieldAlert;
          const currentSeverity = shockParams[shock.id]?.severity || 1.0;
          const currentDuration = shockParams[shock.id]?.durationQuarters || 4;

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

                {/* Controls: Severity Slider & Duration (Requirement 6) */}
                <div className="p-3 rounded-xl bg-dark-950/80 border border-slate-800 space-y-3">
                  {/* Severity Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-cyan-400" /> Severity:
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
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>0.25x (Mild)</span>
                      <span>1.0x (Standard)</span>
                      <span>2.0x (Severe)</span>
                    </div>
                  </div>

                  {/* Duration Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-violet-400" /> Duration:
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
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>1 Qtr</span>
                      <span>4 Qtrs (1 Yr)</span>
                      <span>8 Qtrs (2 Yrs)</span>
                    </div>
                  </div>
                </div>

                {/* Case Layer: POSDCORB + Management Approach Tags */}
                <div className="pt-1 border-t border-slate-800/80 space-y-2">
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
                    <span className="text-[10px] text-slate-400 font-mono">Approach:</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-violet-950/40 text-violet-300 border border-violet-500/30">
                      {shock.managementApproach}
                    </span>
                  </div>
                </div>

              </div>

              {/* Source Footer */}
              <div className="pt-3 border-t border-slate-800/80 mt-3 text-[10px] text-slate-500">
                <span>Precedent: {shock.source}</span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      {/* Quarter-by-Quarter Timeline Chart (Requirement 6) */}
      <div className="rounded-2xl border border-slate-800 bg-dark-900/90 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Multi-Quarter Shock Timeline (Q1 - Q8 Trajectory)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulates dynamic propagation across 8 quarters as shocks take effect, scale up, and expire.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {activeShocks.length === 0 ? 'No active shocks (steady state)' : `${activeShocks.length} Shocks Propagating`}
          </span>
        </div>

        {/* Timeline Grid Table / Bar representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Timeline Quarter</th>
                <th className="py-2.5 px-3">Active Shocks</th>
                <th className="py-2.5 px-3">Industry Attractiveness</th>
                <th className="py-2.5 px-3">Blinkit Share</th>
                <th className="py-2.5 px-3">Zepto Share</th>
                <th className="py-2.5 px-3">Instamart Share</th>
                <th className="py-2.5 px-3">BB Now Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {timelineData.map(q => (
                <tr key={q.quarter} className="hover:bg-dark-800/40">
                  <td className="py-3 px-3 font-bold text-white font-mono">{q.quarter}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-dark-800 border border-slate-700 text-slate-300">
                      {q.activeShockCount} active
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-cyan-300">
                    {q.attractivenessIndex.toFixed(2)} / 10
                  </td>
                  <td className="py-3 px-3 text-yellow-300 font-semibold">{q.firms.blinkit}%</td>
                  <td className="py-3 px-3 text-pink-300 font-semibold">{q.firms.zepto}%</td>
                  <td className="py-3 px-3 text-orange-300 font-semibold">{q.firms.swiggy_instamart}%</td>
                  <td className="py-3 px-3 text-emerald-300 font-semibold">{q.firms.bigbasket_now}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Before vs After Impact Comparative Table */}
      <div className="rounded-2xl border border-slate-800 bg-dark-900/90 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Before vs. After Shock Comparison Table</span>
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

    </div>
  );
}
