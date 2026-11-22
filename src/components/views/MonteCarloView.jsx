import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import GradientText from '../reactbits/GradientText';
import { Dices, Play, RefreshCw, BarChart2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export default function MonteCarloView() {
  const {
    monteCarloResults,
    isMonteCarloRunning,
    runMonteCarlo,
    selectedCompanyId,
    baselineCompanies
  } = useSimStore();

  const firm = baselineCompanies.find(c => c.id === selectedCompanyId) || baselineCompanies[0];

  // Auto-run if not yet run
  React.useEffect(() => {
    if (!monteCarloResults && !isMonteCarloRunning) {
      runMonteCarlo();
    }
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight flex items-center gap-2">
              <Dices className="w-7 h-7 text-cyan-400" />
              <span>Monte Carlo Risk & Uncertainty Engine</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              1,000 Stochastic Iterations
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Replaces deterministic point estimates with empirical probability distributions and 5th-95th percentile confidence intervals.
          </p>
        </div>

        <button
          onClick={runMonteCarlo}
          disabled={isMonteCarloRunning}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isMonteCarloRunning ? 'animate-spin' : ''}`} />
          <span>{isMonteCarloRunning ? 'Sampling 1,000 Trials...' : 'Run 1,000 Simulations'}</span>
        </button>
      </div>

      {monteCarloResults ? (
        <div className="space-y-6">
          
          {/* Summary Confidence Bounds */}
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
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                      Mean &plusmn; Stdev
                    </div>
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
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                      Expected Value (EV)
                    </div>
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

          {/* Academic Risk Synthesis Card */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-dark-900/60 space-y-2">
            <h4 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Managerial Decision Implications Under Bounded Uncertainty</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Under <strong>Simon's Bounded Rationality</strong> and <strong>Knightian Uncertainty</strong>, strategic managers rarely possess complete deterministic data. The Monte Carlo engine reveals that while the point-estimate Industry Attractiveness is <strong>{monteCarloResults.attractiveness.mean}</strong>, there is a 5% tail probability of forces deteriorating below <strong>{monteCarloResults.attractiveness.p5}</strong> in adverse conditions.
            </p>
          </div>

        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Running Monte Carlo trials...
        </div>
      )}

    </div>
  );
}

