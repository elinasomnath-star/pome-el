import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import CompanyBrandIcon from '../common/CompanyBrandIcon';
import {
  Network,
  Users,
  GitBranch,
  Settings,
  Scale,
  Building,
  Crown,
  Shield,
  MapPin,
  Boxes,
  Bike,
  Info,
  ChevronRight,
  ArrowDown,
  Layers,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';

export default function OrgDesignView() {
  const {
    orgConfig,
    setOrgConfig,
    orgMetrics,
    selectedCompanyId,
    baselineCompanies
  } = useSimStore();

  const [viewMode, setViewMode] = useState('scalar'); // 'scalar' | 'tree'
  const [selectedTier, setSelectedTier] = useState(null);

  const company = baselineCompanies.find(c => c.id === selectedCompanyId) || baselineCompanies[0];

  const layerDefinitions = [
    {
      level: 1,
      title: "Executive Committee (C-Suite)",
      role: "Strategic Vision & Capital Allocation",
      icon: Crown,
      accent: "#8b5cf6",
      mandate: "Directs parent balance-sheet capital, sets GMV growth targets, and negotiates FMCG national supplier contracts.",
      decisionScope: "National Strategy, M&A, Dark Store Capex",
      baseUnits: 1
    },
    {
      level: 2,
      title: "VP / Functional Leadership",
      role: "Supply Chain, Technology & Infrastructure",
      icon: Shield,
      accent: "#06b6d4",
      mandate: "Oversees warehouse automation, algorithm dispatch routing, and Tier-1 category merchandising.",
      decisionScope: "Algorithmic Pricing, Regional Supply Chain",
      baseUnits: orgConfig.spanOfControl
    },
    {
      level: 3,
      title: "Regional & City Directors",
      role: "City P&L, Real Estate Catchments & Expansion",
      icon: Building,
      accent: "#10b981",
      mandate: "Secures dark store leases (3,000 sq ft nodes), manages local regulatory compliances, and tracks city EBITDA.",
      decisionScope: "Catchment Selection, Local Vendor Onboarding",
      baseUnits: Math.min(orgConfig.headcount, Math.pow(orgConfig.spanOfControl, 2))
    },
    {
      level: 4,
      title: "Cluster Hub Operations",
      role: "Dark Store Network Health & SLA Adherence",
      icon: MapPin,
      accent: "#f59e0b",
      mandate: "Monitors 5-8 dark stores per cluster, tracks order density, and manages rider shift scheduling.",
      decisionScope: "Surge Fee Multipliers, Store Fleet Allocation",
      baseUnits: Math.min(orgConfig.headcount, Math.pow(orgConfig.spanOfControl, 3))
    },
    {
      level: 5,
      title: "Store Leads & Inwarding Supervisors",
      role: "Pick-and-Pack Speed & Inventory Auditing",
      icon: Boxes,
      accent: "#ec4899",
      mandate: "Enforces sub-180 second picker SLA, minimizes inventory shrinkage, and manages cold-chain storage.",
      decisionScope: "Real-time Stockout Substitution, Picker Shifts",
      baseUnits: Math.min(orgConfig.headcount, Math.pow(orgConfig.spanOfControl, 4))
    },
    {
      level: 6,
      title: "Field Operations & Gig Delivery Fleet",
      role: "10-Minute Last-Mile Fulfillment",
      icon: Bike,
      accent: "#38bdf8",
      mandate: "Executes 10-minute order deliveries, handles customer handoff, and navigates hyper-local traffic catchments.",
      decisionScope: "Dynamic Route Navigation, Order Handoff",
      baseUnits: orgConfig.headcount
    }
  ];

  // Active tiers up to calculated managementLayers (max 6)
  const totalLayers = Math.min(6, Math.max(2, orgMetrics.managementLayers));
  const activeTiers = layerDefinitions.slice(0, totalLayers);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      
      {/* Title & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
                  Organizational Architecture & Scalar Modeler
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Gulick &bull; Fayol &bull; Burns & Stalker
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 font-sans">
                Model management tiers with Fayol's Scalar Chain: <span className="font-mono text-cyan-300 font-bold">L = ⌈log<sub>S</sub>(N)⌉</span> and Burns & Stalker mechanistic friction.
              </p>
            </div>
          </div>
        </div>

        {/* Company & Archetype Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-800 border border-slate-700">
            <CompanyBrandIcon id={company.id} className="w-5 h-5" showBg={false} />
            <span className="text-xs text-white font-bold">{company.name}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-dark-800 border border-slate-700 text-xs font-mono shadow-sm">
            <span className="text-slate-400">Archetype: </span>
            <strong className={`font-bold ml-1 ${
              orgMetrics.mechanisticScore >= 65 ? 'text-rose-400' :
              orgMetrics.mechanisticScore <= 45 ? 'text-emerald-400' : 'text-cyan-400'
            }`}>
              {orgMetrics.orgType}
            </strong>
          </div>
        </div>
      </div>

      {/* KPI Cards - Generous padding & clear math formulas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.2)" className="p-5 border border-slate-800 bg-dark-900/90 rounded-2xl">
          <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Management Layers (Scalar Chain)</span>
          <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1.5">
            <CountUp to={orgMetrics.managementLayers} />
            <span className="text-sm font-normal text-slate-400">Tiers</span>
          </div>
          <div className="text-xs text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            L = ⌈log<sub>{orgConfig.spanOfControl}</sub>({orgConfig.headcount.toLocaleString()})⌉ = {orgMetrics.continuousLayers}
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(6, 182, 212, 0.2)" className="p-5 border border-slate-800 bg-dark-900/90 rounded-2xl">
          <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Coordination Cost Index (CCI)</span>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono">
            <CountUp to={orgMetrics.coordinationCostIndex} decimals={1} />
          </div>
          <div className="text-xs text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            CCI = N &middot; L &middot; (Cent/100) &middot; (1 + Form/10) &middot; 10⁻³
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.2)" className="p-5 border border-slate-800 bg-dark-900/90 rounded-2xl">
          <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Mechanistic vs Organic Score</span>
          <div className="text-3xl font-extrabold text-pink-400 font-mono">
            <CountUp to={orgMetrics.mechanisticScore} suffix="/100" />
          </div>
          <div className="text-xs text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            {orgMetrics.mechanisticScore >= 65 ? "Bureaucratic (Weber)" : orgMetrics.mechanisticScore <= 45 ? "Agile Network (Burns)" : "Matrix Hybrid"}
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.2)" className="p-5 border border-slate-800 bg-dark-900/90 rounded-2xl">
          <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Communication Velocity</span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            <CountUp to={orgMetrics.communicationVelocity} decimals={1} suffix=" / 10" />
          </div>
          <div className="text-xs text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            Scalar chain signal transmission speed
          </div>
        </SpotlightCard>

      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 5 Cols: Sliders & Controls */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-dark-900/90 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-base font-bold text-white font-sans">
              <Settings className="w-5 h-5 text-violet-400" />
              <span>Structural Parameters</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Interactive Tuner</span>
          </div>

          {/* Headcount */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">Enterprise Headcount (N):</span>
              <strong className="text-white text-sm">{orgConfig.headcount.toLocaleString()} staff</strong>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="100"
              value={orgConfig.headcount}
              onChange={(e) => setOrgConfig('headcount', Number(e.target.value))}
              className="w-full h-2.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>500 (Early Startup)</span>
              <span>10,000 (National Dark-Store Fleet)</span>
            </div>
          </div>

          {/* Span of Control */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">Span of Control (S):</span>
              <strong className="text-emerald-400 text-sm">{orgConfig.spanOfControl} direct reports</strong>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={orgConfig.spanOfControl}
              onChange={(e) => setOrgConfig('spanOfControl', Number(e.target.value))}
              className="w-full h-2.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>3 (Tall / Tight Oversight)</span>
              <span>15 (Flat / High Autonomy)</span>
            </div>
          </div>

          {/* Centralization */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">Centralization Degree:</span>
              <strong className="text-cyan-400 text-sm">{orgConfig.centralizationPercent}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              step="5"
              value={orgConfig.centralizationPercent}
              onChange={(e) => setOrgConfig('centralizationPercent', Number(e.target.value))}
              className="w-full h-2.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>10% (Empowered Store Leads)</span>
              <span>95% (HQ Authoritarian Command)</span>
            </div>
          </div>

          {/* Formalization */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">Formalization (SOPs):</span>
              <strong className="text-pink-400 text-sm">{orgConfig.formalizationLevel} / 10</strong>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={orgConfig.formalizationLevel}
              onChange={(e) => setOrgConfig('formalizationLevel', Number(e.target.value))}
              className="w-full h-2.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>1.0 (Ad-hoc Flexibility)</span>
              <span>10.0 (Strict 10-Min SLAs & SOPs)</span>
            </div>
          </div>

          {/* Academic Synthesis Box */}
          <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 font-mono uppercase">
              <Info className="w-3.5 h-3.5" />
              <span>Fayol vs Burns & Stalker Insight</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Henri Fayol's <strong>Scalar Chain</strong> dictates that authority runs unbroken from apex to base. As span of control shrinks, tiers multiply: communication latency grows by <strong>{((totalLayers - 2) * 18)}%</strong>, degrading store-level operational response.
            </p>
          </div>
        </div>

        {/* Right 7 Cols: Stunning Redesigned Topology Visualizer */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-dark-900/90 p-6 shadow-xl space-y-6">
          
          {/* View Mode Switcher Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-sans">
                  Hierarchical Scalar Chain Architecture
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                {totalLayers} Operational Command Tiers &bull; {orgConfig.spanOfControl}:1 Average Branching Factor
              </p>
            </div>

            {/* View Mode Switcher Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-dark-950 border border-slate-800 text-xs font-mono self-start sm:self-auto">
              <button
                onClick={() => setViewMode('scalar')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'scalar' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Scalar Chain Flow
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'tree' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Topological Map
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: SCALAR CHAIN FLOW (Clean, readable, never clipped by dock) */}
          {viewMode === 'scalar' && (
            <div className="space-y-3.5">
              {activeTiers.map((tier, idx) => {
                const Icon = tier.icon;
                const isSelected = selectedTier === tier.level;
                const latencyMs = Math.round(tier.level * 14 + orgConfig.centralizationPercent * 0.22);
                const fidelityPercent = Math.max(38, 100 - (tier.level - 1) * 16);
                const isLast = idx === activeTiers.length - 1;

                return (
                  <React.Fragment key={tier.level}>
                    <div
                      onClick={() => setSelectedTier(isSelected ? null : tier.level)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-dark-800 border-emerald-500 shadow-lg ring-1 ring-emerald-500/40'
                          : 'bg-dark-950/70 border-slate-800 hover:border-slate-700 hover:bg-dark-850'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                            style={{
                              backgroundColor: `${tier.accent}15`,
                              borderColor: `${tier.accent}40`,
                              color: tier.accent
                            }}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">
                                Tier {tier.level} of {totalLayers}
                              </span>
                              <span
                                className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border"
                                style={{
                                  backgroundColor: `${tier.accent}10`,
                                  borderColor: `${tier.accent}30`,
                                  color: tier.accent
                                }}
                              >
                                {tier.role}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white font-sans mt-0.5">
                              {tier.level === 1 ? `${company.name} HQ (${tier.title})` : tier.title}
                            </h4>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono font-bold text-slate-200">
                            {tier.level === 1 ? '1 Apex Unit' : `~${Math.min(orgConfig.headcount, Math.pow(orgConfig.spanOfControl, tier.level - 1))} Units`}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            Span: {tier.level === 1 ? 'Apex' : `1:${orgConfig.spanOfControl}`}
                          </div>
                        </div>
                      </div>

                      {/* Mandate Description */}
                      <p className="text-xs text-slate-300 font-sans mt-2.5 leading-relaxed">
                        {tier.mandate}
                      </p>

                      {/* Expanded Details when Clicked */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs font-mono">
                          <div className="p-2.5 rounded-lg bg-dark-900 border border-slate-800">
                            <span className="text-slate-400 block text-[10px] uppercase">Decision Scope:</span>
                            <span className="text-emerald-400 font-bold">{tier.decisionScope}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-dark-900 border border-slate-800">
                            <span className="text-slate-400 block text-[10px] uppercase">Scalar Transmission:</span>
                            <span className="text-cyan-400 font-bold">{latencyMs} ms &bull; {fidelityPercent}% Fidelity</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Scalar Conduit Connector between tiers */}
                    {!isLast && (
                      <div className="flex items-center justify-center my-1">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-dark-950 border border-slate-800 text-[10px] font-mono text-slate-400 shadow-sm">
                          <ArrowDown className="w-3 h-3 text-emerald-400 animate-bounce" />
                          <span>Fayol Scalar Conduit &bull; ~{latencyMs}ms latency &bull; {fidelityPercent}% signal fidelity</span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 2: TOPOLOGICAL MAP (SVG Canvas bounded, zero dock collision) */}
          {viewMode === 'tree' && (
            <div className="w-full overflow-hidden rounded-xl bg-dark-950 p-4 border border-slate-800 flex flex-col items-center">
              <svg viewBox="0 0 720 340" className="w-full h-auto select-none">
                {/* SVG Bezier Connection Links */}
                {/* Apex to Level 2 Links */}
                {totalLayers >= 2 && (
                  <>
                    <path d="M 360 60 C 360 95, 180 95, 180 130" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 3" opacity="0.7" />
                    <path d="M 360 60 C 360 95, 360 95, 360 130" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 3" opacity="0.7" />
                    <path d="M 360 60 C 360 95, 540 95, 540 130" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 3" opacity="0.7" />
                  </>
                )}

                {/* Level 2 to Level 3 Links */}
                {totalLayers >= 3 && (
                  <>
                    <path d="M 180 165 C 180 195, 120 195, 120 225" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                    <path d="M 180 165 C 180 195, 240 195, 240 225" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                    <path d="M 360 165 C 360 195, 360 195, 360 225" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                    <path d="M 540 165 C 540 195, 480 195, 480 225" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                    <path d="M 540 165 C 540 195, 600 195, 600 225" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  </>
                )}

                {/* Level 3 to Level 4 Links */}
                {totalLayers >= 4 && (
                  <>
                    <path d="M 120 255 C 120 280, 80 280, 80 300" fill="none" stroke="#10b981" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.5" />
                    <path d="M 120 255 C 120 280, 160 280, 160 300" fill="none" stroke="#10b981" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.5" />
                    <path d="M 360 255 C 360 280, 320 280, 320 300" fill="none" stroke="#10b981" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.5" />
                    <path d="M 360 255 C 360 280, 400 280, 400 300" fill="none" stroke="#10b981" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.5" />
                    <path d="M 600 255 C 600 280, 560 280, 560 300" fill="none" stroke="#10b981" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.5" />
                    <path d="M 600 255 C 600 280, 640 280, 640 300" fill="none" stroke="#10b981" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.5" />
                  </>
                )}

                {/* Level 1 Node: Apex */}
                <g transform="translate(260, 25)">
                  <rect width="200" height="42" rx="10" fill="#2e1065" stroke="#8b5cf6" strokeWidth="1.5" />
                  <text x="100" y="20" textAnchor="middle" fill="#ffffff" fontSize="12" fontFamily="system-ui, sans-serif" fontWeight="700">
                    👑 {company.name} HQ
                  </text>
                  <text x="100" y="34" textAnchor="middle" fill="#c084fc" fontSize="9.5" fontFamily="monospace">
                    Tier 1: Executive C-Suite
                  </text>
                </g>

                {/* Level 2 Nodes: VPs */}
                {totalLayers >= 2 && (
                  <>
                    <g transform="translate(85, 125)">
                      <rect width="190" height="38" rx="8" fill="#083344" stroke="#06b6d4" strokeWidth="1.2" />
                      <text x="95" y="18" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="600">
                        🛡️ VP Supply Chain
                      </text>
                      <text x="95" y="30" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="monospace">
                        Tier 2 &bull; Dark Store Ops
                      </text>
                    </g>
                    <g transform="translate(285, 125)">
                      <rect width="150" height="38" rx="8" fill="#083344" stroke="#06b6d4" strokeWidth="1.2" />
                      <text x="75" y="18" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="600">
                        🛡️ VP Tech Platform
                      </text>
                      <text x="75" y="30" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="monospace">
                        Tier 2 &bull; Algorithms
                      </text>
                    </g>
                    <g transform="translate(445, 125)">
                      <rect width="190" height="38" rx="8" fill="#083344" stroke="#06b6d4" strokeWidth="1.2" />
                      <text x="95" y="18" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="600">
                        🛡️ VP Growth & Brand
                      </text>
                      <text x="95" y="30" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="monospace">
                        Tier 2 &bull; Merchandising
                      </text>
                    </g>
                  </>
                )}

                {/* Level 3 Nodes: Regional Directors */}
                {totalLayers >= 3 && (
                  <>
                    <g transform="translate(40, 220)">
                      <rect width="160" height="34" rx="7" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                      <text x="80" y="17" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontFamily="system-ui, sans-serif" fontWeight="600">
                        🏢 City Director (North)
                      </text>
                      <text x="80" y="28" textAnchor="middle" fill="#6ee7b7" fontSize="8.5" fontFamily="monospace">
                        NCR &bull; 140+ Stores
                      </text>
                    </g>
                    <g transform="translate(280, 220)">
                      <rect width="160" height="34" rx="7" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                      <text x="80" y="17" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontFamily="system-ui, sans-serif" fontWeight="600">
                        🏢 City Director (West)
                      </text>
                      <text x="80" y="28" textAnchor="middle" fill="#6ee7b7" fontSize="8.5" fontFamily="monospace">
                        Mumbai &bull; 120+ Stores
                      </text>
                    </g>
                    <g transform="translate(520, 220)">
                      <rect width="160" height="34" rx="7" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                      <text x="80" y="17" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontFamily="system-ui, sans-serif" fontWeight="600">
                        🏢 City Director (South)
                      </text>
                      <text x="80" y="28" textAnchor="middle" fill="#6ee7b7" fontSize="8.5" fontFamily="monospace">
                        Bengaluru &bull; 110+ Stores
                      </text>
                    </g>
                  </>
                )}

                {/* Level 4 Leaf Nodes: Cluster Hubs & Fleets */}
                {totalLayers >= 4 && (
                  <>
                    <g transform="translate(25, 295)">
                      <rect width="110" height="28" rx="6" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1" />
                      <text x="55" y="18" textAnchor="middle" fill="#fde68a" fontSize="9.5" fontFamily="monospace">
                        📍 Hub #1..{orgConfig.spanOfControl}
                      </text>
                    </g>
                    <g transform="translate(145, 295)">
                      <rect width="110" height="28" rx="6" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1" />
                      <text x="55" y="18" textAnchor="middle" fill="#fde68a" fontSize="9.5" fontFamily="monospace">
                        📍 Hub #{orgConfig.spanOfControl + 1}..{orgConfig.spanOfControl * 2}
                      </text>
                    </g>
                    <g transform="translate(305, 295)">
                      <rect width="110" height="28" rx="6" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1" />
                      <text x="55" y="18" textAnchor="middle" fill="#fde68a" fontSize="9.5" fontFamily="monospace">
                        📦 Dark Stores
                      </text>
                    </g>
                    <g transform="translate(465, 295)">
                      <rect width="110" height="28" rx="6" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1" />
                      <text x="55" y="18" textAnchor="middle" fill="#fde68a" fontSize="9.5" fontFamily="monospace">
                        📍 Hub Units
                      </text>
                    </g>
                    <g transform="translate(585, 295)">
                      <rect width="115" height="28" rx="6" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1" />
                      <text x="57" y="18" textAnchor="middle" fill="#bae6fd" fontSize="9.5" fontFamily="monospace">
                        🛵 {orgConfig.headcount.toLocaleString()} Riders
                      </text>
                    </g>
                  </>
                )}
              </svg>
            </div>
          )}

          {/* Academic Footer Citation */}
          <div className="pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Burns & Stalker (1961): Mechanistic {orgMetrics.mechanisticScore}% vs Organic {100 - orgMetrics.mechanisticScore}%</span>
            <span className="text-cyan-400">Pure Function: /src/engine/org.js</span>
          </div>

        </div>

      </div>

    </div>
  );
}
