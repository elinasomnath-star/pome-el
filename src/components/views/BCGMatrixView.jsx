import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import { motion, AnimatePresence } from 'framer-motion';
import GlassSurface from '../reactbits/GlassSurface';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import { Zap, HelpCircle, Star, DollarSign, AlertTriangle, Play, RotateCcw, ArrowRight, ScatterChart } from 'lucide-react';

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
  // X: Relative Market Share on Log scale from 0.1 to 2.5
  // Log10(0.1) = -1.0, Log10(1.0) = 0.0, Log10(2.5) = ~0.4
  // Map [-1.0, 0.5] to [padding, width - padding]
  const svgWidth = 720;
  const svgHeight = 480;
  const padding = 70;

  const minLogRMS = -0.9; // ~0.12 RMS
  const maxLogRMS = 0.45; // ~2.8 RMS
  const minGrowth = 0;
  const maxGrowth = 100;

  const mapX = (rms) => {
    const safeRms = Math.max(0.12, Math.min(2.8, rms));
    const logVal = Math.log10(safeRms);
    const normalized = (logVal - minLogRMS) / (maxLogRMS - minLogRMS);
    return padding + normalized * (svgWidth - 2 * padding);
  };

  const mapY = (growth) => {
    const safeGrowth = Math.max(minGrowth, Math.min(maxGrowth, growth));
    // Invert Y because SVG origin is top-left
    const normalized = (safeGrowth - minGrowth) / (maxGrowth - minGrowth);
    return svgHeight - padding - normalized * (svgHeight - 2 * padding);
  };

  // Threshold markers
  const thresholdX = mapX(1.0); // 1.0 Relative Market Share
  const thresholdY = mapY(20.0); // 20% Growth Rate

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title & Theoretical Framing */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
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
                  Bruce Henderson (1970)
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                X-Axis: Relative Market Share (log scale vs #1 rival) &bull; Y-Axis: Annual Growth Rate (%) &bull; Bubble Area: FY24 Revenue.
              </p>
            </div>
          </div>
        </div>

        {/* Shock Lab Quick-Action Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Quick Shocks:
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
              title="Reset all shocks"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main BCG Interactive Canvas & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Animated SVG Bubble Chart */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-dark-900/90 p-6 sm:p-7 relative overflow-hidden shadow-2xl flex flex-col justify-between">
          
          {/* Quadrant Watermark Labels */}
          <div className="absolute inset-0 pointer-events-none p-12 grid grid-cols-2 grid-rows-2">
            <div className="p-4 border-r border-b border-slate-800/60 flex flex-col justify-start">
              <span className="text-xs font-mono font-bold tracking-widest text-pink-400/50 uppercase flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-pink-500/40" />
                QUESTION MARKS (High Growth, Low Share)
              </span>
              <span className="text-xs text-slate-500 mt-1">High cash drain; Build share or Divest</span>
            </div>
            <div className="p-4 border-b border-slate-800/60 flex flex-col justify-start items-end text-right">
              <span className="text-xs font-mono font-bold tracking-widest text-violet-400/50 uppercase flex items-center gap-1.5">
                <Star className="w-4 h-4 text-violet-500/40" />
                STARS (High Growth, High Share)
              </span>
              <span className="text-xs text-slate-500 mt-1">Self-sustaining; Reinvest to hold lead</span>
            </div>
            <div className="p-4 border-r border-slate-800/60 flex flex-col justify-end">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400/50 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500/40" />
                DOGS (Low Growth, Low Share)
              </span>
              <span className="text-xs text-slate-500 mt-1">Harvest or Restructure / Exit</span>
            </div>
            <div className="p-4 flex flex-col justify-end items-end text-right">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400/50 uppercase flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-500/40" />
                CASH COWS (Low Growth, High Share)
              </span>
              <span className="text-xs text-slate-500 mt-1">High cash generation; Milk margins</span>
            </div>
          </div>

          {/* SVG Matrix */}
          <div className="relative z-10 w-full overflow-x-auto py-2">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[540px]"
            >
              {/* Grid Lines */}
              <line
                x1={padding}
                y1={svgHeight - padding}
                x2={svgWidth - padding}
                y2={svgHeight - padding}
                stroke="#334155"
                strokeWidth="1.5"
              />
              <line
                x1={padding}
                y1={padding}
                x2={padding}
                y2={svgHeight - padding}
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Threshold Lines (Dashed neon) */}
              {/* RMS = 1.0 vertical threshold */}
              <line
                x1={thresholdX}
                y1={padding}
                x2={thresholdX}
                y2={svgHeight - padding}
                stroke="#8b5cf6"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeOpacity="0.8"
              />
              <text
                x={thresholdX + 8}
                y={padding + 16}
                fill="#a78bfa"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                RMS Threshold = 1.0x
              </text>

              {/* Growth = 20% horizontal threshold */}
              <line
                x1={padding}
                y1={thresholdY}
                x2={svgWidth - padding}
                y2={thresholdY}
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeOpacity="0.8"
              />
              <text
                x={svgWidth - padding - 160}
                y={thresholdY - 10}
                fill="#38bdf8"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Growth Threshold = 20%
              </text>

              {/* Axis Labels */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 14}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="600"
              >
                Relative Market Share (log scale vs #1 Competitor) →
              </text>

              <text
                x={-svgHeight / 2}
                y={22}
                transform="rotate(-90)"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="600"
              >
                Annual Market Growth Rate (%) →
              </text>

              {/* Tick Marks for RMS: 0.2, 0.5, 1.0, 1.5, 2.0 */}
              {[0.2, 0.5, 1.0, 1.5, 2.0].map(tick => (
                <g key={tick} transform={`translate(${mapX(tick)}, ${svgHeight - padding})`}>
                  <line y2="6" stroke="#475569" strokeWidth="1.5" />
                  <text y="20" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    {tick}x
                  </text>
                </g>
              ))}

              {/* Tick Marks for Growth: 0%, 20%, 40%, 60%, 80%, 100% */}
              {[0, 20, 40, 60, 80, 100].map(tick => (
                <g key={tick} transform={`translate(${padding}, ${mapY(tick)})`}>
                  <line x2="-6" stroke="#475569" strokeWidth="1.5" />
                  <text x="-12" y="4" textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    {tick}%
                  </text>
                </g>
              ))}

              {/* Animated Company Bubbles */}
              {bcgMetrics.map((firm) => {
                const cx = mapX(firm.relativeMarketShare);
                const cy = mapY(firm.effectiveGrowthRate);
                // Bubble radius proportional to sqrt(revenue)
                const radius = Math.max(18, Math.min(42, Math.sqrt(firm.revenue) * 0.48));
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
                    {/* Pulsing Selection Ring */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={radius + 8}
                        fill="none"
                        stroke={firm.color}
                        strokeWidth="2.5"
                        strokeDasharray="4 3"
                        className="animate-spin-slow opacity-90"
                      />
                    )}

                    {/* Outer Glow on hover */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius + 5}
                      fill={firm.color}
                      opacity={isHovered ? 0.35 : 0.15}
                      className="transition-all duration-300"
                    />

                    {/* Core Bubble */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill={firm.color}
                      opacity={0.92}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 2.5 : 1}
                      className="transition-all duration-300 group-hover:scale-105"
                    />

                    {/* Bubble Label inside */}
                    <text
                      cx={cx}
                      cy={cy}
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      fill="#06070c"
                      fontSize="11"
                      fontFamily="Space Grotesk, sans-serif"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {firm.name.split(' ')[0]}
                    </text>

                    {/* Revenue Tag */}
                    <text
                      x={cx}
                      y={cy + radius + 16}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      ₹{firm.revenue}Cr ({firm.relativeMarketShare}x)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-4 border-t border-slate-800">
            <span>Tip: Click any bubble to inspect position & strategic prescription.</span>
            <span>Thresholds: RMS 1.0x | Growth 20%</span>
          </div>
        </div>

        {/* Right 4 Cols: Selected Firm BCG Card & Strategic Action */}
        <div className="lg:col-span-4">
          {(() => {
            const activeFirmBCG = bcgMetrics.find(f => f.id === selectedCompanyId) || bcgMetrics[0];
            const p = activeFirmBCG.prescription;

            return (
              <SpotlightCard
                spotlightColor="rgba(139, 92, 246, 0.25)"
                className="p-6 border border-slate-800 bg-dark-900/90 rounded-2xl h-full flex flex-col justify-between shadow-2xl space-y-6"
              >
                <div className="space-y-5">
                  
                  {/* Firm Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase text-slate-400 block mb-0.5">BCG Position</span>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: activeFirmBCG.color }} />
                        {activeFirmBCG.name}
                      </h3>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border ${
                      activeFirmBCG.quadrant === 'Stars' ? 'bg-violet-500/20 text-violet-300 border-violet-500/40' :
                      activeFirmBCG.quadrant === 'Cash Cows' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                      activeFirmBCG.quadrant === 'Question Marks' ? 'bg-pink-500/20 text-pink-300 border-pink-500/40' :
                      'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {activeFirmBCG.quadrant}
                    </div>
                  </div>

                  {/* Quantitative Coordinates */}
                  <div className="grid grid-cols-2 gap-3.5 p-4 rounded-xl bg-dark-950 border border-slate-800">
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-mono">Relative Market Share</div>
                      <div className="text-xl font-bold font-mono text-white mt-0.5">
                        <CountUp to={activeFirmBCG.relativeMarketShare} decimals={2} suffix="x" />
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {activeFirmBCG.relativeMarketShare >= 1.0 ? "Market Leader" : "Market Challenger"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 uppercase font-mono">Effective Growth</div>
                      <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                        <CountUp to={activeFirmBCG.effectiveGrowthRate} decimals={1} prefix="+" suffix="%" />
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {activeFirmBCG.effectiveGrowthRate >= 20 ? "High Growth Market" : "Mature Market"}
                      </div>
                    </div>
                  </div>

                  {/* Prescribed Strategic Action */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase font-mono text-violet-400 tracking-wider">
                      Prescribed Strategic Action
                    </div>
                    <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-950/20 space-y-1.5">
                      <div className="text-base font-bold text-white">{p.action}</div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{p.recommendation}</p>
                    </div>
                  </div>

                  {/* Cash Flow Dynamics */}
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between border-b border-slate-800 py-1.5">
                      <span className="text-slate-400">Cash Flow Dynamics:</span>
                      <span className="font-mono text-white font-medium">{p.cashFlow}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 py-1.5">
                      <span className="text-slate-400">POSDCORB Priority:</span>
                      <span className="font-mono text-cyan-400 font-medium">{p.posdcorbPriority}</span>
                    </div>
                  </div>

                </div>

                {/* Footer Link */}
                <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Henderson Experience Curve</span>
                  <button
                    onClick={() => {
                      const all = useSimStore.getState();
                      all.setActiveTab('recommender');
                    }}
                    className="text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Full Recommender</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </SpotlightCard>
            );
          })()}
        </div>

      </div>

    </div>
  );
}
