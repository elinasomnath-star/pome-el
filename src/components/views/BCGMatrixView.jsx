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
  Layers,
  ShieldAlert,
  Compass
} from 'lucide-react';

export default function BCGMatrixView() {
  const {
    bcgMetrics,
    allShocks,
    activeShocks,
    toggleShock,
    resetShocks,
    selectedCompanyId,
    setSelectedCompanyId,
    setActiveTab
  } = useSimStore();

  const [hoveredFirm, setHoveredFirm] = useState(null);

  // Expanded SVG Canvas Dimensions for Maximum Breathing Room
  const svgWidth = 860;
  const svgHeight = 580;
  const paddingLeft = 70;
  const paddingRight = 60;
  const paddingTop = 45;
  const paddingBottom = 55;

  const usableWidth = svgWidth - paddingLeft - paddingRight;   // 730px
  const usableHeight = svgHeight - paddingTop - paddingBottom; // 480px

  // Balanced 2x2 Threshold Centerpoints
  // Places RMS = 1.0x at 52% width, Growth = 20% benchmark at 50% height
  const thresholdX = paddingLeft + usableWidth * 0.52;   // 449.6px
  const thresholdY = paddingTop + usableHeight * 0.50;   // 285px

  // Piecewise Logarithmic & Proportional Coordinate Mapping
  // Ensures ALL 4 quadrants have generous, balanced screen space and zero awkward squishing
  const mapX = (rms) => {
    const safeRms = Math.max(0.08, Math.min(2.8, rms));
    if (safeRms <= 1.0) {
      // 0.1x to 1.0x mapped to left half [paddingLeft ... thresholdX]
      const minLog = Math.log10(0.1); // -1.0
      const currLog = Math.max(-1.0, Math.log10(safeRms));
      const norm = (currLog - minLog) / (0 - minLog); // 0 to 1
      return paddingLeft + norm * (thresholdX - paddingLeft);
    } else {
      // 1.0x to 2.5x mapped to right half [thresholdX ... svgWidth - paddingRight]
      const maxLog = Math.log10(2.5); // ~0.398
      const currLog = Math.min(maxLog, Math.log10(safeRms));
      const norm = currLog / maxLog; // 0 to 1
      return thresholdX + norm * (svgWidth - paddingRight - thresholdX);
    }
  };

  const mapY = (growth) => {
    const safeGrowth = Math.max(0, Math.min(115, growth));
    if (safeGrowth <= 20.0) {
      // 0% to 20% mapped to bottom half [thresholdY ... svgHeight - paddingBottom]
      const norm = safeGrowth / 20.0; // 0 to 1
      return (svgHeight - paddingBottom) - norm * (svgHeight - paddingBottom - thresholdY);
    } else {
      // 20% to 110% mapped to top half [paddingTop ... thresholdY]
      const norm = (safeGrowth - 20.0) / 90.0; // 0 to 1
      return thresholdY - norm * (thresholdY - paddingTop);
    }
  };

  const activeFirmBCG = bcgMetrics.find(f => f.id === selectedCompanyId) || bcgMetrics[0] || {
    id: 'zepto',
    name: 'Zepto',
    relativeMarketShare: 0.71,
    effectiveGrowthRate: 85,
    revenue: 2800,
    darkStoreCount: 450,
    quadrant: 'Question Marks',
    prescription: {
      action: 'Build or Divest Dilemma',
      cashFlow: 'Heavy Cash Burn / Negative Cash Flow',
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

  // Dimensions of the 4 quadrant panels
  const qmBox = {
    x: paddingLeft + 4,
    y: paddingTop + 4,
    w: thresholdX - paddingLeft - 8,
    h: thresholdY - paddingTop - 8
  };
  const starsBox = {
    x: thresholdX + 4,
    y: paddingTop + 4,
    w: svgWidth - paddingRight - thresholdX - 8,
    h: thresholdY - paddingTop - 8
  };
  const dogsBox = {
    x: paddingLeft + 4,
    y: thresholdY + 4,
    w: thresholdX - paddingLeft - 8,
    h: svgHeight - paddingBottom - thresholdY - 8
  };
  const cowsBox = {
    x: thresholdX + 4,
    y: thresholdY + 4,
    w: svgWidth - paddingRight - thresholdX - 8,
    h: svgHeight - paddingBottom - thresholdY - 8
  };

  // Collision-Free Badge Offsets
  // Explicitly tuned so adjacent bubbles NEVER overlap each other or threshold lines
  const getBadgeOffset = (firmId, radius) => {
    switch (firmId) {
      case 'zepto':
        // Zepto is high up; offset badge horizontally to the left so it never collides with Swiggy below it
        return { x: -radius - 75, y: -8, anchor: 'middle' };
      case 'swiggy_instamart':
      case 'swiggy':
        // Swiggy badge placed below its bubble
        return { x: 0, y: radius + 14, anchor: 'middle' };
      case 'bigbasket_now':
      case 'bb_now':
        // BB Now badge placed ABOVE its bubble so it never touches the 20% growth line
        return { x: 0, y: -radius - 14, anchor: 'middle' };
      case 'blinkit':
      default:
        // Blinkit badge placed cleanly below its bubble
        return { x: 0, y: radius + 14, anchor: 'middle' };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-28">
      
      {/* Title & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
                  BCG Growth-Share Matrix
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Bruce Henderson (1970)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Strategic 2&times;2 Portfolio Framework: Relative Market Share vs. Annual Market Growth Rate &bull; Bubble Size = FY24 GOV / Revenue.
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
                title={shock.description || shock.name}
              >
                {isActive ? '✓ ' : '+ '}{shock.name}
              </button>
            );
          })}
          {activeShocks.length > 0 && (
            <button
              onClick={resetShocks}
              className="px-2.5 py-1.5 rounded-xl bg-dark-800 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-mono"
              title="Reset all active shocks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Modern Interactive Company Portfolio Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {bcgMetrics.map(firm => {
          const isSelected = firm.id === selectedCompanyId;
          const isStar = firm.quadrant === 'Stars';
          const isQM = firm.quadrant === 'Question Marks';
          const isDog = firm.quadrant === 'Dogs';

          return (
            <div
              key={firm.id}
              onClick={() => setSelectedCompanyId(firm.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-dark-800 border-violet-500/80 shadow-lg shadow-violet-950/40 ring-1 ring-violet-500/40'
                  : 'bg-dark-900/90 border-slate-800 hover:border-slate-700 hover:bg-dark-850'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CompanyBrandIcon id={firm.id} className="w-6 h-6 shrink-0" showBg={false} />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate font-sans">{firm.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">₹{firm.revenue.toLocaleString()} Cr</span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${
                  isStar ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' :
                  isQM ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' :
                  isDog ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {firm.quadrant}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                <span>RMS: <strong className="text-cyan-300">{firm.relativeMarketShare}x</strong></span>
                <span>Growth: <strong className="text-emerald-400">+{firm.effectiveGrowthRate}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main BCG Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 8 Cols: Balanced Executive 2x2 Matrix Canvas */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-dark-950 p-4 sm:p-6 shadow-2xl space-y-4">
          
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[660px] select-none"
            >
              <defs>
                {/* Quadrant Radial Glow Gradients */}
                <radialGradient id="starsGrad" cx="60%" cy="40%" r="75%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.16" />
                  <stop offset="70%" stopColor="#6366f1" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.02" />
                </radialGradient>
                <radialGradient id="qmGrad" cx="40%" cy="40%" r="75%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.14" />
                  <stop offset="70%" stopColor="#f43f5e" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#831843" stopOpacity="0.02" />
                </radialGradient>
                <radialGradient id="dogsGrad" cx="40%" cy="60%" r="75%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.12" />
                  <stop offset="70%" stopColor="#d97706" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#451a03" stopOpacity="0.02" />
                </radialGradient>
                <radialGradient id="cowsGrad" cx="60%" cy="60%" r="75%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.14" />
                  <stop offset="70%" stopColor="#059669" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#064e3b" stopOpacity="0.02" />
                </radialGradient>

                {/* Drop Shadows */}
                <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.75" />
                </filter>
                <filter id="bubbleShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.8" />
                </filter>
              </defs>

              {/* ================= 4 DISTINCT QUADRANT CARDS ================= */}

              {/* 1. QUESTION MARKS CARD (Top-Left) */}
              <g>
                <rect
                  x={qmBox.x}
                  y={qmBox.y}
                  width={qmBox.w}
                  height={qmBox.h}
                  rx="14"
                  fill="url(#qmGrad)"
                  stroke="#ec4899"
                  strokeWidth="1"
                  strokeOpacity="0.25"
                />
                {/* Header Tag - Positioned safely in top-left corner */}
                <g transform={`translate(${qmBox.x + 14}, ${qmBox.y + 14})`}>
                  <rect x="0" y="0" width="138" height="22" rx="6" fill="#be185d" fillOpacity="0.25" stroke="#ec4899" strokeOpacity="0.4" strokeWidth="1" />
                  <text x="8" y="14.5" fill="#f472b6" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="800" letterSpacing="0.4">
                    ? QUESTION MARKS
                  </text>
                  <text x="146" y="15" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
                    HIGH GROWTH &bull; LOW SHARE
                  </text>
                </g>
                {/* Watermark in bottom-right of quadrant */}
                <text x={thresholdX - 24} y={thresholdY - 18} textAnchor="end" fill="#ec4899" fillOpacity="0.08" fontSize="48" fontFamily="system-ui, sans-serif" fontWeight="900">
                  ?
                </text>
              </g>

              {/* 2. STARS CARD (Top-Right) */}
              <g>
                <rect
                  x={starsBox.x}
                  y={starsBox.y}
                  width={starsBox.w}
                  height={starsBox.h}
                  rx="14"
                  fill="url(#starsGrad)"
                  stroke="#8b5cf6"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
                {/* Header Tag */}
                <g transform={`translate(${starsBox.x + 14}, ${starsBox.y + 14})`}>
                  <rect x="0" y="0" width="90" height="22" rx="6" fill="#6d28d9" fillOpacity="0.25" stroke="#8b5cf6" strokeOpacity="0.4" strokeWidth="1" />
                  <text x="8" y="14.5" fill="#c084fc" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="800" letterSpacing="0.4">
                    ★ STARS
                  </text>
                  <text x="98" y="15" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
                    HIGH GROWTH &bull; HIGH SHARE
                  </text>
                </g>
                {/* Watermark in bottom-right of quadrant */}
                <text x={svgWidth - paddingRight - 24} y={thresholdY - 18} textAnchor="end" fill="#8b5cf6" fillOpacity="0.08" fontSize="48" fontFamily="system-ui, sans-serif" fontWeight="900">
                  ★
                </text>
              </g>

              {/* 3. DOGS CARD (Bottom-Left) */}
              <g>
                <rect
                  x={dogsBox.x}
                  y={dogsBox.y}
                  width={dogsBox.w}
                  height={dogsBox.h}
                  rx="14"
                  fill="url(#dogsGrad)"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeOpacity="0.22"
                />
                {/* Header Tag */}
                <g transform={`translate(${dogsBox.x + 14}, ${dogsBox.y + 14})`}>
                  <rect x="0" y="0" width="82" height="22" rx="6" fill="#b45309" fillOpacity="0.25" stroke="#f59e0b" strokeOpacity="0.4" strokeWidth="1" />
                  <text x="8" y="14.5" fill="#fbbf24" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="800" letterSpacing="0.4">
                    ▲ DOGS
                  </text>
                  <text x="90" y="15" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
                    LOW GROWTH &bull; LOW SHARE
                  </text>
                </g>
                {/* Watermark */}
                <text x={thresholdX - 24} y={svgHeight - paddingBottom - 18} textAnchor="end" fill="#f59e0b" fillOpacity="0.08" fontSize="44" fontFamily="system-ui, sans-serif" fontWeight="900">
                  ▲
                </text>
              </g>

              {/* 4. CASH COWS CARD (Bottom-Right) */}
              <g>
                <rect
                  x={cowsBox.x}
                  y={cowsBox.y}
                  width={cowsBox.w}
                  height={cowsBox.h}
                  rx="14"
                  fill="url(#cowsGrad)"
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeOpacity="0.25"
                />
                {/* Header Tag */}
                <g transform={`translate(${cowsBox.x + 14}, ${cowsBox.y + 14})`}>
                  <rect x="0" y="0" width="118" height="22" rx="6" fill="#047857" fillOpacity="0.25" stroke="#10b981" strokeOpacity="0.4" strokeWidth="1" />
                  <text x="8" y="14.5" fill="#34d399" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="800" letterSpacing="0.4">
                    ₹ CASH COWS
                  </text>
                  <text x="126" y="15" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
                    LOW GROWTH &bull; HIGH SHARE
                  </text>
                </g>
                {/* Watermark */}
                <text x={svgWidth - paddingRight - 24} y={svgHeight - paddingBottom - 18} textAnchor="end" fill="#10b981" fillOpacity="0.08" fontSize="44" fontFamily="system-ui, sans-serif" fontWeight="900">
                  ₹
                </text>
              </g>

              {/* ================= SUBTLE PRECISION DOTTED GRIDS ================= */}
              {[0.2, 0.5, 1.5, 2.0].map(tick => (
                <line
                  key={`vgrid-${tick}`}
                  x1={mapX(tick)}
                  y1={paddingTop + 10}
                  x2={mapX(tick)}
                  y2={svgHeight - paddingBottom - 10}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                  opacity="0.3"
                />
              ))}

              {[10, 40, 60, 80, 100].map(tick => (
                <line
                  key={`hgrid-${tick}`}
                  x1={paddingLeft + 10}
                  y1={mapY(tick)}
                  x2={svgWidth - paddingRight - 10}
                  y2={mapY(tick)}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                  opacity="0.3"
                />
              ))}

              {/* ================= CENTRAL GLOWING THRESHOLD DIVIDERS ================= */}
              
              {/* Vertical RMS = 1.0x Threshold */}
              <line
                x1={thresholdX}
                y1={paddingTop}
                x2={thresholdX}
                y2={svgHeight - paddingBottom}
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeDasharray="5 5"
                strokeOpacity="0.9"
              />
              {/* RMS Badge at top of divider */}
              <g transform={`translate(${thresholdX}, ${paddingTop - 12})`} filter="url(#badgeShadow)">
                <rect x="-65" y="0" width="130" height="20" rx="10" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.2" />
                <text x="0" y="13.5" textAnchor="middle" fill="#c084fc" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                  RMS = 1.0x (Leader)
                </text>
              </g>

              {/* Horizontal Growth = 20% Threshold */}
              <line
                x1={paddingLeft}
                y1={thresholdY}
                x2={svgWidth - paddingRight}
                y2={thresholdY}
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="5 5"
                strokeOpacity="0.9"
              />
              {/* Growth Badge PINNED INSIDE RIGHT BORDER to prevent clipping */}
              <g transform={`translate(${svgWidth - paddingRight - 94}, ${thresholdY - 10})`} filter="url(#badgeShadow)">
                <rect x="0" y="0" width="90" height="20" rx="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.2" />
                <text x="45" y="13.5" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  Growth: 20%
                </text>
              </g>

              {/* Reticle / Origin Marker at Intersection */}
              <circle cx={thresholdX} cy={thresholdY} r="6" fill="#0f172a" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" />
              <circle cx={thresholdX} cy={thresholdY} r="2" fill="#8b5cf6" />

              {/* ================= AXIS TICKS ================= */}
              {/* RMS Ticks on Bottom */}
              {[0.2, 0.5, 1.0, 1.5, 2.0].map(tick => (
                <g key={`x-tick-${tick}`} transform={`translate(${mapX(tick)}, ${svgHeight - paddingBottom})`}>
                  <line y2="6" stroke="#64748b" strokeWidth="1.2" />
                  <text y="18" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    {tick}x
                  </text>
                </g>
              ))}

              {/* Growth Ticks on Left */}
              {[0, 10, 20, 40, 60, 80, 100].map(tick => (
                <g key={`y-tick-${tick}`} transform={`translate(${paddingLeft}, ${mapY(tick)})`}>
                  <line x2="-6" stroke="#64748b" strokeWidth="1.2" />
                  <text x="-10" y="3.5" textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    {tick}%
                  </text>
                </g>
              ))}

              {/* ================= HIGH-FIDELITY COMPANY BUBBLES ================= */}
              {bcgMetrics.map((firm) => {
                const cx = mapX(firm.relativeMarketShare);
                const cy = mapY(firm.effectiveGrowthRate);
                // Scaled radius based on FY24 Revenue
                const radius = Math.max(28, Math.min(46, Math.sqrt(firm.revenue) * 0.56));
                const isSelected = firm.id === selectedCompanyId;
                const isHovered = hoveredFirm?.id === firm.id;
                const offset = getBadgeOffset(firm.id, radius);

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
                        strokeDasharray="4 2"
                        className="animate-spin"
                        style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: '10s' }}
                      />
                    )}

                    {/* Ambient Glow */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius + 5}
                      fill={firm.color}
                      opacity={isHovered ? 0.35 : 0.18}
                      className="transition-all duration-300"
                    />

                    {/* Core Solid Bubble with Glass Surface */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill="#0d1322"
                      stroke={firm.color}
                      strokeWidth={isSelected ? 3.5 : 2}
                      filter="url(#bubbleShadow)"
                      className="transition-all duration-300 group-hover:scale-105"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius - 2}
                      fill={firm.color}
                      fillOpacity="0.88"
                    />

                    {/* Company Vector Brand Icon Centered - Using 32x32 foreignObject */}
                    <foreignObject
                      x={cx - 16}
                      y={cy - 16}
                      width="32"
                      height="32"
                      style={{ overflow: 'visible', pointerEvents: 'none' }}
                      className="select-none"
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        <CompanyBrandIcon id={firm.id} className="w-8 h-8" showBg={false} />
                      </div>
                    </foreignObject>

                    {/* Collision-Free Floating Metric Badge */}
                    <g transform={`translate(${cx + offset.x}, ${cy + offset.y})`} filter="url(#badgeShadow)">
                      <rect
                        x="-60"
                        y="-11"
                        width="120"
                        height="22"
                        rx="11"
                        fill="#0b0f19"
                        stroke={firm.color}
                        strokeOpacity="0.8"
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9.5"
                        fontFamily="system-ui, sans-serif"
                        fontWeight="700"
                      >
                        {firm.name.split(' ')[0]} &bull; <tspan fill={firm.color}>₹{firm.revenue}Cr</tspan>
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Dual Directional Navigation Labels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-400 bg-dark-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-violet-400 font-bold">&larr; Low Share (&lt;1.0x)</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400 font-bold">High Share (&gt;1.0x) &rarr;</span>
              <span className="ml-auto text-[11px] text-slate-400">X: RMS vs #1</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 bg-dark-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-emerald-400 font-bold">&uarr; High Growth (&gt;20%)</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400 font-bold">Low Growth (&lt;20%) &darr;</span>
              <span className="ml-auto text-[11px] text-slate-400">Y: Annual %</span>
            </div>
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
                <CompanyBrandIcon id={activeFirmBCG.id} className="w-9 h-9" showBg={true} />
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
                  {activeFirmBCG.relativeMarketShare >= 1.0 ? "Category Leader (#1)" : "Market Challenger"}
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
              <div className="flex justify-between py-1">
                <span className="text-slate-400">FY24 Revenue Run-Rate:</span>
                <span className="font-mono text-amber-400 font-medium">₹{activeFirmBCG.revenue.toLocaleString()} Cr</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>BCG Matrix &bull; Henderson (1970)</span>
              <button
                onClick={() => setActiveTab('recommender')}
                className="text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View Full Strategy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </SpotlightCard>
        </div>

      </div>

    </div>
  );
}
