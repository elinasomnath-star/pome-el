import React, { useState } from 'react';
import { getValidationEvents } from '../../engine/validation';
import SpotlightCard from '../reactbits/SpotlightCard';
import DataProvenanceBadge from '../common/DataProvenanceBadge';
import {
  CheckCircle2,
  XCircle,
  FileCheck,
  AlertTriangle,
  Sparkles,
  Info,
  ShieldCheck,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export default function ValidationView() {
  const { events, summary } = getValidationEvents();
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [splitFilter, setSplitFilter] = useState('all'); // 'all' | 'in_sample' | 'out_of_sample'

  const filteredEvents = events.filter(e => {
    if (splitFilter === 'in_sample') return e.split === 'in_sample_calibration';
    if (splitFilter === 'out_of_sample') return e.split === 'out_of_sample_test';
    return true;
  });

  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
                  Directional Plausibility Check (Empirical Backtest)
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  N=3 Historical Events
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Qualitative directional test comparing model mechanics against 3 historical quick commerce market episodes.
              </p>
            </div>
          </div>
        </div>

        {/* Honest Metric Count Badge */}
        <div className="px-5 py-3 rounded-2xl bg-dark-800/90 border border-slate-700 font-mono text-xs text-slate-200 space-y-1 text-right shadow-sm">
          <div className="flex items-center justify-end gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>{summary.transparentCountText}</span>
          </div>
          <div className="text-xs text-slate-400 font-sans">
            Calibrate vs Test Split: 4/4 in-sample &bull; 7/8 out-of-sample
          </div>
        </div>
      </div>

      {/* Small Sample Limitations Warning Banner */}
      <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 text-xs text-amber-200/90 flex items-start gap-3.5 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <span className="font-bold text-white uppercase font-mono tracking-wider text-xs block">
            Academic Honesty & Limitations Disclosure
          </span>
          <p className="leading-relaxed text-xs">
            {summary.sampleSizeNote} This module is designed strictly as an educational <strong>plausibility check</strong> to test whether the microeconomic mechanisms (experience curves, Bertrand price responses, and platform fee inelasticity) predict the correct sign (+/-). It is not an econometric forecasting model.
          </p>
        </div>
      </div>

      {/* Split Tabs Bar: All, In-Sample Calibration, Out-of-Sample Test */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3 flex-wrap">
        <span className="text-xs font-mono text-slate-400 mr-1">Evaluation Split:</span>
        <button
          onClick={() => setSplitFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
            splitFilter === 'all'
              ? 'bg-violet-600 text-white font-bold shadow-md'
              : 'bg-dark-800 text-slate-400 hover:text-white hover:bg-dark-700'
          }`}
        >
          All Events (11/12 Matched)
        </button>
        <button
          onClick={() => setSplitFilter('in_sample')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
            splitFilter === 'in_sample'
              ? 'bg-cyan-600 text-white font-bold shadow-md'
              : 'bg-dark-800 text-slate-400 hover:text-white hover:bg-dark-700'
          }`}
        >
          In-Sample Calibration: Event 1 (4/4 Matched)
        </button>
        <button
          onClick={() => setSplitFilter('out_of_sample')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
            splitFilter === 'out_of_sample'
              ? 'bg-pink-600 text-white font-bold shadow-md'
              : 'bg-dark-800 text-slate-400 hover:text-white hover:bg-dark-700'
          }`}
        >
          Out-of-Sample Test: Events 2 & 3 (7/8 Matched)
        </button>
      </div>

      {/* Main Grid: Event Selector + Detailed Replay Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 4 Cols: Event List */}
        <div className="lg:col-span-4 space-y-3.5">
          {filteredEvents.map(ev => {
            const isSelected = ev.id === selectedEventId;
            const isCalibration = ev.split === 'in_sample_calibration';

            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEventId(ev.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-violet-950/40 border-violet-500 text-white shadow-xl shadow-violet-950/40 ring-1 ring-violet-500/40'
                    : 'bg-dark-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-dark-850'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                    isCalibration
                      ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                      : 'bg-pink-950/60 text-pink-300 border-pink-500/40'
                  }`}>
                    {ev.splitLabel}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {ev.metricsMatched}/{ev.metricsTotal} Matched
                  </span>
                </div>
                <h4 className="text-sm font-bold font-sans line-clamp-2 leading-snug">
                  {ev.title}
                </h4>
                <div className="text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800/80 font-mono flex items-center justify-between">
                  <span>{ev.date}</span>
                  <DataProvenanceBadge
                    type={ev.isPlaceholder ? 'placeholder' : 'verified'}
                    source={ev.source}
                    year={ev.year}
                    confidence={ev.confidence}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 8 Cols: Replay Deep-Dive */}
        <div className="lg:col-span-8">
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.2)"
            className="p-6 sm:p-8 border border-slate-800 bg-dark-900/90 rounded-2xl space-y-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold">{activeEvent.splitLabel}</span>
                  <span className="text-xs text-slate-500 font-mono">&bull; {activeEvent.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-white font-sans">{activeEvent.title}</h3>
              </div>

              <div className="px-4 py-2 rounded-xl bg-dark-800 border border-slate-700 font-mono text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-sm">
                <span className="text-emerald-400 font-bold">{activeEvent.metricsMatched} of {activeEvent.metricsTotal} Metrics Matched</span>
              </div>
            </div>

            {/* Context */}
            <div className="space-y-2">
              <h5 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">Historical Episode Background</h5>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {activeEvent.context}
              </p>
            </div>

            {/* Metric-by-Metric Directional Evaluation Table */}
            <div className="space-y-3">
              <h5 className="text-xs uppercase font-mono font-bold text-slate-300 flex items-center gap-2 tracking-wider">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Tracked Metric Outcomes & Directional Concordance</span>
              </h5>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-dark-950/90 shadow-sm">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-dark-900/60">
                      <th className="py-3 px-4">Tracked Dimension</th>
                      <th className="py-3 px-4">Model Prediction</th>
                      <th className="py-3 px-4">Real-World Outcome</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {activeEvent.trackedMetrics.map((m, mIdx) => (
                      <tr key={mIdx} className="hover:bg-dark-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">{m.metric}</td>
                        <td className="py-3.5 px-4 text-cyan-300">{m.predictedDirection}</td>
                        <td className="py-3.5 px-4 text-slate-300">{m.actualDirection}</td>
                        <td className="py-3.5 px-4 text-center">
                          {m.match ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5" /> MATCH
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm">
                              <XCircle className="w-3.5 h-3.5" /> MISMATCH
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Variance & Economic Mechanism Analysis */}
            <div className="p-5 rounded-2xl bg-dark-950/70 border border-slate-800 space-y-2">
              <h5 className="text-xs uppercase font-mono font-bold text-violet-400 tracking-wider">
                Economic Mechanism & Variance Analysis
              </h5>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {activeEvent.varianceAnalysis}
              </p>
            </div>

            {/* Academic Tagging & Source Notice */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-400 gap-2">
              <span>Primary Source: {activeEvent.source}</span>
              <DataProvenanceBadge
                type={activeEvent.isPlaceholder ? 'placeholder' : 'verified'}
                source={activeEvent.source}
                year={activeEvent.year}
                confidence={activeEvent.confidence}
              />
            </div>

          </SpotlightCard>
        </div>

      </div>

    </div>
  );
}
