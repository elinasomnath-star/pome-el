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
  // X: Relative Market Share on Log scale from 0.1 to 2.8
  // Log10(0.11) = -0.95, Log10(1.0) = 0.0, Log10(2.8) = ~0.45
  const svgWidth = 820;
  const svgHeight = 530;
  const paddingLeft = 85;
  const paddingRight = 55;
  const paddingTop = 50;
  const paddingBottom = 75;

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
    // Invert Y because SVG origin is top-left
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

  // Group companies by quadrant for the executive summary strip
  const starsFirms = bcgMetrics.filter(f => f.quadrant === 'Stars');
  const qmFirms = bcgMetrics.filter(f => f.quadrant === 'Question Marks');
  const dogsFirms = bcgMetrics.filter(f => f.quadrant === 'Dogs');
  const cowsFirms = bcgMetrics.filter(f => f.quadrant === 'Cash Cows');

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-20">
      
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

      {/* Executive 4-Quadrant Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Stars */}
        <div className="p-3 rounded-xl bg-violet-950/25 border border-violet-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-violet-300 flex items-center gap-1">
              ★ STARS
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-200">
              {starsFirms.length}
            </span>
          </div>
          <div className="text-xs text-slate-200 font-medium truncate">
            {starsFirms.length > 0 ? starsFirms.map(f => f.name.split(' ')[0]).join(', ') : 'None currently'}
          </div>
          <div className="text-[10px] text-slate-400">High Share &bull; High Growth</div>
        </div>

        {/* Question Marks */}
        <div className="p-3 rounded-xl bg-pink-950/25 border border-pink-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-pink-300 flex items-center gap-1">
              ? QUESTION MARKS
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-200">
              {qmFirms.length}
            </span>
          </div>
          <div className="text-xs text-slate-200 font-medium truncate">
            {qmFirms.length > 0 ? qmFirms.map(f => f.name.split(' ')[0]).join(', ') : 'None currently'}
          </div>
          <div className="text-[10px] text-slate-400">Low Share &bull; High Growth</div>
        </div>

        {/* Dogs */}
        <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-amber-300 flex items-center gap-1">
              ▲ DOGS
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200">
              {dogsFirms.length}
            </span>
          </div>
          <div className="text-xs text-slate-200 font-medium truncate">
            {dogsFirms.length > 0 ? dogsFirms.map(f => f.name.split(' ')[0]).join(', ') : 'None currently'}
          </div>
          <div className="text-[10px] text-slate-400">Low Share &bull; Low Growth</div>
        </div>

        {/* Cash Cows */}
        <div className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-emerald-300 flex items-center gap-1">
              $ CASH COWS
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-200">
              {cowsFirms.length}
            </span>
          </div>
          <div className="text-xs text-slate-200 font-medium truncate">
            {cowsFirms.length > 0 ? cowsFirms.map(f => f.name.split(' ')[0]).join(', ') : 'Mature Phase'}
          </div>
          <div className="text-[10px] text-slate-400">High Share &bull; Low Growth</div>
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

              {/* Elegant Watermark Quadrant Titles (Never collide with lines or bubbles) */}
              {/* Top-Left: Question Marks Watermark */}
              <g transform={`translate(${paddingLeft + 24}, ${paddingTop + 28})`}>
                <text fill="#ec4899" fillOpacity="0.45" fontSize="12" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" letterSpacing="0.5">
                  ? QUESTION MARKS
                </text>
                <text y="14" fill="#64748b" fillOpacity="0.8" fontSize="9.5" fontFamily="system-ui, -apple-system, sans-serif">
                  High Growth &bull; Low Share &bull; Build scale or divest
                </text>
              </g>

              {/* Top-Right: Stars Watermark */}
              <g transform={`translate(${thresholdX + 24}, ${paddingTop + 28})`}>
                <text fill="#c084fc" fillOpacity="0.55" fontSize="12" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" letterSpacing="0.5">
                  ★ STARS
                </text>
                <text y="14" fill="#64748b" fillOpacity="0.8" fontSize="9.5" fontFamily="system-ui, -apple-system, sans-serif">
                  High Growth &bull; High Share &bull; Reinvest to hold lead
                </text>
              </g>

              {/* Bottom-Left: Dogs Watermark */}
              <g transform={`translate(${paddingLeft + 24}, ${thresholdY + 28})`}>
                <text fill="#fbbf24" fillOpacity="0.45" fontSize="12" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" letterSpacing="0.5">
                  ▲ DOGS
                </text>
                <text y="14" fill="#64748b" fillOpacity="0.8" fontSize="9.5" fontFamily="system-ui, -apple-system, sans-serif">
                  Low Growth &bull; Low Share &bull; Harvest cash or pivot
                </text>
              </g>

              {/* Bottom-Right: Cash Cows Watermark */}
              <g transform={`translate(${thresholdX + 24}, ${thresholdY + 28})`}>
                <text fill="#34d399" fillOpacity="0.5" fontSize="12" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" letterSpacing="0.5">
                  $ CASH COWS
                </text>
                <text y="14" fill="#64748b" fillOpacity="0.8" fontSize="9.5" fontFamily="system-ui, -apple-system, sans-serif">
                  Low Growth &bull; High Share &bull; Milk margins to fund stars
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

              {/* Threshold Lines (Dashed neon with non-overlapping badges) */}
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
              <g transform={`translate(${thresholdX}, ${paddingTop - 12})`}>
                <rect x="-44" y="0" width="88" height="18" rx="9" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1" />
                <text x="0" y="12.5" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="monospace" fontWeight="bold">
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
                strokeDasharray="5 5"
                strokeOpacity="0.85"
              />
              <g transform={`translate(${svgWidth - paddingRight - 84}, ${thresholdY - 9})`}>
                <rect x="0" y="0" width="80" height="18" rx="9" fill="#083344" stroke="#06b6d4" strokeWidth="1" />
                <text x="40" y="12.5" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  Growth 20%
                </text>
              </g>

              {/* Axis Labels */}
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
                const radius = Math.max(24, Math.min(48, Math.sqrt(firm.revenue) * 0.54));
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

                    {/* Company Vector Brand Icon inside the Bubble */}
                    <foreignObject
                      x={cx - 14}
                      y={cy - 14}
                      width="28"
                      height="28"
                      className="pointer-events-none select-none"
                    >
                      <CompanyBrandIcon id={firm.id} className="w-7 h-7" showBg={false} />
                    </foreignObject>

                    {/* Floating Revenue Tag with Pill Background */}
                    <g transform={`translate(${cx}, ${cy + radius + 10})`}>
                      <rect
                        x="-58"
                        y="0"
                        width="116"
                        height="20"
                        rx="10"
                        fill="#0b0e17"
                        stroke={firm.color}
                        strokeWidth="1.2"
                        opacity="0.95"
                      />
                      <text
                        x="0"
                        y="13.5"
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="9.5"
                        fontFamily="monospace"
                        fontWeight="700"
                      >
                        {firm.name.split(' ')[0]} • ₹{firm.revenue}Cr
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
