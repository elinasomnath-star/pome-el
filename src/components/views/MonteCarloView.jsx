import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import GradientText from '../reactbits/GradientText';
import CompanyBrandIcon from '../common/CompanyBrandIcon';
import { computeTornadoSensitivity } from '../../engine/sensitivity';
import { indianGroup } from '../../utils/formatINR';
import { Dices, RefreshCw, BarChart2, ShieldCheck, Sparkles, TrendingUp, Sliders, Info } from 'lucide-react';

export default function MonteCarloView() {
  const {
    monteCarloResults,
    isMonteCarloRunning,
    runMonteCarlo,
    monteCarloSeed,
    setMonteCarloSeed,
    selectedCompanyId,
    baselineCompanies,
    baselineForces,
    currentForceScores,
    currentForceWeights,
    priceWarFirms
  } = useSimStore();

  const [activeSubTab, setActiveSubTab] = useState('distribution'); // 'distribution' | 'tornado'

  const firm = baselineCompanies.find(c => c.id === selectedCompanyId) || baselineCompanies[0];
  const targetFirmPriceWar = priceWarFirms.find(f => f.id === selectedCompanyId) || priceWarFirms[1];

  // Auto-run if not yet run
  React.useEffect(() => {
    if (!monteCarloResults && !isMonteCarloRunning) {
      runMonteCarlo();
    }
  }, []);

  const tornadoData = computeTornadoSensitivity(
    baselineForces,
    currentForceScores,
    currentForceWeights,
    targetFirmPriceWar,
    priceWarFirms
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-6">
      
      {/* Title & Header - Elegant 2-Tier Layout with Dedicated Ribbon */}
      <div className="space-y-4 pb-5 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
              <Dices className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
                  Risk & Sensitivity Analysis Lab
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold whitespace-nowrap">
                  Knightian Uncertainty & Tornado Sensitivities
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
                Empirical probability distributions across 1,000 stochastic trials and sorted parameter impact tornado rankings.
              </p>
            </div>
          </div>
        </div>

        {/* Dedicated Controls Toolbar Ribbon */}
        <div className="p-2.5 rounded-xl bg-dark-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Sub-tab Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-dark-950 border border-slate-800 text-xs font-mono shadow-sm">
            <button
              onClick={() => setActiveSubTab('distribution')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'distribution' ? 'bg-cyan-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              1,000-Trial Histograms
            </button>
            <button
              onClick={() => setActiveSubTab('tornado')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'tornado' ? 'bg-cyan-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tornado Sensitivity Ranking
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* PRNG Seed Selector */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-950 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="text-slate-400">PRNG Seed:</span>
              <input
                type="number"
                value={monteCarloSeed || 42}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 42;
                  setMonteCarloSeed(val);
                  runMonteCarlo(val);
                }}
                className="w-16 px-1.5 py-0.5 rounded bg-dark-900 border border-slate-700 text-cyan-300 font-bold font-mono text-center text-xs focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-emerald-400 font-bold">(Mulberry32)</span>
            </div>

            <button
              onClick={() => runMonteCarlo()}
              disabled={isMonteCarloRunning}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isMonteCarloRunning ? 'animate-spin' : ''}`} />
              <span>{isMonteCarloRunning ? 'Running Draws...' : 'Re-Run 1,000 Draws'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: 1,000-TRIAL PROBABILITY DISTRIBUTIONS */}
      {activeSubTab === 'distribution' && monteCarloResults && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Attractiveness Confidence Bounds */}
            <SpotlightCard
              spotlightColor="rgba(6, 182, 212, 0.2)"
              className="p-6 border border-slate-800 bg-dark-900/90 rounded-2xl shadow-xl space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                    Industry Attractiveness Index Distribution
                  </span>
                  <span className="text-xs font-mono text-slate-500">1,000 Gaussian Draws</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      {monteCarloResults.attractiveness.mean} <span className="text-sm text-slate-400 font-normal">&plusmn; {monteCarloResults.attractiveness.stdev}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">Empirical Mean &plusmn; Standard Deviation</div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs uppercase font-mono text-slate-400 block mb-0.5">
                      90% Confidence Interval (P5 - P95)
                    </span>
                    <span className="text-lg font-bold font-mono text-cyan-300">
                      {monteCarloResults.attractiveness.confidenceInterval}
                    </span>
                  </div>
                </div>

                {/* Histogram Visualization */}
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-bold">Density Distribution (Frequency of Trials):</span>
                    <span className="text-[11px] text-cyan-400">N=1,000 trials &bull; Gaussian Noise &sigma;=0.6</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-28 pt-2">
                    {(() => {
                      const maxAttrDensity = Math.max(...monteCarloResults.attractiveness.histogram.map(b => b.density || (b.count / 10) || 1), 1);
                      return monteCarloResults.attractiveness.histogram.map((bin, bIdx) => {
                        const densityVal = bin.density !== undefined ? bin.density : Number(((bin.count / 1000) * 100).toFixed(1));
                        const heightPct = Math.max(8, Math.min(96, (densityVal / maxAttrDensity) * 92));
                        const labelText = bin.label || bin.rangeLabel || `Bin ${bIdx + 1}`;
                        return (
                          <div
                            key={bIdx}
                            className="flex-1 bg-cyan-500/40 hover:bg-cyan-400/90 rounded-t-sm transition-all group relative cursor-pointer border-t border-cyan-400/60"
                            style={{ height: `${heightPct}%` }}
                          >
                            <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-950 px-2.5 py-1 rounded text-[10px] font-mono text-cyan-200 border border-slate-700 whitespace-nowrap z-20 shadow-lg">
                              {labelText}: {bin.count} runs ({densityVal}%)
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>{monteCarloResults.attractiveness.histogram[0]?.label || monteCarloResults.attractiveness.histogram[0]?.rangeLabel}</span>
                    <span className="text-[11px] text-slate-500">Industry Attractiveness Score (1-10)</span>
                    <span>{monteCarloResults.attractiveness.histogram[monteCarloResults.attractiveness.histogram.length - 1]?.label || monteCarloResults.attractiveness.histogram[monteCarloResults.attractiveness.histogram.length - 1]?.rangeLabel}</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* Profit Confidence Bounds */}
            <SpotlightCard
              spotlightColor="rgba(236, 72, 153, 0.2)"
              className="p-6 border border-slate-800 bg-dark-900/90 rounded-2xl shadow-xl space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <CompanyBrandIcon id={firm.id} className="w-10 h-10" showBg={true} />
                    <div>
                      <span className="text-xs font-mono uppercase text-pink-400 font-bold block">
                        Round Profit Distribution
                      </span>
                      <span className="text-sm font-bold text-white font-sans">
                        {firm.name} ({firm.brandTag})
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">Elasticity & Cost Stochasticity</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      ₹{indianGroup(monteCarloResults.profit.mean)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">Expected Value (EV) Per Round</div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs uppercase font-mono text-slate-400 block mb-0.5">
                      90% Confidence Interval (P5 - P95)
                    </span>
                    <span className="text-lg font-bold font-mono text-pink-300">
                      {monteCarloResults.profit.confidenceInterval}
                    </span>
                  </div>
                </div>

                {/* Histogram Visualization */}
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-bold">Density Distribution (Frequency of Trials):</span>
                    <span className="text-[11px] text-pink-400">Elasticity &sigma;=0.15 &bull; Cost &sigma;=1.2</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-28 pt-2">
                    {(() => {
                      const maxProfitDensity = Math.max(...monteCarloResults.profit.histogram.map(b => b.density || (b.count / 10) || 1), 1);
                      return monteCarloResults.profit.histogram.map((bin, bIdx) => {
                        const densityVal = bin.density !== undefined ? bin.density : Number(((bin.count / 1000) * 100).toFixed(1));
                        const heightPct = Math.max(8, Math.min(96, (densityVal / maxProfitDensity) * 92));
                        const labelText = bin.label || bin.rangeLabel || `Bin ${bIdx + 1}`;
                        return (
                          <div
                            key={bIdx}
                            className="flex-1 bg-pink-500/40 hover:bg-pink-400/90 rounded-t-sm transition-all group relative cursor-pointer border-t border-pink-400/60"
                            style={{ height: `${heightPct}%` }}
                          >
                            <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-950 px-2.5 py-1 rounded text-[10px] font-mono text-pink-200 border border-slate-700 whitespace-nowrap z-20 shadow-lg">
                              {labelText}: {bin.count} runs ({densityVal}%)
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>{monteCarloResults.profit.histogram[0]?.label || monteCarloResults.profit.histogram[0]?.rangeLabel}</span>
                    <span className="text-[11px] text-slate-500">Operating Profit Per Round (₹)</span>
                    <span>{monteCarloResults.profit.histogram[monteCarloResults.profit.histogram.length - 1]?.label || monteCarloResults.profit.histogram[monteCarloResults.profit.histogram.length - 1]?.rangeLabel}</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>

          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-dark-900/60 text-xs sm:text-sm text-slate-300 flex items-center gap-3.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white">Academic Pedagogy (Herbert Simon's Bounded Rationality): </strong>
              Static point forecasts fail under quick-commerce market conditions. These 1,000 stochastic draws reveal that downside tail events can rapidly push round profitability into severe deficits even during revenue expansion.
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TORNADO SENSITIVITY ANALYSIS */}
      {activeSubTab === 'tornado' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-dark-900/90 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  <span>Tornado Sensitivity Ranking (Ranked by Output Swing)</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Measures the absolute swing in key strategic outputs when each individual assumption is shocked between its low and high test bounds.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-dark-800 border border-slate-700 text-slate-300">
                Sorted: Largest Impact on Top
              </span>
            </div>

            {/* Tornado Bars */}
            <div className="space-y-4 pt-2">
              {tornadoData.map((item, idx) => {
                const isAttractiveness = item.type === 'attractiveness';
                const maxRange = isAttractiveness ? 4.0 : 450000;
                const lowBarWidth = Math.min(100, Math.max(8, (Math.abs(item.deltaLow) / maxRange) * 100));
                const highBarWidth = Math.min(100, Math.max(8, (Math.abs(item.deltaHigh) / maxRange) * 100));

                return (
                  <div key={item.id} className="p-4 rounded-xl bg-dark-800/80 border border-slate-800 space-y-3 shadow-sm hover:border-slate-700 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-dark-900 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center border border-slate-800">
                          #{idx + 1}
                        </span>
                        <strong className="text-sm text-white font-sans">{item.name}</strong>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-dark-900 border border-slate-700 text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-cyan-300">
                        Total Swing: <strong className="text-white">{isAttractiveness ? `${item.swing} pts` : `₹${indianGroup(Math.round(item.swing))}`}</strong>
                      </div>
                    </div>

                    {/* Dual Horizontal Bar Chart */}
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                      {/* Left: Low Value Impact */}
                      <div className="flex items-center justify-end gap-2 text-right">
                        <span className="text-slate-400 truncate">Low ({item.lowVal}): {item.lowOutput}</span>
                        <div
                          className="h-5 rounded bg-rose-500/80 shrink-0"
                          style={{ width: `${lowBarWidth * 1.8}px` }}
                        />
                      </div>

                      {/* Right: High Value Impact */}
                      <div className="flex items-center justify-start gap-2">
                        <div
                          className="h-5 rounded bg-emerald-500/80 shrink-0"
                          style={{ width: `${highBarWidth * 1.8}px` }}
                        />
                        <span className="text-slate-400 truncate">High ({item.highVal}): {item.highOutput}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
