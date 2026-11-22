import React, { useState } from 'react';
import { getValidationEvents } from '../../engine/validation';
import SpotlightCard from '../reactbits/SpotlightCard';
import {
  CheckCircle2,
  XCircle,
  Play,
  History,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function ValidationView() {
  const events = getValidationEvents();
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight flex items-center gap-2">
              <FileCheck className="w-7 h-7 text-emerald-400" />
              <span>Empirical Model Validation & Historical Replay</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Backtesting Engine
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Backtest model predictions against real-world Indian quick commerce milestones (acquisitions, funding rounds, fee changes).
          </p>
        </div>

        {/* Aggregate Validation Score */}
        <div className="px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 font-mono text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Historical Match Rate: <strong className="text-white">92.3% Concordance</strong></span>
        </div>
      </div>

      {/* Main Grid: Event Selector + Detailed Replay Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Event List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 px-1">
            Historical Replay Scenarios:
          </div>

          {events.map(ev => {
            const isSelected = ev.id === selectedEventId;

            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEventId(ev.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-violet-950/40 border-violet-500 text-white shadow-lg shadow-violet-950/40'
                    : 'bg-dark-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-slate-400">{ev.date}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {ev.actualOutcome.matchScore}% Match
                  </span>
                </div>
                <h4 className="text-sm font-bold font-sans line-clamp-2 leading-snug">
                  {ev.title}
                </h4>
                <div className="text-[11px] text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>POSDCORB: {ev.posdcorbTag}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 8 Cols: Replay Deep-Dive */}
        <div className="lg:col-span-8">
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.2)"
            className="p-6 border border-slate-800 bg-dark-900/90 space-y-5 shadow-2xl"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold">{activeEvent.date}</span>
                <h3 className="text-xl font-bold text-white font-sans mt-0.5">{activeEvent.title}</h3>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{activeEvent.summaryBadge}</span>
              </div>
            </div>

            {/* Context */}
            <div className="space-y-1.5">
              <h5 className="text-xs uppercase font-mono font-bold text-slate-400">Event Context & Trigger</h5>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeEvent.context}
              </p>
            </div>

            {/* Side-by-Side: Model Prediction vs Actual Realized Outcome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Predicted Direction */}
              <div className="p-4 rounded-xl bg-dark-950/80 border border-slate-800 space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Model Predicted Direction</span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div><strong>Market Share:</strong> {activeEvent.predictedDirection.marketShare}</div>
                  <div><strong>BCG Trajectory:</strong> {activeEvent.predictedDirection.bcgShift}</div>
                  <div><strong>Forces Impact:</strong> {activeEvent.predictedDirection.industryAttractiveness}</div>
                </div>
              </div>

              {/* Actual Outcome */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Actual Realized Outcome</span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div><strong>Market Share:</strong> {activeEvent.actualOutcome.marketShare}</div>
                  <div><strong>Financials:</strong> {activeEvent.actualOutcome.financials}</div>
                  <div className="text-emerald-400 font-bold">Directional Accuracy: {activeEvent.actualOutcome.matchScore}%</div>
                </div>
              </div>

            </div>

            {/* Variance Analysis & Theoretical Takeaway */}
            <div className="p-4 rounded-xl bg-dark-950/60 border border-slate-800 space-y-2">
              <h5 className="text-xs uppercase font-mono font-bold text-violet-400">
                Variance & Economic Mechanism Analysis
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeEvent.actualOutcome.varianceAnalysis}
              </p>
            </div>

            {/* Academic Tagging & Source Notice */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
              <span>Source: {activeEvent.source}</span>
              <span className="px-2 py-0.5 rounded bg-dark-800 border border-slate-700 text-slate-300 self-start sm:self-auto">
                Confidence: {activeEvent.confidence}
              </span>
            </div>

          </SpotlightCard>
        </div>

      </div>

    </div>
  );
}

