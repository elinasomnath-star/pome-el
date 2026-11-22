import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import { motion, AnimatePresence } from 'framer-motion';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import CompanyBrandIcon from '../common/CompanyBrandIcon';
import {
  Zap,
  HelpCircle,
  Star,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Info,
  Sparkles,
  Layers
} from 'lucide-react';

export default function BCGMatrixView() {
  const {
    bcgMetrics,
    allShocks,
    activeShocks,
    toggleShock,
    resetShocks,
    selectedCompanyId,
    setSelectedCompanyId
  } = useSimStore();

  const [hoveredFirm, setHoveredFirm] = useState(null);

  // SVG Coordinate mapping:
  // X: Relative Market Share on Log scale from ~0.11x to ~2.8x
  const svgWidth = 840;
  const svgHeight = 510;
  const paddingLeft = 75;
  const paddingRight = 75;
  const paddingTop = 45;
  const paddingBottom = 65;

  const minLogRMS = -0.95; // ~0.11x RMS
  const maxLogRMS = 0.45;  // ~2.8x RMS
  const minGrowth = 0;
  const maxGrowth = 110;

  const mapX = (rms) => {
    const safeRms = Math.max(0.11, Math.min(2.8, rms));
    const logVal = Math.log10(safeRms);
    const normalized = (logVal - minLogRMS) / (maxLogRMS - minLogRMS);
    return paddingLeft + normalized * (svgWidth - paddingLeft - paddingRight);
  };

  const mapY = (growth) => {
    const safeGrowth = Math.max(minGrowth, Math.min(maxGrowth, growth));
    const normalized = (safeGrowth - minGrowth) / (maxGrowth - minGrowth);
    return svgHeight - paddingBottom - normalized * (svgHeight - paddingTop - paddingBottom);
  };

  // Threshold markers
  const thresholdX = mapX(1.0);  // 1.0 Relative Market Share
  const thresholdY = mapY(20.0); // 20% Growth Rate

  const activeFirmBCG = bcgMetrics.find(f => f.id === selectedCompanyId) || bcgMetrics[0] || {
    id: 'zepto',
    name: 'Zepto',
    relativeMarketShare: 0.71,
    effectiveGrowthRate: 90,
    revenue: 2800,
    darkStoreCount: 450,
    quadrant: 'Question Marks',
    prescription: {
      action: 'Build or Divest Dilemma',
      cashFlow: 'Heavy Cash Burn',
      recommendation: 'Decisive strategic crossroads: Either commit massive capital to challenge for #1 position, or selectively niche down.',
      posdcorbPriority: 'Planning & Directing'
    }
  };
  const p = activeFirmBCG.prescription || {
    action: 'Build & Defend',
    cashFlow: 'Self-Sustaining',
    recommendation: 'Maintain market scale and logistics density.',
    posdcorbPriority: 'Organizing & Budgeting'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24">
      
      {/* Title & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
                  BCG Growth-Share Matrix
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Henderson (1970)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                X-Axis: Relative Market Share vs #1 Rival (log scale) &bull; Y-Axis: Annual Market Growth (%) &bull; Bubble Area: FY24 Revenue.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Shocks Bar */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mr-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Macro Shocks:
          </span>
          {allShocks.slice(0, 3).map(shock => {
            const isActive = activeShocks.some(s => s.id === shock.id);
            return (
              <button
                key={shock.id}
                onClick={() => toggleShock(shock.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 shadow-sm shadow-rose-500/20 ring-1 ring-rose-500/40'
                    : 'bg-dark-800 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
                }`}
              >
                {isActive ? '✓ ' : '+ '}{shock.name}
              </button>
            );
          })}
          {activeShocks.length > 0 && (
            <button
              onClick={resetShocks}
              className="p-1.5 rounded-xl bg-dark-800 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Reset all active shocks"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Modern Interactive Company Portfolio Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {bcgMetrics.map(firm => {
          const isSelected = firm.id === selectedCompanyId;
          return (
            <div
              key={firm.id}
              onClick={() => setSelectedCompanyId(firm.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-dark-800 border-violet-500/80 shadow-lg shadow-violet-950/30 ring-1 ring-violet-500/40'
                  : 'bg-dark-900/80 border-slate-800 hover:border-slate-700 hover:bg-dark-850'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <CompanyBrandIcon id={firm.id} className="w-5 h-5 shrink-0" showBg={false} />
                  <span className="text-xs font-bold text-white truncate font-sans">{firm.name}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                  firm.quadrant === 'Stars' ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' :
                  firm.quadrant === 'Question Marks' ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' :
                  firm.quadrant === 'Dogs' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {firm.quadrant}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
                <span>RMS: <strong className="text-cyan-300">{firm.relativeMarketShare}x</strong></span>
                <span>₹{firm.revenue.toLocaleString()} Cr</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main BCG Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 8 Cols: Aesthetic Precision SVG Matrix */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-gradient-to-b from-dark-900 via-dark-950 to-dark-900 p-5 sm:p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between">
          
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[620px] select-none"
            >
              <defs>
                {/* Radial Glows for Quadrants */}
                <radialGradient id="starsGlow" cx="65%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="qmGlow" cx="35%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="dogsGlow" cx="35%" cy="75%" r="60%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="cowsGlow" cx="65%" cy="75%" r="60%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.07" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>

                {/* Soft Card Drop Shadow */}
                <filter id="cardShadow" x="-15%" y="-15%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.55" />
                </filter>
              </defs>

              {/* Quadrant Soft Glow Backgrounds */}
              {/* Question Marks (Top-Left) */}
              <rect
                x={paddingLeft}
                y={paddingTop}
                width={thresholdX - paddingLeft}
                height={thresholdY - paddingTop}
                fill="url(#qmGlow)"
              />
              {/* Stars (Top-Right) */}
              <rect
                x={thresholdX}
                y={paddingTop}
                width={svgWidth - paddingRight - thresholdX}
                height={thresholdY - paddingTop}
                fill="url(#starsGlow)"
              />
              {/* Dogs (Bottom-Left) */}
              <rect
                x={paddingLeft}
                y={thresholdY}
                width={thresholdX - paddingLeft}
                height={svgHeight - paddingBottom - thresholdY}
                fill="url(#dogsGlow)"
              />
              {/* Cash Cows (Bottom-Right) */}
              <rect
                x={thresholdX}
                y={thresholdY}
                width={svgWidth - paddingRight - thresholdX}
                height={svgHeight - paddingBottom - thresholdY}
                fill="url(#cowsGlow)"
              />

              {/* Precision Background Dotted Grid */}
              {/* Vertical dotted grid lines */}
              {[0.2, 0.5, 1.5, 2.0].map(tick => (
                <line
                  key={`vgrid-${tick}`}
                  x1={mapX(tick)}
                  y1={paddingTop}
                  x2={mapX(tick)}
                  y2={svgHeight - paddingBottom}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                  opacity="0.35"
                />
              ))}

              {/* Horizontal dotted grid lines */}
              {[40, 60, 80, 100].map(tick => (
                <line
                  key={`hgrid-${tick}`}
                  x1={paddingLeft}
                  y1={mapY(tick)}
                  x2={svgWidth - paddingRight}
                  y2={mapY(tick)}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                  opacity="0.35"
                />
              ))}

              {/* Modern Minimalist Quadrant Badges */}
              {/* Question Marks Badge */}
              <g transform={`translate(${paddingLeft + 16}, ${paddingTop + 16})`}>
                <rect x="0" y="0" width="180" height="24" rx="6" fill="#ec4899" fillOpacity="0.10" stroke="#ec4899" strokeOpacity="0.25" strokeWidth="1" />
                <text x="10" y="15.5" fill="#f472b6" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="800" letterSpacing="0.6">
                  QUESTION MARKS
                </text>
                <text x="110" y="15.5" fill="#64748b" fontSize="8" fontFamily="monospace">
                  LOW SHARE
                </text>
              </g>

              {/* Stars Badge */}
              <g transform={`translate(${thresholdX + 16}, ${paddingTop + 16})`}>
                <rect x="0" y="0" width="150" height="24" rx="6" fill="#8b5cf6" fillOpacity="0.10" stroke="#8b5cf6" strokeOpacity="0.25" strokeWidth="1" />
                <text x="10" y="15.5" fill="#c084fc" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="800" letterSpacing="0.6">
                  STARS
                </text>
                <text x="60" y="15.5" fill="#64748b" fontSize="8" fontFamily="monospace">
                  HIGH SHARE
                </text>
              </g>

              {/* Dogs Badge */}
              <g transform={`translate(${paddingLeft + 16}, ${thresholdY + 16})`}>
                <rect x="0" y="0" width="150" height="24" rx="6" fill="#f59e0b" fillOpacity="0.10" stroke="#f59e0b" strokeOpacity="0.25" strokeWidth="1" />
                <text x="10" y="15.5" fill="#fbbf24" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="800" letterSpacing="0.6">
                  DOGS
                </text>
                <text x="56" y="15.5" fill="#64748b" fontSize="8" fontFamily="monospace">
                  LOW GROWTH
                </text>
              </g>

              {/* Cash Cows Badge */}
              <g transform={`translate(${thresholdX + 16}, ${thresholdY + 16})`}>
                <rect x="0" y="0" width="160" height="24" rx="6" fill="#10b981" fillOpacity="0.10" stroke="#10b981" strokeOpacity="0.25" strokeWidth="1" />
                <text x="10" y="15.5" fill="#34d399" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="800" letterSpacing="0.6">
                  CASH COWS
                </text>
                <text x="82" y="15.5" fill="#64748b" fontSize="8" fontFamily="monospace">
                  HIGH SHARE
                </text>
              </g>

              {/* Main Outer Axes */}
              <line
                x1={paddingLeft}
                y1={svgHeight - paddingBottom}
                x2={svgWidth - paddingRight}
                y2={svgHeight - paddingBottom}
                stroke="#475569"
                strokeWidth="1.5"
              />
              <line
                x1={paddingLeft}
                y1={paddingTop}
                x2={paddingLeft}
                y2={svgHeight - paddingBottom}
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Glowing Threshold Dividers */}
              {/* RMS = 1.0 vertical threshold */}
              <line
                x1={thresholdX}
                y1={paddingTop}
                x2={thresholdX}
                y2={svgHeight - paddingBottom}
                stroke="#8b5cf6"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeOpacity="0.8"
              />
              <g transform={`translate(${thresholdX}, ${paddingTop - 14})`}>
                <rect x="-42" y="0" width="84" height="18" rx="9" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1" />
                <text x="0" y="12" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  RMS = 1.0x
                </text>
              </g>

              {/* Growth = 20% horizontal threshold */}
              <line
                x1={paddingLeft}
                y1={thresholdY}
                x2={svgWidth - paddingRight}
                y2={thresholdY}
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeOpacity="0.8"
              />
              <g transform={`translate(${svgWidth - paddingRight + 4}, ${thresholdY - 9})`}>
                <rect x="0" y="0" width="66" height="18" rx="9" fill="#083344" stroke="#06b6d4" strokeWidth="1" />
                <text x="33" y="12" textAnchor="middle" fill="#67e8f9" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                  20% Growth
                </text>
              </g>

              {/* Axis Titles */}
              <text
                x={(paddingLeft + svgWidth - paddingRight) / 2}
                y={svgHeight - 16}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="11"
                fontFamily="system-ui, sans-serif"
                fontWeight="600"
              >
                Relative Market Share (vs #1 Rival, log scale) →
              </text>

              <text
                x={-(paddingTop + svgHeight - paddingBottom) / 2}
                y={22}
                transform="rotate(-90)"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="11"
                fontFamily="system-ui, sans-serif"
                fontWeight="600"
              >
                Annual Market Growth Rate (%) →
              </text>

              {/* Ticks for RMS */}
              {[0.2, 0.5, 1.0, 1.5, 2.0].map(tick => (
                <g key={tick} transform={`translate(${mapX(tick)}, ${svgHeight - paddingBottom})`}>
                  <line y2="6" stroke="#64748b" strokeWidth="1.2" />
                  <text y="20" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    {tick}x
                  </text>
                </g>
              ))}

              {/* Ticks for Growth */}
              {[0, 20, 40, 60, 80, 100].map(tick => (
                <g key={tick} transform={`translate(${paddingLeft}, ${mapY(tick)})`}>
                  <line x2="-6" stroke="#64748b" strokeWidth="1.2" />
                  <text x="-12" y="3.5" textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    {tick}%
                  </text>
                </g>
              ))}

              {/* High-Fidelity Company Bubbles */}
              {bcgMetrics.map((firm) => {
                const cx = mapX(firm.relativeMarketShare);
                const cy = mapY(firm.effectiveGrowthRate);
                const radius = Math.max(26, Math.min(48, Math.sqrt(firm.revenue) * 0.54));
                const isSelected = firm.id === selectedCompanyId;
                const isHovered = hoveredFirm?.id === firm.id;

                return (
                  <g
                    key={firm.id}
                    onClick={() => setSelectedCompanyId(firm.id)}
                    onMouseEnter={() => setHoveredFirm(firm)}
                    onMouseLeave={() => setHoveredFirm(null)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing Selection Halo */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={radius + 8}
                        fill="none"
                        stroke={firm.color}
                        strokeWidth="2.5"
                        strokeOpacity="0.8"
                        className="animate-pulse"
                      />
                    )}

                    {/* Ambient Glow */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius + 4}
                      fill={firm.color}
                      opacity={isHovered ? 0.35 : 0.16}
                      className="transition-all duration-300"
                    />

                    {/* Core Bubble with Glass Aesthetic */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill="#0d1322"
                      stroke={firm.color}
                      strokeWidth={isSelected ? 3.5 : 2}
                      className="transition-all duration-300 group-hover:scale-105"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius - 2}
                      fill={firm.color}
                      fillOpacity="0.88"
                    />

                    {/* Company Vector Brand Icon */}
                    <foreignObject
                      x={cx - 15}
                      y={cy - 15}
                      width="30"
                      height="30"
                      className="pointer-events-none select-none"
                    >
                      <CompanyBrandIcon id={firm.id} className="w-7.5 h-7.5" showBg={false} />
                    </foreignObject>

                    {/* Polished Floating Glass Badge */}
                    <g transform={`translate(${cx}, ${cy + radius + 10})`} filter="url(#cardShadow)">
                      <rect
                        x="-60"
                        y="0"
                        width="120"
                        height="22"
                        rx="11"
                        fill="#0a0e1a"
                        stroke={firm.color}
                        strokeOpacity="0.6"
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y="14.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9.5"
                        fontFamily="system-ui, sans-serif"
                        fontWeight="700"
                      >
                        {firm.name.split(' ')[0]} • <tspan fill={firm.color}>₹{firm.revenue}Cr</tspan>
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-4 border-t border-slate-800/80">
            <span>Click any bubble to select company & simulate strategy responses.</span>
            <span>Thresholds: RMS 1.0x &bull; Growth 20%</span>
          </div>
        </div>

        {/* Right 4 Cols: Selected Firm Strategic Prescription Dossier */}
        <div className="lg:col-span-4">
          <SpotlightCard
            spotlightColor="rgba(139, 92, 246, 0.25)"
            className="p-6 border border-slate-800 bg-dark-900/95 rounded-2xl shadow-2xl space-y-5"
          >
            {/* Firm Header with Official Brand Icon */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <CompanyBrandIcon id={activeFirmBCG.id} className="w-8 h-8" showBg={true} />
                <div>
                  <h3 className="text-xl font-bold text-white font-sans flex items-center gap-1.5">
                    {activeFirmBCG.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {activeFirmBCG.brandTag || "Quick Commerce"}
                  </span>
                </div>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                activeFirmBCG.quadrant === 'Stars' ? 'bg-violet-500/20 text-violet-300 border-violet-500/40' :
                activeFirmBCG.quadrant === 'Cash Cows' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                activeFirmBCG.quadrant === 'Question Marks' ? 'bg-pink-500/20 text-pink-300 border-pink-500/40' :
                'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {activeFirmBCG.quadrant}
              </div>
            </div>

            {/* Quantitative Coordinates */}
            <div className="grid grid-cols-2 gap-3.5 p-3.5 rounded-xl bg-dark-950 border border-slate-800">
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-mono">Relative Market Share</div>
                <div className="text-xl font-bold font-mono text-white mt-0.5">
                  <CountUp to={activeFirmBCG.relativeMarketShare} decimals={2} suffix="x" />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {activeFirmBCG.relativeMarketShare >= 1.0 ? "Market Leader" : "Market Challenger"}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400 uppercase font-mono">Effective Growth</div>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                  <CountUp to={activeFirmBCG.effectiveGrowthRate} decimals={1} prefix="+" suffix="%" />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {activeFirmBCG.effectiveGrowthRate >= 20 ? "High Growth Sector" : "Mature Sector"}
                </div>
              </div>
            </div>

            {/* Prescribed Strategic Action */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold uppercase font-mono text-violet-400 tracking-wider">
                Prescribed Strategic Imperative
              </div>
              <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-950/20 space-y-1.5">
                <div className="text-sm font-bold text-white font-sans">{p.action}</div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{p.recommendation}</p>
              </div>
            </div>

            {/* Operational Dynamics */}
            <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Cash Flow Dynamics:</span>
                <span className="font-mono text-white font-medium">{p.cashFlow}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">POSDCORB Priority:</span>
                <span className="font-mono text-cyan-400 font-medium">{p.posdcorbPriority}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Dark Store Fleet:</span>
                <span className="font-mono text-emerald-400 font-medium">{activeFirmBCG.darkStoreCount} stores</span>
              </div>
            </div>

            {/* Source Reference */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Bruce Henderson (BCG 1970)</span>
              <button
                onClick={() => {
                  const all = useSimStore.getState();
                  all.setActiveTab('recommender');
                }}
                className="text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Full Strategy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </SpotlightCard>
        </div>

      </div>

    </div>
  );
}
