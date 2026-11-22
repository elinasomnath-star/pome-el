import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import DataProvenanceBadge from '../common/DataProvenanceBadge';
import { getAllForceRubrics } from '../../engine/rubric';
import {
  Shield,
  Sliders,
  RotateCcw,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

export default function FiveForcesView() {
  const {
    baselineForces,
    currentForceScores,
    currentForceWeights,
    setForceScore,
    setForceWeight,
    industryAttractiveness,
    resetShocks
  } = useSimStore();

  const [showRubric, setShowRubric] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState({});
  const rubrics = getAllForceRubrics();

  const toggleDetails = (id) => {
    setExpandedDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetForces = () => {
    baselineForces.forEach(f => {
      setForceScore(f.id, f.baseScore);
      setForceWeight(f.id, f.defaultWeight);
    });
  };

  // SVG Radar coordinates
  const size = 380;
  const center = size / 2;
  const radius = 135;

  const forceIds = ['rivalry', 'newEntrants', 'substitutes', 'buyerPower', 'supplierPower'];
  const angles = forceIds.map((_, i) => (-90 + (i * 360) / 5) * (Math.PI / 180));

  const getVertex = (score, angle) => {
    const r = (score / 10) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const baselinePoints = baselineForces.map((f, i) => {
    const pt = getVertex(f.baseScore, angles[i]);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  const currentPoints = baselineForces.map((f, i) => {
    const score = currentForceScores[f.id] !== undefined ? currentForceScores[f.id] : f.baseScore;
    const pt = getVertex(score, angles[i]);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-40">
      
      {/* Title & Index Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
              Porter's Five Forces Model
            </h2>
            <span className="text-xs px-3 py-1 rounded-full font-mono font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Michael E. Porter (1979, 2008)
            </span>
          </div>
          <p className="text-sm text-slate-300">
            Structural determinants of quick-commerce profitability. Adjust sliders to explore margin squeeze.
          </p>
        </div>

        {/* Live Index Box & Controls */}
        <div className="flex items-center gap-4">
          <div className="p-4 px-6 rounded-2xl border border-violet-500/40 bg-gradient-to-tr from-dark-800 to-violet-950/30 text-right shadow-lg shadow-violet-950/20">
            <div className="text-[11px] uppercase font-mono text-slate-400 font-semibold">Attractiveness Index</div>
            <div className="text-3xl font-extrabold text-white font-mono flex items-baseline justify-end gap-1">
              <CountUp to={industryAttractiveness.attractivenessIndex} decimals={2} suffix=" / 10" />
            </div>
            <div className={`text-xs font-semibold mt-0.5 ${
              industryAttractiveness.attractivenessIndex >= 4.5 ? 'text-emerald-400' :
              industryAttractiveness.attractivenessIndex >= 3.0 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {industryAttractiveness.tier}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowRubric(!showRubric)}
              className={`px-4 py-2 rounded-xl border text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                showRubric
                  ? 'bg-cyan-500/25 text-cyan-300 border-cyan-500/50 shadow-md'
                  : 'bg-dark-800 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>{showRubric ? 'Hide Rubric' : 'Scoring Rubric'}</span>
            </button>

            <button
              onClick={handleResetForces}
              className="px-4 py-2 rounded-xl bg-dark-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
              title="Reset forces and weights to baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scoring Rubric Panel (Clean, airy layout) */}
      {showRubric && (
        <div className="p-6 rounded-2xl border border-cyan-500/40 bg-dark-900/95 shadow-2xl space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Deterministic Scoring Rubric: Metrics → 1-10 Force Scores</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Quantitative mapping connecting empirical benchmarks (CR4, capex/dark-store, Kirana density) to 1-10 force hostility scores.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 self-start sm:self-auto">
              Harvard Business Review
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.entries(rubrics).map(([fId, r]) => {
              const currentScore = currentForceScores[fId] || baselineForces.find(f => f.id === fId)?.baseScore || 5.0;

              return (
                <div key={fId} className="p-4 rounded-xl bg-dark-800/90 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-sans">{r.forceName}</h4>
                      <div className="text-xs text-cyan-400 font-mono mt-0.5">{r.metricName}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-white px-2.5 py-1 rounded bg-dark-900 border border-slate-700">
                      Score: {currentScore.toFixed(1)}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-slate-300 bg-dark-950 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Empirical Benchmark:</span>
                    {r.currentMetricValue}
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] text-slate-500 font-mono uppercase font-bold">Scoring Thresholds:</div>
                    {r.thresholds.map((th, tIdx) => {
                      const isActive = tIdx === r.activeThresholdIndex;
                      return (
                        <div
                          key={tIdx}
                          className={`p-2 rounded-lg text-xs font-mono flex items-center justify-between border ${
                            isActive
                              ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200 font-semibold'
                              : 'bg-dark-900/40 border-slate-800/60 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            {isActive && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                            <span>{th.label}</span>
                          </div>
                          <span className="text-white font-semibold ml-2">Score {th.score}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Radar Chart + Force Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Radar Visualization */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-dark-900/90 p-6 flex flex-col items-center justify-between shadow-2xl">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-2 font-semibold text-slate-200">
              <Shield className="w-4 h-4 text-cyan-400" />
              Dynamic Force Polygon
            </span>
            <span>Center = 0, Outer = 10</span>
          </div>

          {/* SVG Radar */}
          <div className="relative w-full flex items-center justify-center py-4">
            <svg width={size} height={size} className="overflow-visible">
              {[2, 4, 6, 8, 10].map(level => {
                const ringPoints = angles.map(a => {
                  const pt = getVertex(level, a);
                  return `${pt.x},${pt.y}`;
                }).join(' ');

                return (
                  <polygon
                    key={level}
                    points={ringPoints}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray={level === 10 ? 'none' : '2 2'}
                  />
                );
              })}

              {angles.map((a, i) => {
                const pt = getVertex(10, a);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={pt.x}
                    y2={pt.y}
                    stroke="#334155"
                    strokeWidth="1"
                  />
                );
              })}

              <polygon
                points={baselinePoints}
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.6"
              />

              <polygon
                points={currentPoints}
                fill="url(#radarGradient)"
                stroke="#06b6d4"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />

              <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {baselineForces.map((f, i) => {
                const a = angles[i];
                const score = currentForceScores[f.id] !== undefined ? currentForceScores[f.id] : f.baseScore;
                const vPt = getVertex(score, a);
                const lPt = getVertex(11.8, a);

                return (
                  <g key={f.id}>
                    <circle
                      cx={vPt.x}
                      cy={vPt.y}
                      r="5"
                      fill="#06b6d4"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    <text
                      x={lPt.x}
                      y={lPt.y + (a > 0 && a < Math.PI ? 6 : -2)}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="11"
                      fontFamily="Space Grotesk, sans-serif"
                      fontWeight="bold"
                    >
                      {f.name.split(' ')[0]}
                    </text>
                    <text
                      x={lPt.x}
                      y={lPt.y + (a > 0 && a < Math.PI ? 20 : 12)}
                      textAnchor="middle"
                      fill="#06b6d4"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {score.toFixed(1)}/10
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="w-full flex items-center justify-center gap-6 text-xs font-mono text-slate-400 pt-4 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500 border-dashed" /> Baseline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-cyan-400 rounded-sm" /> Current Simulated
            </span>
          </div>
        </div>

        {/* Right 7 Cols: Sliders with Expandable Rationale */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span>Force Dimensions & Weight Calibration</span>
            <span>Formula: 10 - Σ(w_i * S_i) / Σ(w_i)</span>
          </div>

          <div className="space-y-4">
            {baselineForces.map((force) => {
              const currentScore = currentForceScores[force.id] !== undefined
                ? currentForceScores[force.id]
                : force.baseScore;
              const currentWeight = currentForceWeights[force.id] !== undefined
                ? currentForceWeights[force.id]
                : force.defaultWeight;
              const isExpanded = expandedDetails[force.id];

              return (
                <SpotlightCard
                  key={force.id}
                  spotlightColor="rgba(6, 182, 212, 0.12)"
                  className="p-5 border border-slate-800 bg-dark-900/90 rounded-2xl space-y-4 shadow-sm"
                >
                  {/* Top Bar: Name, Badges, Hostility Pill & Weight Stepper */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="text-base font-bold text-white font-sans">
                        {force.name}
                      </h4>
                      <DataProvenanceBadge
                        type={force.provenanceType || (force.isPlaceholder ? 'placeholder' : 'verified')}
                        source={force.source}
                        year={force.year || '2024'}
                        confidence={force.confidence}
                      />
                    </div>

                    {/* Consolidated Hostility & Weight Controls */}
                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 shadow-sm ${
                        currentScore >= 8 ? 'bg-rose-500/15 text-rose-300 border-rose-500/35 shadow-rose-950/20' :
                        currentScore >= 6 ? 'bg-amber-500/15 text-amber-300 border-amber-500/35 shadow-amber-950/20' :
                        'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 shadow-emerald-950/20'
                      }`}>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Hostility:</span>
                        <span className="text-sm font-extrabold">{currentScore.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400">/ 10</span>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-dark-950 border border-slate-800 text-xs font-mono">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Weight:</span>
                        <input
                          type="number"
                          step="0.05"
                          min="0.05"
                          max="0.8"
                          value={currentWeight}
                          onChange={(e) => setForceWeight(force.id, parseFloat(e.target.value) || 0.1)}
                          className="w-12 bg-transparent text-cyan-300 text-xs text-center font-bold font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500/40 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clean Slider with Live Gradient Progress Fill */}
                  <div className="space-y-2 pt-1">
                    <input
                      type="range"
                      min="1.0"
                      max="10.0"
                      step="0.1"
                      value={currentScore}
                      onChange={(e) => setForceScore(force.id, parseFloat(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all border border-slate-800/80"
                      style={{
                        background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((currentScore - 1) / 9) * 100}%, #0f172a ${((currentScore - 1) / 9) * 100}%, #0f172a 100%)`
                      }}
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono select-none">
                      <span>1.0 (Weak Force)</span>
                      <span>5.5 (Neutral)</span>
                      <span>10.0 (Severe Squeeze)</span>
                    </div>
                  </div>

                  {/* Expandable Details Toggle */}
                  <div className="pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => toggleDetails(force.id)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isExpanded ? 'Hide Market Evidence' : 'Show Market Evidence & Drivers'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-2.5 text-xs text-slate-300 bg-dark-950 p-3.5 rounded-xl border border-slate-800 animate-in fade-in">
                        <p className="leading-relaxed">
                          {force.rationale}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {force.dataDrivers.map((driver, dIdx) => (
                            <span
                              key={dIdx}
                              className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-dark-900 border border-slate-800 text-slate-300"
                            >
                              &bull; {driver}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
