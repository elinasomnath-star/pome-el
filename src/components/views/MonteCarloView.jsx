import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import GradientText from '../reactbits/GradientText';
import { computeTornadoSensitivity } from '../../engine/sensitivity';
import { Dices, RefreshCw, BarChart2, ShieldCheck, Sparkles, TrendingUp, Sliders } from 'lucide-react';

export default function MonteCarloView() {
  const {
    monteCarloResults,
    isMonteCarloRunning,
    runMonteCarlo,
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
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight flex items-center gap-2">
              <Dices className="w-7 h-7 text-cyan-400" />
              <span>Risk & Sensitivity Analysis Lab</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Knightian Uncertainty & Tornado Sensitivities
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Empirical probability distributions from 1,000 stochastic trials and sorted parameter impact tornado rankings.
          </p>
        </div>

        {/* Sub-tab & Runner Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-dark-800 border border-slate-700 text-xs font-mono">
            <button
              onClick={() => setActiveSubTab('distribution')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'distribution' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              1,000-Trial Histograms
            </button>
            <button
              onClick={() => setActiveSubTab('tornado')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'tornado' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tornado Sensitivity Chart
            </button>
          </div>

          <button
            onClick={runMonteCarlo}
            disabled={isMonteCarloRunning}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isMonteCarloRunning ? 'animate-spin' : ''}`} />
            <span>{isMonteCarloRunning ? 'Running...' : 'Re-Run 1,000 Draws'}</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: 1,000-TRIAL PROBABILITY DISTRIBUTIONS */}
      {activeSubTab === 'distribution' && monteCarloResults && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Attractiveness Confidence Bounds */}
            <SpotlightCard
              spotlightColor="rgba(6, 182, 212, 0.2)"
              className="p-5 border border-slate-800 bg-dark-900/90"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                    Industry Attractiveness Index Distribution
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">1,000 Gaussian Draws</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-3xl font-extrabold text-white font-mono">
                      {monteCarloResults.attractiveness.mean} <span className="text-sm text-slate-400 font-normal">&plusmn; {monteCarloResults.attractiveness.stdev}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">Mean &plusmn; Stdev</div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      90% Confidence Interval (P5 - P95)
                    </span>
                    <span className="text-lg font-bold font-mono text-cyan-300">
                      {monteCarloResults.attractiveness.confidenceInterval}
                    </span>
                  </div>
                </div>

                {/* Histogram Visualization */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="text-[10px] text-slate-500 font-mono">Density Histogram (Bins):</div>
                  <div className="flex items-end gap-1 h-24 pt-2">
                    {monteCarloResults.attractiveness.histogram.map((bin, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex-1 bg-cyan-500/30 hover:bg-cyan-400/80 rounded-t-sm transition-all group relative cursor-pointer"
                        style={{ height: `${Math.max(4, bin.density * 3.5)}%` }}
                      >
                        <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-950 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-200 border border-slate-700 whitespace-nowrap z-20">
                          {bin.label}: {bin.count} runs ({bin.density}%)
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>{monteCarloResults.attractiveness.histogram[0]?.label}</span>
                    <span>Score (1-10)</span>
                    <span>{monteCarloResults.attractiveness.histogram[monteCarloResults.attractiveness.histogram.length - 1]?.label}</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* Profit Confidence Bounds */}
            <SpotlightCard
              spotlightColor="rgba(236, 72, 153, 0.2)"
              className="p-5 border border-slate-800 bg-dark-900/90"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-pink-400 font-bold">
                    Round Profit Distribution ({firm.name})
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Elasticity & Cost Noise</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-3xl font-extrabold text-white font-mono">
                      ₹{monteCarloResults.profit.mean.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">Expected Value (EV)</div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      90% Confidence Interval (P5 - P95)
                    </span>
                    <span className="text-base font-bold font-mono text-pink-300">
                      {monteCarloResults.profit.confidenceInterval}
                    </span>
                  </div>
                </div>

                {/* Histogram Visualization */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="text-[10px] text-slate-500 font-mono">Density Histogram (Bins):</div>
                  <div className="flex items-end gap-1 h-24 pt-2">
                    {monteCarloResults.profit.histogram.map((bin, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex-1 bg-pink-500/30 hover:bg-pink-400/80 rounded-t-sm transition-all group relative cursor-pointer"
                        style={{ height: `${Math.max(4, bin.density * 3.5)}%` }}
                      >
                        <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-950 px-2 py-0.5 rounded text-[9px] font-mono text-pink-200 border border-slate-700 whitespace-nowrap z-20">
                          {bin.label}: {bin.count} runs ({bin.density}%)
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>{monteCarloResults.profit.histogram[0]?.label}</span>
                    <span>Profit ₹</span>
                    <span>{monteCarloResults.profit.histogram[monteCarloResults.profit.histogram.length - 1]?.label}</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>

          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-dark-900/60 text-xs text-slate-300 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong>Academic Note (Simon's Bounded Rationality): </strong>
              Deterministic strategic planning fails under volatile dark-store market dynamics. The empirical distributions illustrate that extreme downside states can plunge profitability into negative territory even with high top-line growth.
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TORNADO SENSITIVITY ANALYSIS */}
      {activeSubTab === 'tornado' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-dark-900/90 p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  <span>Tornado Sensitivity Ranking (Ranked by Output Swing)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Measures the marginal change in key outputs (Attractiveness Index or Firm Profit) when each assumption is varied between its low and high test values.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">Sorted: Largest Impact on Top</span>
            </div>

            {/* Tornado Bars */}
            <div className="space-y-3.5 pt-2">
              {tornadoData.map((item, idx) => {
                const isAttractiveness = item.type === 'attractiveness';
                const maxRange = isAttractiveness ? 4.0 : 450000;
                const lowBarWidth = Math.min(100, Math.max(8, (Math.abs(item.deltaLow) / maxRange) * 100));
                const highBarWidth = Math.min(100, Math.max(8, (Math.abs(item.deltaHigh) / maxRange) * 100));

                return (
                  <div key={item.id} className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-dark-900 text-cyan-400 font-mono text-[10px] font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <strong className="text-white font-sans">{item.name}</strong>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-900 border border-slate-700 text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-300">
                        Swing: <strong>{isAttractiveness ? `${item.swing} pts` : `₹${Math.round(item.swing).toLocaleString()}`}</strong>
                      </div>
                    </div>

                    {/* Dual Horizontal Bar Chart */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                      {/* Left: Low Value Impact */}
                      <div className="flex items-center justify-end gap-2 text-right">
                        <span className="text-slate-400 truncate">Low ({item.lowVal}): {item.lowOutput}</span>
                        <div
                          className="h-4 rounded-sm bg-rose-500/70 shrink-0"
                          style={{ width: `${lowBarWidth * 1.5}px` }}
                        />
                      </div>

                      {/* Right: High Value Impact */}
                      <div className="flex items-center justify-start gap-2">
                        <div
                          className="h-4 rounded-sm bg-emerald-500/70 shrink-0"
                          style={{ width: `${highBarWidth * 1.5}px` }}
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
