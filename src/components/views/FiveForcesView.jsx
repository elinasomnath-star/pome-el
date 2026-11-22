import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import GradientText from '../reactbits/GradientText';
import DataProvenanceBadge from '../common/DataProvenanceBadge';
import { getAllForceRubrics } from '../../engine/rubric';
import { Shield, Sliders, RotateCcw, AlertCircle, Info, Sparkles, TrendingDown, BookOpen, Check } from 'lucide-react';

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
  const rubrics = getAllForceRubrics();

  // Reset forces to base
  const handleResetForces = () => {
    baselineForces.forEach(f => {
      setForceScore(f.id, f.baseScore);
      setForceWeight(f.id, f.defaultWeight);
    });
  };

  // SVG Radar coordinates
  // 5 vertices arranged in a circle: -90 deg (top), -18 deg, 54 deg, 126 deg, 198 deg
  const size = 380;
  const center = size / 2;
  const radius = 135;

  const forceIds = ['rivalry', 'newEntrants', 'substitutes', 'buyerPower', 'supplierPower'];
  const angles = forceIds.map((_, i) => (-90 + (i * 360) / 5) * (Math.PI / 180));

  const getVertex = (score, angle) => {
    // Score [1, 10] normalized to [0.1, 1.0]
    const r = (score / 10) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Baseline polygon points
  const baselinePoints = baselineForces.map((f, i) => {
    const pt = getVertex(f.baseScore, angles[i]);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  // Current polygon points
  const currentPoints = baselineForces.map((f, i) => {
    const score = currentForceScores[f.id] !== undefined ? currentForceScores[f.id] : f.baseScore;
    const pt = getVertex(score, angles[i]);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title & Index Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
              Porter's Five Forces Model
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Porter (1979)
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Structural determinants of quick-commerce economic profitability. Drag sliders or edit weights to recalculate Industry Attractiveness.
          </p>
        </div>

        {/* Live Index Box */}
        <div className="flex items-center gap-4">
          <div className="p-3 px-5 rounded-2xl border border-violet-500/40 bg-gradient-to-tr from-dark-800 to-violet-950/30 shadow-lg shadow-violet-950/30 text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Industry Attractiveness Index</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-baseline justify-end gap-1">
              <CountUp to={industryAttractiveness.attractivenessIndex} decimals={2} suffix=" / 10" />
            </div>
            <div className={`text-xs font-semibold ${
              industryAttractiveness.attractivenessIndex >= 4.5 ? 'text-emerald-400' :
              industryAttractiveness.attractivenessIndex >= 3.0 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {industryAttractiveness.tier}
            </div>
          </div>

          <button
            onClick={() => setShowRubric(!showRubric)}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showRubric
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                : 'bg-dark-800 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>{showRubric ? 'Hide Rubric' : 'Scoring Rubric'}</span>
          </button>

          <button
            onClick={handleResetForces}
            className="p-3 rounded-2xl bg-dark-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors shadow-md"
            title="Reset forces and weights to baseline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scoring Rubric Panel (Requirement 2) */}
      {showRubric && (
        <div className="p-5 rounded-2xl border border-cyan-500/40 bg-dark-900/95 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Deterministic Scoring Rubric: Metrics → 1-10 Force Scores</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Explicit mathematical mapping from empirical quick commerce metrics (CR4, capex/dark-store, Kirana density) to force hostility scores.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Harvard Business Review (Porter 2008)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(rubrics).map(([fId, r]) => {
              const currentScore = currentForceScores[fId] || baselineForces.find(f => f.id === fId)?.baseScore || 5.0;

              return (
                <div key={fId} className="p-3.5 rounded-xl bg-dark-800/90 border border-slate-800 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white font-sans">{r.forceName}</h4>
                      <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{r.metricName}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-dark-900 border border-slate-700">
                      Score: {currentScore.toFixed(1)}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-300 bg-dark-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[9px] uppercase">Empirical Benchmark:</span>
                    {r.currentMetricValue}
                  </div>

                  {/* Threshold Steps */}
                  <div className="space-y-1">
                    <div className="text-[9px] text-slate-500 font-mono uppercase">Scoring Thresholds:</div>
                    {r.thresholds.map((th, tIdx) => {
                      const isActive = tIdx === r.activeThresholdIndex;
                      return (
                        <div
                          key={tIdx}
                          className={`p-1.5 rounded-md text-[10px] font-mono flex items-center justify-between border ${
                            isActive
                              ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200 font-bold'
                              : 'bg-dark-900/40 border-slate-800/60 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-1 truncate">
                            {isActive && <Check className="w-3 h-3 text-cyan-400 shrink-0" />}
                            <span>{th.label}</span>
                          </div>
                          <span className="text-white shrink-0 ml-1">Score {th.score}</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Radar Visualization */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-dark-900/90 p-5 flex flex-col items-center justify-between shadow-2xl relative">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-cyan-400" />
              Dynamic Force Polygon
            </span>
            <span className="text-[11px] text-slate-500">Center=0, Outer=10</span>
          </div>

          {/* SVG Radar */}
          <div className="relative w-full flex items-center justify-center py-2">
            <svg width={size} height={size} className="overflow-visible">
              
              {/* Concentric Polygons: 2, 4, 6, 8, 10 */}
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

              {/* Axis Spoke Lines */}
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

              {/* Baseline Reference Polygon (Faint Gray) */}
              <polygon
                points={baselinePoints}
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.6"
              />

              {/* Active Dynamic Polygon (Neon Violet/Cyan Glow) */}
              <polygon
                points={currentPoints}
                fill="url(#radarGradient)"
                stroke="#06b6d4"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />

              {/* Gradient Def */}
              <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Vertices Dots & Labels */}
              {baselineForces.map((f, i) => {
                const a = angles[i];
                const score = currentForceScores[f.id] !== undefined ? currentForceScores[f.id] : f.baseScore;
                const vPt = getVertex(score, a);
                const lPt = getVertex(11.8, a); // Position label outside

                return (
                  <g key={f.id}>
                    {/* Glowing Vertex Circle */}
                    <circle
                      cx={vPt.x}
                      cy={vPt.y}
                      r="4.5"
                      fill="#06b6d4"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="transition-all duration-200"
                    />

                    {/* Label */}
                    <text
                      x={lPt.x}
                      y={lPt.y + (a > 0 && a < Math.PI ? 6 : -2)}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="10"
                      fontFamily="Space Grotesk, sans-serif"
                      fontWeight="bold"
                    >
                      {f.name.split(' ')[0]}
                    </text>
                    <text
                      x={lPt.x}
                      y={lPt.y + (a > 0 && a < Math.PI ? 18 : 10)}
                      textAnchor="middle"
                      fill="#06b6d4"
                      fontSize="9"
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

          {/* Legend */}
          <div className="w-full flex items-center justify-center gap-6 text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500 border-dashed" /> Baseline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-cyan-400 rounded-sm" /> Current Simulated
            </span>
          </div>
        </div>

        {/* Right 7 Cols: Interactive Sliders & Reasoning */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span>Force Dimensions & Weight Calibration</span>
            <span>Formula: 10 - Σ(w_i * S_i) / Σ(w_i)</span>
          </div>

          <div className="space-y-3">
            {baselineForces.map((force) => {
              const currentScore = currentForceScores[force.id] !== undefined
                ? currentForceScores[force.id]
                : force.baseScore;
              const currentWeight = currentForceWeights[force.id] !== undefined
                ? currentForceWeights[force.id]
                : force.defaultWeight;

              return (
                <SpotlightCard
                  key={force.id}
                  spotlightColor="rgba(6, 182, 212, 0.15)"
                  className="p-4 border border-slate-800 bg-dark-800/80"
                >
                  <div className="space-y-3">
                    {/* Header Row: Force Name + Weight Editor */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white font-sans">
                            {force.name}
                          </h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                            currentScore >= 8 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            currentScore >= 6 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            Hostility: {currentScore.toFixed(1)} / 10
                          </span>
                          <DataProvenanceBadge
                            type={force.provenanceType || (force.isPlaceholder ? 'placeholder' : 'verified')}
                            source={force.source}
                            year={force.year || '2024'}
                            confidence={force.confidence}
                          />
                        </div>
                      </div>

                      {/* Weight Control */}
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span>Weight:</span>
                        <input
                          type="number"
                          step="0.05"
                          min="0.05"
                          max="0.8"
                          value={currentWeight}
                          onChange={(e) => setForceWeight(force.id, e.target.value)}
                          className="w-16 px-2 py-1 rounded bg-dark-900 border border-slate-700 text-cyan-400 text-xs text-center font-bold focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Interactive Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                        <span>1.0 (Benign / Weak Force)</span>
                        <span className="text-white font-bold">{currentScore.toFixed(1)}</span>
                        <span>10.0 (Severe Squeeze)</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="10.0"
                        step="0.1"
                        value={currentScore}
                        onChange={(e) => setForceScore(force.id, parseFloat(e.target.value))}
                        className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
                      />
                    </div>

                    {/* Real-World Context Rationale */}
                    <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                      {force.rationale}
                    </p>

                    {/* Data Drivers Bullets */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {force.dataDrivers.map((driver, dIdx) => (
                        <span
                          key={dIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-dark-900/80 border border-slate-800 text-slate-400"
                        >
                          &bull; {driver}
                        </span>
                      ))}
                    </div>
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

