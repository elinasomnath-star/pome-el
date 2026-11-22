import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import GradientText from '../reactbits/GradientText';
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
  ChevronRight
} from 'lucide-react';

export default function OrgDesignView() {
  const {
    orgConfig,
    setOrgConfig,
    orgMetrics,
    orgTree,
    selectedCompanyId,
    baselineCompanies
  } = useSimStore();

  const company = baselineCompanies.find(c => c.id === selectedCompanyId) || baselineCompanies[0];

  const nodeIcons = {
    1: Crown,
    2: Shield,
    3: Building,
    4: MapPin,
    5: Boxes,
    6: Bike
  };

  // Render recursive tree node
  const renderTreeNode = (node) => {
    const Icon = nodeIcons[node.level] || Users;

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node Box */}
        <div className={`p-3.5 rounded-xl border text-center transition-all shadow-md min-w-[150px] max-w-[210px] ${
          node.level === 1
            ? 'bg-violet-950/70 border-violet-500/60 text-violet-200 shadow-violet-950/40 ring-1 ring-violet-500/30'
            : node.level === 2
            ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200'
            : node.level === 3
            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
            : 'bg-dark-800 border-slate-700 text-slate-300'
        }`}>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold mb-1">
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{node.name}</span>
          </div>
          <div className="text-xs text-slate-300 leading-snug">{node.title}</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">{node.role}</div>
        </div>

        {/* Children connectors */}
        {node.children && node.children.length > 0 && (
          <div className="flex flex-col items-center w-full mt-3">
            <div className="w-0.5 h-4 bg-slate-700" />
            <div className="flex items-start justify-center gap-6 relative pt-3 border-t border-slate-700">
              {node.children.map(child => renderTreeNode(child))}
              {node.extraHiddenChildren > 0 && (
                <div className="p-2.5 rounded-xl bg-dark-900 border border-slate-800 text-xs font-mono text-slate-400 self-center">
                  +{node.extraHiddenChildren} more units
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
                  Organizational Architecture & What-If Modeler
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Gulick & Urwick &bull; Burns & Stalker
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Tune span of control and centralization to analyze management layers = ⌈log_span(headcount)⌉ and coordination costs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-xs font-mono shadow-sm">
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

      {/* KPI Cards - Spacious with clear metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.2)" className="p-5 border border-slate-800 bg-dark-900/90 rounded-2xl">
          <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Management Layers</span>
          <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1.5">
            <CountUp to={orgMetrics.managementLayers} />
            <span className="text-sm font-normal text-slate-400">tiers</span>
          </div>
          <div className="text-xs text-slate-500 font-mono mt-2 pt-2 border-t border-slate-800/80">
            ⌈log_{orgConfig.spanOfControl}({orgConfig.headcount.toLocaleString()})⌉ = {orgMetrics.continuousLayers}
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(6, 182, 212, 0.2)" className="p-5 border border-slate-800 bg-dark-900/90 rounded-2xl">
          <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Coordination Cost Index</span>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono">
            <CountUp to={orgMetrics.coordinationCostIndex} decimals={1} />
          </div>
          <div className="text-xs text-slate-500 font-mono mt-2 pt-2 border-t border-slate-800/80">
            Scales with tiers & centralization
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.2)" className="p-5 border border-slate-800 bg-dark-900/90 rounded-2xl">
          <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Mechanistic vs Organic</span>
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
          <div className="text-xs text-slate-500 font-mono mt-2 pt-2 border-t border-slate-800/80">
            Scalar chain transmission speed
          </div>
        </SpotlightCard>

      </div>

      {/* Main Grid: Controls + Visual Org Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Sliders */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-dark-900/90 p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-base font-bold text-white border-b border-slate-800 pb-3">
            <Settings className="w-5 h-5 text-violet-400" />
            <span>Structural Decision Parameters</span>
          </div>

          {/* Headcount */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">Total Enterprise Headcount (N):</span>
              <strong className="text-white text-sm">{orgConfig.headcount.toLocaleString()} employees</strong>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="100"
              value={orgConfig.headcount}
              onChange={(e) => setOrgConfig('headcount', e.target.value)}
              className="w-full h-2.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>500 (Early Startup)</span>
              <span>10,000 (Mature Dark-Store Fleet)</span>
            </div>
          </div>

          {/* Span of Control */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">Average Span of Control (S):</span>
              <strong className="text-emerald-400 text-sm">{orgConfig.spanOfControl} direct reports</strong>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={orgConfig.spanOfControl}
              onChange={(e) => setOrgConfig('spanOfControl', e.target.value)}
              className="w-full h-2.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>3 (Tall Structure / Close Oversight)</span>
              <span>15 (Flat Structure / High Autonomy)</span>
            </div>
          </div>

          {/* Centralization */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">Centralization Degree (%):</span>
              <strong className="text-cyan-400 text-sm">{orgConfig.centralizationPercent}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              step="5"
              value={orgConfig.centralizationPercent}
              onChange={(e) => setOrgConfig('centralizationPercent', e.target.value)}
              className="w-full h-2.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>10% (Empowered Store Leads)</span>
              <span>95% (HQ Authoritarian Command)</span>
            </div>
          </div>

          {/* Formalization */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">Formalization Level (SOPs):</span>
              <strong className="text-pink-400 text-sm">{orgConfig.formalizationLevel} / 10</strong>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={orgConfig.formalizationLevel}
              onChange={(e) => setOrgConfig('formalizationLevel', e.target.value)}
              className="w-full h-2.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>1.0 (Flexible / Ad-hoc)</span>
              <span>10.0 (Strict Taylorist 10-Min SOPs)</span>
            </div>
          </div>

          {/* Academic Synthesis Callout */}
          <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 font-mono uppercase">
              <Info className="w-3.5 h-3.5" />
              <span>POME Unit I Academic Link</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Henri Fayol's <strong>Scalar Chain</strong> dictates that authority runs unbroken from apex to base. As span of control shrinks, tiers multiply exponentially: information degrades, latency grows, and coordination costs escalate.
            </p>
          </div>
        </div>

        {/* Right 7 Cols: Visual Animated Org Tree */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-dark-900/90 p-6 overflow-x-auto shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6 pb-3 border-b border-slate-800">
              <span className="flex items-center gap-2 font-bold text-white text-sm">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                Hierarchical Org-Tree Topology
              </span>
              <span className="px-2.5 py-1 rounded bg-dark-800 text-slate-300 border border-slate-700">
                {orgMetrics.managementLayers} Management Levels Rendered
              </span>
            </div>

            {/* Visual Tree */}
            <div className="py-8 flex justify-center min-w-[520px]">
              {renderTreeNode(orgTree)}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400 text-center">
            Burns & Stalker (1961): Dynamic hyper-local quick commerce thrives on flatter spans (8-12) to avoid dark-store fulfillment paralysis.
          </div>
        </div>

      </div>

    </div>
  );
}
