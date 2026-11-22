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
  Info
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
  // X: Relative Market Share on Log scale from 0.1 to 2.5
  // Log10(0.12) = -0.92, Log10(1.0) = 0.0, Log10(2.5) = ~0.4
  const svgWidth = 760;
  const svgHeight = 500;
  const paddingLeft = 75;
  const paddingRight = 45;
  const paddingTop = 45;
  const paddingBottom = 65;

  const minLogRMS = -0.92; // ~0.12x RMS
  const maxLogRMS = 0.45;  // ~2.8x RMS
  const minGrowth = 0;
  const maxGrowth = 100;

  const mapX = (rms) => {
    const safeRms = Math.max(0.12, Math.min(2.8, rms));
    const logVal = Math.log10(safeRms);
    const normalized = (logVal - minLogRMS) / (maxLogRMS - minLogRMS);
    return paddingLeft + normalized * (svgWidth - paddingLeft - paddingRight);
  };

  const mapY = (growth) => {
    const safeGrowth = Math.max(minGrowth, Math.min(maxGrowth, growth));
    // Invert Y because SVG origin is top-left
    const normalized = (safeGrowth - minGrowth) / (maxGrowth - minGrowth);
    return svgHeight - paddingBottom - normalized * (svgHeight - paddingTop - paddingBottom);
  };

  // Threshold markers
  const thresholdX = mapX(1.0);  // 1.0 Relative Market Share
  const thresholdY = mapY(20.0); // 20% Growth Rate

  const activeFirmBCG = bcgMetrics.find(f => f.id === selectedCompanyId) || bcgMetrics[0];
  const p = activeFirmBCG.prescription;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      
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
                X-Axis: Relative Market Share vs #1 Rival (log scale) &bull; Y-Axis: Annual Growth Rate (%) &bull; Bubble Area: FY24 Revenue.
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

      {/* Main BCG Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 8 Cols: Clean SVG Matrix (No colliding text overlays!) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-dark-900/95 p-5 sm:p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between">
          
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[580px] select-none"
            >
              {/* Quadrant Background Zones */}
              {/* Top-Left: Question Marks */}
              <rect
                x={paddingLeft}
                y={paddingTop}
                width={thresholdX - paddingLeft}
                height={thresholdY - paddingTop}
                fill="#ec4899"
                fillOpacity="0.03"
              />
              {/* Top-Right: Stars */}
              <rect
                x={thresholdX}
                y={paddingTop}
                width={svgWidth - paddingRight - thresholdX}
                height={thresholdY - paddingTop}
                fill="#8b5cf6"
                fillOpacity="0.04"
              />
              {/* Bottom-Left: Dogs */}
              <rect
                x={paddingLeft}
                y={thresholdY}
                width={thresholdX - paddingLeft}
                height={svgHeight - paddingBottom - thresholdY}
                fill="#f59e0b"
                fillOpacity="0.03"
              />
              {/* Bottom-Right: Cash Cows */}
              <rect
                x={thresholdX}
                y={thresholdY}
                width={svgWidth - paddingRight - thresholdX}
                height={svgHeight - paddingBottom - thresholdY}
                fill="#10b981"
                fillOpacity="0.03"
              />

              {/* Clean Non-Colliding Quadrant Headers */}
              {/* Question Marks Header */}
              <g transform={`translate(${paddingLeft + 16}, ${paddingTop + 20})`}>
                <text fill="#f472b6" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="700" letterSpacing="0.5">
                  ? QUESTION MARKS (High Growth, Low Share)
                </text>
                <text y="14" fill="#64748b" fontSize="9.5" fontFamily="system-ui, sans-serif">
                  Cash drain; Aggressively build density or divest
                </text>
              </g>

              {/* Stars Header */}
              <g transform={`translate(${svgWidth - paddingRight - 16}, ${paddingTop + 20})`}>
                <text textAnchor="end" fill="#c084fc" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="700" letterSpacing="0.5">
                  ★ STARS (High Growth, High Share)
                </text>
                <text textAnchor="end" y="14" fill="#64748b" fontSize="9.5" fontFamily="system-ui, sans-serif">
                  Self-sustaining; Reinvest cash to defend lead
                </text>
              </g>

              {/* Dogs Header */}
              <g transform={`translate(${paddingLeft + 16}, ${thresholdY + 22})`}>
                <text fill="#fbbf24" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="700" letterSpacing="0.5">
                  ▲ DOGS (Low Growth, Low Share)
                </text>
                <text y="14" fill="#64748b" fontSize="9.5" fontFamily="system-ui, sans-serif">
                  Weak market position; Harvest cash or pivot
                </text>
              </g>

              {/* Cash Cows Header */}
              <g transform={`translate(${svgWidth - paddingRight - 16}, ${thresholdY + 22})`}>
                <text textAnchor="end" fill="#34d399" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="700" letterSpacing="0.5">
                  $ CASH COWS (Low Growth, High Share)
                </text>
                <text textAnchor="end" y="14" fill="#64748b" fontSize="9.5" fontFamily="system-ui, sans-serif">
                  High cash flow; Milk margins to fund challengers
                </text>
              </g>

              {/* Grid Lines */}
              <line
                x1={paddingLeft}
                y1={svgHeight - paddingBottom}
                x2={svgWidth - paddingRight}
                y2={svgHeight - paddingBottom}
                stroke="#334155"
                strokeWidth="1.5"
              />
              <line
                x1={paddingLeft}
                y1={paddingTop}
                x2={paddingLeft}
                y2={svgHeight - paddingBottom}
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Threshold Lines (Dashed neon) */}
              {/* RMS = 1.0 vertical threshold */}
              <line
                x1={thresholdX}
                y1={paddingTop}
                x2={thresholdX}
                y2={svgHeight - paddingBottom}
                stroke="#8b5cf6"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                strokeOpacity="0.85"
              />
              <text
                x={thresholdX + 8}
                y={paddingTop + 48}
                fill="#a78bfa"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                RMS Threshold = 1.0x
              </text>

              {/* Growth = 20% horizontal threshold */}
              <line
                x1={paddingLeft}
                y1={thresholdY}
                x2={svgWidth - paddingRight}
                y2={thresholdY}
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                strokeOpacity="0.85"
              />
              <text
                x={svgWidth - paddingRight - 150}
                y={thresholdY - 10}
                fill="#38bdf8"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Growth Threshold = 20%
              </text>

              {/* Axis Labels */}
              <text
                x={(paddingLeft + svgWidth - paddingRight) / 2}
                y={svgHeight - 12}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="11"
                fontFamily="system-ui, sans-serif"
                fontWeight="600"
              >
                Relative Market Share (log scale vs #1 Rival) →
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

              {/* Tick Marks for RMS: 0.2, 0.5, 1.0, 1.5, 2.0 */}
              {[0.2, 0.5, 1.0, 1.5, 2.0].map(tick => (
                <g key={tick} transform={`translate(${mapX(tick)}, ${svgHeight - paddingBottom})`}>
                  <line y2="6" stroke="#475569" strokeWidth="1.5" />
                  <text y="20" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    {tick}x
                  </text>
                </g>
              ))}

              {/* Tick Marks for Growth: 0%, 20%, 40%, 60%, 80%, 100% */}
              {[0, 20, 40, 60, 80, 100].map(tick => (
                <g key={tick} transform={`translate(${paddingLeft}, ${mapY(tick)})`}>
                  <line x2="-6" stroke="#475569" strokeWidth="1.5" />
                  <text x="-12" y="3.5" textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    {tick}%
                  </text>
                </g>
              ))}

              {/* Company Bubbles */}
              {bcgMetrics.map((firm) => {
                const cx = mapX(firm.relativeMarketShare);
                const cy = mapY(firm.effectiveGrowthRate);
                // Bubble radius proportional to sqrt(revenue)
                const radius = Math.max(22, Math.min(46, Math.sqrt(firm.revenue) * 0.52));
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

                    {/* Outer Glow */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius + 4}
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
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="transition-all duration-300 group-hover:scale-105"
                    />

                    {/* Company Name inside bubble */}
                    <text
                      cx={cx}
                      cy={cy}
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      fill="#06070c"
                      fontSize="11"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      fontWeight="800"
                      className="pointer-events-none select-none"
                    >
                      {firm.name.split(' ')[0]}
                    </text>

                    {/* Floating Revenue Tag with Pill Background */}
                    <g transform={`translate(${cx}, ${cy + radius + 8})`}>
                      <rect
                        x="-48"
                        y="0"
                        width="96"
                        height="18"
                        rx="9"
                        fill="#0b0e17"
                        stroke={firm.color}
                        strokeWidth="1"
                        opacity="0.95"
                      />
                      <text
                        x="0"
                        y="12"
                        textAnchor="middle"
                        fill="#e2e8f0"
                        fontSize="9.5"
                        fontFamily="monospace"
                        fontWeight="600"
                      >
                        ₹{firm.revenue}Cr ({firm.relativeMarketShare}x)
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

        {/* Right 4 Cols: Selected Firm BCG Card with CompanyBrandIcon */}
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
