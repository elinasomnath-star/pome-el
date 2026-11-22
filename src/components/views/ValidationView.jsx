import React, { useState } from 'react';
import { getValidationEvents } from '../../engine/validation';
import { getCalibrationReport } from '../../engine/calibration';
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
  ArrowRight,
  ExternalLink,
  Sliders,
  Scale
} from 'lucide-react';

export default function ValidationView() {
  const { events, summary } = getValidationEvents();
  const calibrationReport = getCalibrationReport();
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [splitFilter, setSplitFilter] = useState('all'); // 'all' | 'in_sample' | 'out_of_sample'
  const [showCalibrationDetails, setShowCalibrationDetails] = useState(false);

  const filteredEvents = events.filter(e => {
    if (splitFilter === 'in_sample') return e.split === 'in_sample_calibration';
    if (splitFilter === 'out_of_sample') return e.split === 'out_of_sample_test';
    return true;
  });

  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-40">
      
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
                  Empirical Plausibility & Calibration Audit
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  N=3 Historical Events
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Directional backtest comparing model logic against 3 historical Indian quick commerce events with an Event 1 calibration split.
              </p>
            </div>
          </div>
        </div>

        {/* Honest Metric & Verification Counts */}
        <div className="px-5 py-3 rounded-2xl bg-dark-800/90 border border-slate-700 font-mono text-xs text-slate-200 space-y-1 text-right shadow-sm">
          <div className="flex items-center justify-end gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>{summary.transparentCountText}</span>
          </div>
          <div className="text-xs text-cyan-300 font-sans">
            {summary.verificationText}
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
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
            {summary.sampleSizeNote} Baseline parameters (density decay &beta; = 0.32, fulfillment cost c&#8320; = &#8377;48.0, elasticity &epsilon; = 1.75) were calibrated against Event 1 (Zomato/Blinkit Acquisition) and frozen before testing Events 2 & 3. This module serves strictly as an educational <strong>qualitative plausibility check</strong> for directional sign consistency (+/-), not asymptotic econometric forecast accuracy.
          </p>
        </div>
      </div>

      {/* Calibration Engine Dossier Drawer Toggle */}
      <div className="p-4 rounded-xl border border-slate-800 bg-dark-900/80 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Sliders className="w-4 h-4 text-violet-400" />
          <span>Parameter Calibration: <strong>Event 1 In-Sample Tuning</strong> (Cost & Density Parameters Frozen)</span>
        </div>
        <button
          onClick={() => setShowCalibrationDetails(!showCalibrationDetails)}
          className="text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{showCalibrationDetails ? "Hide Calibration Details" : "View Parameter Calibration Table"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expanded Calibration Specifications Table */}
      {showCalibrationDetails && (
        <div className="p-5 rounded-2xl border border-violet-500/30 bg-violet-950/10 space-y-4 font-mono text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <Scale className="w-4 h-4 text-violet-400" />
              <span>Event 1 Parameter Calibration Protocol (/src/engine/calibration.js)</span>
            </h4>
            <span className="px-2.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/40 text-[10px]">
              Objective: MSE Minimization
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-dark-950">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 bg-dark-900/60">
                <tr>
                  <th className="py-2.5 px-3">Parameter Name</th>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Initial Guess</th>
                  <th className="py-2.5 px-3">Calibrated Value</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Calibration Source & Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {Object.entries(calibrationReport.calibratedParameters).map(([key, param]) => (
                  <tr key={key} className="hover:bg-dark-800/40">
                    <td className="py-2.5 px-3 font-semibold text-white">{param.description}</td>
                    <td className="py-2.5 px-3 text-cyan-300">{param.symbol}</td>
                    <td className="py-2.5 px-3 text-slate-400">{param.initialGuess}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{param.calibratedValue}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/40">
                        {param.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400 font-sans">{param.justification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
          All Events (11/12 Matched &bull; 10/12 Verified)
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
                  <span className="text-[10px] text-cyan-400">
                    {ev.metricsVerified}/{ev.metricsTotal} Verified
                  </span>
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

            {/* Metric-by-Metric Directional Evaluation Table with Verification Badges */}
            <div className="space-y-3">
              <h5 className="text-xs uppercase font-mono font-bold text-slate-300 flex items-center gap-2 tracking-wider">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Tracked Metric Outcomes, Empirical Citations & Verification Status</span>
              </h5>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-dark-950/90 shadow-sm">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-dark-900/60">
                      <th className="py-3 px-3.5">Tracked Dimension</th>
                      <th className="py-3 px-3.5">Predicted Direction</th>
                      <th className="py-3 px-3.5">Actual Realized Outcome</th>
                      <th className="py-3 px-3.5 text-center">Concordance</th>
                      <th className="py-3 px-3.5">Evidence & Citation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {activeEvent.trackedMetrics.map((m, mIdx) => (
                      <tr key={mIdx} className="hover:bg-dark-800/40 transition-colors">
                        <td className="py-3.5 px-3.5 font-semibold text-white">{m.metric}</td>
                        <td className="py-3.5 px-3.5 text-cyan-300">{m.predictedDirection}</td>
                        <td className="py-3.5 px-3.5 text-slate-300 font-sans text-xs">{m.actualOutcome || m.actualDirection}</td>
                        <td className="py-3.5 px-3.5 text-center">
                          {m.match ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              <CheckCircle2 className="w-3 h-3" /> MATCH
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                              <XCircle className="w-3 h-3" /> MISMATCH
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3.5 space-y-1">
                          <div>
                            {m.isVerified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                Verified Statutory
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                Unverified (Team to Confirm)
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans leading-tight">
                            <strong>{m.sourceName}</strong> &bull; {m.date}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate max-w-[220px]" title={m.sourceUrlOrReference}>
                            {m.sourceUrlOrReference}
                          </div>
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
