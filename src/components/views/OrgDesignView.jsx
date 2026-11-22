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
  Bike
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
        <div className={`p-3 rounded-xl border text-center transition-all shadow-md min-w-[140px] max-w-[200px] ${
          node.level === 1
            ? 'bg-violet-950/60 border-violet-500/60 text-violet-200 shadow-violet-950/40'
            : node.level === 2
            ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-200'
            : node.level === 3
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
            : 'bg-dark-800 border-slate-700 text-slate-300'
        }`}>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold mb-1">
            <Icon className="w-3.5 h-3.5" />
            <span className="truncate">{node.name}</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-snug">{node.title}</div>
          <div className="text-[9px] font-mono text-slate-500 mt-1">{node.role}</div>
        </div>

        {/* Children connectors */}
        {node.children && node.children.length > 0 && (
          <div className="flex flex-col items-center w-full mt-2">
            <div className="w-0.5 h-4 bg-slate-700" />
            <div className="flex items-start justify-center gap-4 relative pt-2 border-t border-slate-700">
              {node.children.map(child => renderTreeNode(child))}
              {node.extraHiddenChildren > 0 && (
                <div className="p-2 rounded-lg bg-dark-900 border border-slate-800 text-[10px] font-mono text-slate-500 self-center">
                  +{node.extraHiddenChildren} more peers
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight flex items-center gap-2">
              <Network className="w-7 h-7 text-emerald-400" />
              <span>Organizational Architecture & What-If Modeler</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Gulick & Urwick (1937) / Burns & Stalker (1961)
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Tune span of control and centralization to see management layers = log_span(headcount) and mechanistic vs organic continuum.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-dark-800 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">Structure Archetype: </span>
            <strong className={`font-bold ${
              orgMetrics.mechanisticScore >= 65 ? 'text-rose-400' :
              orgMetrics.mechanisticScore <= 45 ? 'text-emerald-400' : 'text-cyan-400'
            }`}>
              {orgMetrics.orgType}
            </strong>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.2)" className="p-4 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Management Layers</span>
          <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
            <CountUp to={orgMetrics.managementLayers} />
            <span className="text-xs font-normal text-slate-400">layers</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-2">
            log_{orgConfig.spanOfControl}({orgConfig.headcount}) = {orgMetrics.continuousLayers}
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(6, 182, 212, 0.2)" className="p-4 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Coordination Cost Index</span>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono">
            <CountUp to={orgMetrics.coordinationCostIndex} decimals={1} />
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-2">
            Scales with layers & centralization
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.2)" className="p-4 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Mechanistic vs Organic</span>
          <div className="text-3xl font-extrabold text-pink-400 font-mono">
            <CountUp to={orgMetrics.mechanisticScore} suffix="/100" />
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-2">
            {orgMetrics.mechanisticScore >= 65 ? "Bureaucratic (Weber)" : orgMetrics.mechanisticScore <= 45 ? "Agile Network (Burns)" : "Matrix Hybrid"}
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.2)" className="p-4 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Communication Velocity</span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            <CountUp to={orgMetrics.communicationVelocity} decimals={1} suffix=" / 10" />
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-2">
            Speed of information through scalar chain
          </div>
        </SpotlightCard>

      </div>

      {/* Main Grid: Controls + Visual Org Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Sliders */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-dark-900/90 p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-2">
            <Settings className="w-4 h-4 text-violet-400" />
            <span>Structural Decision Parameters</span>
          </div>

          {/* Headcount */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Total Headcount (N):</span>
              <strong className="text-white">{orgConfig.headcount.toLocaleString()}</strong>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="100"
              value={orgConfig.headcount}
              onChange={(e) => setOrgConfig('headcount', e.target.value)}
              className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>500</span>
              <span>10,000 corporate + hub staff</span>
            </div>
          </div>

          {/* Span of Control */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Average Span of Control (S):</span>
              <strong className="text-emerald-400">{orgConfig.spanOfControl} direct reports</strong>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={orgConfig.spanOfControl}
              onChange={(e) => setOrgConfig('spanOfControl', e.target.value)}
              className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>3 (Tall / Strict Oversight)</span>
              <span>15 (Flat / High Autonomy)</span>
            </div>
          </div>

          {/* Centralization */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Centralization Degree (%):</span>
              <strong className="text-cyan-400">{orgConfig.centralizationPercent}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              step="5"
              value={orgConfig.centralizationPercent}
              onChange={(e) => setOrgConfig('centralizationPercent', e.target.value)}
              className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10% (Decentralized Store Leads)</span>
              <span>95% (HQ Authoritarian)</span>
            </div>
          </div>

          {/* Formalization */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Formalization Level (SOPs):</span>
              <strong className="text-pink-400">{orgConfig.formalizationLevel} / 10</strong>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={orgConfig.formalizationLevel}
              onChange={(e) => setOrgConfig('formalizationLevel', e.target.value)}
              className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1.0 (Informal Ad-hoc)</span>
              <span>10.0 (Strict Taylorist SOPs)</span>
            </div>
          </div>

          {/* Academic Synthesis */}
          <div className="p-3.5 rounded-xl bg-dark-800 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-white font-sans">POME Unit I Connection:</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Fayol's <strong>Scalar Chain</strong> states that authority runs in an unbroken line from top to bottom. As span of control decreases, layers multiply exponentially, causing communication latency and high coordination overhead.
            </p>
          </div>
        </div>

        {/* Right 8 Cols: Visual Animated Org Tree */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-dark-900/90 p-5 overflow-x-auto shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              Dynamic Hierarchical Org-Tree Visualizer
            </span>
            <span>{orgMetrics.managementLayers} Management Levels Rendered</span>
          </div>

          {/* Visual Tree */}
          <div className="py-6 flex justify-center min-w-[500px]">
            {renderTreeNode(orgTree)}
          </div>
        </div>

      </div>

    </div>
  );
}

