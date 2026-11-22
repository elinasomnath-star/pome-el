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
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-52">
      
      {/* Title & Header - De-cramped with Generous Breathing Room */}
      <div className="space-y-3 pb-5 border-b border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <p className="text-sm text-slate-400 mt-1 font-sans">
                Model management tiers with Fayol's Scalar Chain: <span className="font-mono text-cyan-300 font-bold">L = ⌈log<sub>S</sub>(N)⌉</span> and Burns & Stalker mechanistic friction.
              </p>
            </div>
          </div>

          {/* Company & Archetype Badge */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-800 border border-slate-700 shadow-sm">
              <CompanyBrandIcon id={company.id} className="w-5 h-5" showBg={false} />
              <span className="text-xs text-white font-bold">{company.name}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-dark-800 border border-slate-700 text-xs font-mono shadow-sm">
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
          <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Span of Control (S)</span>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono flex items-baseline gap-1.5">
            <CountUp to={orgConfig.spanOfControl} />
            <span className="text-sm font-normal text-slate-400">Reports/Mgr</span>
          </div>
          <div className="text-xs text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            {orgConfig.spanOfControl <= 5 ? "Narrow (High Oversight)" : "Wide (High Autonomy)"}
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(236, 72, 153, 0.2)" className="p-5 border border-slate-800 bg-dark-900/90 rounded-2xl">
          <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Burns & Stalker Index</span>
          <div className="text-3xl font-extrabold text-pink-400 font-mono flex items-baseline gap-1.5">
            <CountUp to={orgMetrics.mechanisticScore} suffix="%" />
          </div>
          <div className="text-xs text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            {orgMetrics.orgType} &bull; {100 - orgMetrics.mechanisticScore}% Organic
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.2)" className="p-5 border border-slate-800 bg-dark-900/90 rounded-2xl">
          <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Coordination Cost Burden</span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono flex items-baseline gap-1.5">
            <CountUp to={orgMetrics.coordinationCostIndex} decimals={1} />
            <span className="text-sm font-normal text-slate-400">Index</span>
          </div>
          <div className="text-xs text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            Cost = f(Headcount, Layers, Centralization)
          </div>
        </SpotlightCard>

      </div>

      {/* Main Structural Architecture Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 5 Cols: Configuration Sliders */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-dark-900/90 p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white font-sans">
              Structural Levers & Contingency Sliders
            </h3>
          </div>

          {/* Headcount */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">Corporate & Field Headcount (N):</span>
              <strong className="text-cyan-400 text-sm">{orgConfig.headcount.toLocaleString()} personnel</strong>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="250"
              value={orgConfig.headcount}
              onChange={(e) => setOrgConfig('headcount', Number(e.target.value))}
              className="w-full h-2.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>500 (Early Startup)</span>
              <span>15,000 (Mature National Enterprise)</span>
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

          {/* VIEW MODE 1: SCALAR CHAIN FLOW */}
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

          {/* VIEW MODE 2: TOPOLOGICAL MAP - 100% Connected, Clean Vector Icons, Zero Hanging Arrows */}
          {viewMode === 'tree' && (
            <div className="w-full overflow-hidden rounded-xl bg-dark-950 p-4 border border-slate-800 flex flex-col items-center">
              <svg viewBox="0 0 760 360" className="w-full h-auto select-none">
                <defs>
                  {/* Subtle Node Shadows */}
                  <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* ================= 100% CONNECTED BEZIER LINKS ================= */}
                
                {/* Level 1 (Apex: x=380, y=64) to Level 2 (x=140, 380, 620, y=115) */}
                <path d="M 380 64 C 380 95, 140 95, 140 115" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 3" opacity="0.8" />
                <path d="M 380 64 L 380 115" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 3" opacity="0.8" />
                <path d="M 380 64 C 380 95, 620 95, 620 115" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 3" opacity="0.8" />

                {/* Level 2 (VPs: y=155) to Level 3 (Directors: y=205) */}
                <path d="M 140 155 L 140 205" fill="none" stroke="#06b6d4" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.8" />
                <path d="M 380 155 L 380 205" fill="none" stroke="#06b6d4" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.8" />
                <path d="M 620 155 L 620 205" fill="none" stroke="#06b6d4" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.8" />

                {/* Level 3 (Directors: y=243) to Level 4 (Hubs & Fleets: y=295) */}
                {/* North (140, 243) to Hub 1 (75, 295) & Hub 2 (200, 295) */}
                <path d="M 140 243 C 140 270, 75 270, 75 295" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.75" />
                <path d="M 140 243 C 140 270, 200 270, 200 295" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.75" />

                {/* West (380, 243) to Hub 3 (320, 295) & Hub 4 (445, 295) */}
                <path d="M 380 243 C 380 270, 320 270, 320 295" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.75" />
                <path d="M 380 243 C 380 270, 445 270, 445 295" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.75" />

                {/* South (620, 243) to Hub 5 (565, 295) & Rider Fleet (690, 295) */}
                <path d="M 620 243 C 620 270, 565 270, 565 295" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.75" />
                <path d="M 620 243 C 620 270, 690 270, 690 295" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />


                {/* ================= CLEAN PROFESSIONAL NODES (ZERO EMOJIS) ================= */}

                {/* LEVEL 1: APEX (C-SUITE) */}
                <g transform="translate(270, 20)" filter="url(#nodeGlow)">
                  <rect width="220" height="44" rx="10" fill="#1e1035" stroke="#8b5cf6" strokeWidth="1.8" />
                  {/* Clean SVG Crown Icon */}
                  <path d="M 34 26 L 40 16 L 46 22 L 52 16 L 58 26 Z" fill="#c084fc" />
                  <text x="125" y="21" textAnchor="middle" fill="#ffffff" fontSize="12" fontFamily="system-ui, sans-serif" fontWeight="700">
                    {company.name} HQ
                  </text>
                  <text x="125" y="35" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="monospace">
                    Tier 1: Executive C-Suite
                  </text>
                </g>

                {/* LEVEL 2: FUNCTIONAL LEADERSHIP (VPs) */}
                {/* VP Supply Chain */}
                <g transform="translate(40, 115)" filter="url(#nodeGlow)">
                  <rect width="200" height="40" rx="8" fill="#082f49" stroke="#06b6d4" strokeWidth="1.4" />
                  {/* Clean SVG Shield Icon */}
                  <path d="M 22 17 L 30 14 L 38 17 C 38 24 30 29 30 29 C 30 29 22 24 22 17 Z" fill="none" stroke="#67e8f9" strokeWidth="1.8" />
                  <text x="115" y="20" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="600">
                    VP Supply Chain
                  </text>
                  <text x="115" y="32" textAnchor="middle" fill="#67e8f9" fontSize="8.5" fontFamily="monospace">
                    Tier 2 &bull; Dark Store Ops
                  </text>
                </g>

                {/* VP Technology */}
                <g transform="translate(280, 115)" filter="url(#nodeGlow)">
                  <rect width="200" height="40" rx="8" fill="#082f49" stroke="#06b6d4" strokeWidth="1.4" />
                  {/* Clean SVG Algorithm/Tech Icon */}
                  <rect x="23" y="17" width="12" height="12" rx="2" fill="none" stroke="#67e8f9" strokeWidth="1.8" />
                  <circle cx="29" cy="23" r="2" fill="#67e8f9" />
                  <text x="115" y="20" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="600">
                    VP Tech Platform
                  </text>
                  <text x="115" y="32" textAnchor="middle" fill="#67e8f9" fontSize="8.5" fontFamily="monospace">
                    Tier 2 &bull; Dispatch Algos
                  </text>
                </g>

                {/* VP Growth */}
                <g transform="translate(520, 115)" filter="url(#nodeGlow)">
                  <rect width="200" height="40" rx="8" fill="#082f49" stroke="#06b6d4" strokeWidth="1.4" />
                  {/* Clean SVG Growth Icon */}
                  <path d="M 22 28 L 27 22 L 32 25 L 38 17" fill="none" stroke="#67e8f9" strokeWidth="1.8" strokeLinecap="round" />
                  <text x="115" y="20" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="600">
                    VP Growth & Merch
                  </text>
                  <text x="115" y="32" textAnchor="middle" fill="#67e8f9" fontSize="8.5" fontFamily="monospace">
                    Tier 2 &bull; Merchandising
                  </text>
                </g>

                {/* LEVEL 3: REGIONAL & CITY DIRECTORS */}
                {/* Director North */}
                <g transform="translate(40, 205)" filter="url(#nodeGlow)">
                  <rect width="200" height="38" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.2" />
                  {/* Clean Building Vector */}
                  <path d="M 22 28 V 16 H 32 V 28 Z" fill="none" stroke="#6ee7b7" strokeWidth="1.5" />
                  <rect x="25" y="19" width="2" height="2" fill="#6ee7b7" />
                  <rect x="29" y="19" width="2" height="2" fill="#6ee7b7" />
                  <text x="115" y="19" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontFamily="system-ui, sans-serif" fontWeight="600">
                    City Director (North)
                  </text>
                  <text x="115" y="30" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="monospace">
                    Tier 3 &bull; NCR Catchments (140+ Stores)
                  </text>
                </g>

                {/* Director West */}
                <g transform="translate(280, 205)" filter="url(#nodeGlow)">
                  <rect width="200" height="38" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.2" />
                  {/* Clean Building Vector */}
                  <path d="M 22 28 V 16 H 32 V 28 Z" fill="none" stroke="#6ee7b7" strokeWidth="1.5" />
                  <rect x="25" y="19" width="2" height="2" fill="#6ee7b7" />
                  <rect x="29" y="19" width="2" height="2" fill="#6ee7b7" />
                  <text x="115" y="19" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontFamily="system-ui, sans-serif" fontWeight="600">
                    City Director (West)
                  </text>
                  <text x="115" y="30" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="monospace">
                    Tier 3 &bull; Mumbai MMR (120+ Stores)
                  </text>
                </g>

                {/* Director South */}
                <g transform="translate(520, 205)" filter="url(#nodeGlow)">
                  <rect width="200" height="38" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.2" />
                  {/* Clean Building Vector */}
                  <path d="M 22 28 V 16 H 32 V 28 Z" fill="none" stroke="#6ee7b7" strokeWidth="1.5" />
                  <rect x="25" y="19" width="2" height="2" fill="#6ee7b7" />
                  <rect x="29" y="19" width="2" height="2" fill="#6ee7b7" />
                  <text x="115" y="19" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontFamily="system-ui, sans-serif" fontWeight="600">
                    City Director (South)
                  </text>
                  <text x="115" y="30" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="monospace">
                    Tier 3 &bull; Bengaluru (110+ Stores)
                  </text>
                </g>

                {/* LEVEL 4: CLUSTER HUBS, DARK STORES & RIDER FLEET */}
                {/* North Hub A */}
                <g transform="translate(20, 295)" filter="url(#nodeGlow)">
                  <rect width="110" height="32" rx="6" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.2" />
                  <text x="55" y="15" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="system-ui, sans-serif" fontWeight="600">
                    Cluster Hub 1..6
                  </text>
                  <text x="55" y="25" textAnchor="middle" fill="#fbbf24" fontSize="7.5" fontFamily="monospace">
                    Tier 4 &bull; 6 Dark Stores
                  </text>
                </g>

                {/* North Hub B */}
                <g transform="translate(145, 295)" filter="url(#nodeGlow)">
                  <rect width="110" height="32" rx="6" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.2" />
                  <text x="55" y="15" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="system-ui, sans-serif" fontWeight="600">
                    Cluster Hub 7..12
                  </text>
                  <text x="55" y="25" textAnchor="middle" fill="#fbbf24" fontSize="7.5" fontFamily="monospace">
                    Tier 4 &bull; 6 Dark Stores
                  </text>
                </g>

                {/* West Hub A */}
                <g transform="translate(265, 295)" filter="url(#nodeGlow)">
                  <rect width="110" height="32" rx="6" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.2" />
                  <text x="55" y="15" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="system-ui, sans-serif" fontWeight="600">
                    Cluster Hub 1..6
                  </text>
                  <text x="55" y="25" textAnchor="middle" fill="#fbbf24" fontSize="7.5" fontFamily="monospace">
                    Tier 4 &bull; 6 Dark Stores
                  </text>
                </g>

                {/* West Hub B */}
                <g transform="translate(390, 295)" filter="url(#nodeGlow)">
                  <rect width="110" height="32" rx="6" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.2" />
                  <text x="55" y="15" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="system-ui, sans-serif" fontWeight="600">
                    Cluster Hub 7..12
                  </text>
                  <text x="55" y="25" textAnchor="middle" fill="#fbbf24" fontSize="7.5" fontFamily="monospace">
                    Tier 4 &bull; 6 Dark Stores
                  </text>
                </g>

                {/* South Hub A */}
                <g transform="translate(510, 295)" filter="url(#nodeGlow)">
                  <rect width="110" height="32" rx="6" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.2" />
                  <text x="55" y="15" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="system-ui, sans-serif" fontWeight="600">
                    Cluster Hubs (BLR)
                  </text>
                  <text x="55" y="25" textAnchor="middle" fill="#fbbf24" fontSize="7.5" fontFamily="monospace">
                    Tier 4 &bull; 8 Dark Stores
                  </text>
                </g>

                {/* South Hub B: Gig Delivery Fleet */}
                <g transform="translate(635, 295)" filter="url(#nodeGlow)">
                  <rect width="110" height="32" rx="6" fill="#082f49" stroke="#38bdf8" strokeWidth="1.2" />
                  <text x="55" y="15" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="system-ui, sans-serif" fontWeight="600">
                    Gig Delivery Fleet
                  </text>
                  <text x="55" y="25" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontFamily="monospace">
                    Tier 4 &bull; {orgConfig.headcount.toLocaleString()} Riders
                  </text>
                </g>
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
