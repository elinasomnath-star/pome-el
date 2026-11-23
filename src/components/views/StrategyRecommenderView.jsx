import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import GradientText from '../reactbits/GradientText';
import CompanyBrandIcon from '../common/CompanyBrandIcon';
import { recommendCompetitiveStrategy } from '../../engine/recommender';
import { MANAGEMENT_SCHOOLS, POSDCORB_FUNCTIONS } from '../../engine/caseLayer';
import {
  Compass,
  CheckCircle,
  Shield,
  Layers,
  ArrowRight,
  BookOpen,
  Target,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

export default function StrategyRecommenderView() {
  const {
    currentCompanies,
    selectedCompanyId,
    setSelectedCompanyId,
    industryAttractiveness,
    bcgMetrics,
    setActiveTab
  } = useSimStore();

  const [activeCaseLayerTab, setActiveCaseLayerTab] = useState('posdcorb'); // 'posdcorb' | 'schools'
  const [showRuleTrace, setShowRuleTrace] = useState(false);

  const firm = currentCompanies.find(c => c.id === selectedCompanyId) || currentCompanies[0];
  const firmBCG = bcgMetrics.find(b => b.id === selectedCompanyId) || bcgMetrics[0];

  const recommendation = recommendCompetitiveStrategy(firm, industryAttractiveness, firmBCG);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-52">
      
      {/* Title & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
                  Competitive Strategy Recommender
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Porter & POSDCORB
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Rule-based inference engine mapping current economics to Porter's Generic Strategies and management frameworks.
              </p>
            </div>
          </div>
        </div>

        {/* Company Selector Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400 mr-1">Focal Firm:</span>
          {currentCompanies.map(c => {
            const isSelected = c.id === selectedCompanyId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCompanyId(c.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold font-sans transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600/30 border-violet-500 text-white shadow-lg shadow-violet-500/20 ring-1 ring-violet-500/50'
                    : 'bg-dark-800/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <CompanyBrandIcon id={c.id} className="w-7 h-7" showBg={true} />
                <span className="font-bold">{c.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Strategic Recommendation Card */}
      <SpotlightCard
        spotlightColor="rgba(139, 92, 246, 0.25)"
        className="p-6 sm:p-8 border-2 border-violet-500/40 bg-gradient-to-br from-dark-900 via-dark-850 to-violet-950/20 rounded-2xl shadow-2xl space-y-6"
      >
        {/* Header: Strategy Name + BCG Pill */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <CompanyBrandIcon id={firm.id} className="w-14 h-14" showBg={true} />
            <div>
              <span className="text-xs font-mono uppercase text-violet-400 font-bold tracking-wider block mb-1">
                Prescribed Strategy for {firm.name} (Porter Generic)
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
                <GradientText colors={['#a78bfa', '#38bdf8', '#f472b6']}>
                  {recommendation.strategy}
                </GradientText>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] uppercase font-mono text-slate-400 block">BCG Action</span>
              <span className="text-sm font-bold text-cyan-300 font-mono">{recommendation.bcgAction}</span>
            </div>
            <div className={`px-3.5 py-2 rounded-xl border font-mono text-xs font-bold ${
              firmBCG.quadrant === 'Stars' ? 'bg-violet-950/60 border-violet-500/50 text-violet-200' :
              firmBCG.quadrant === 'Cash Cows' ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' :
              firmBCG.quadrant === 'Question Marks' ? 'bg-pink-950/60 border-pink-500/50 text-pink-200' :
              'bg-amber-950/60 border-amber-500/50 text-amber-200'
            }`}>
              {firmBCG.quadrant}
            </div>
          </div>
        </div>

        {/* Strategic Rationale - Clean readable typography */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">
            Strategic Synthesis & Executive Summary
          </h4>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-sans font-normal">
            {recommendation.rationale}
          </p>
        </div>

        {/* Tactical Imperatives - Comfortable grid with breathing room */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">
            Core Tactical Imperatives
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendation.strategicPriorities.map((priority, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-dark-950/70 border border-slate-800 text-sm text-slate-200 flex items-start gap-3 shadow-sm hover:border-slate-700 transition-all"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{priority}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Collapsible Rule-Firing Trace */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setShowRuleTrace(!showRuleTrace)}
            className="flex items-center justify-between w-full py-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Inference Engine Rule-Firing Trace ({recommendation.firedRules.length} rules evaluated)</span>
            </span>
            {showRuleTrace ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showRuleTrace && (
            <div className="mt-3 p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-2 font-mono text-xs text-slate-300 animate-in fade-in">
              {recommendation.firedRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 py-1 border-b border-slate-800/60 last:border-0">
                  <span className="text-cyan-400 font-bold shrink-0">[{rule.ruleId}]</span>
                  <span className="text-slate-300">{rule.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </SpotlightCard>

      {/* Case Layer: Unit I Academic Synthesis Tabs */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Case Layer: Management Theory in Quick Commerce (Unit I)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore how classical, behavioral, and structural concepts directly manifest in day-to-day dark store operations.
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex items-center p-1 rounded-xl bg-dark-800 border border-slate-700 text-xs font-mono">
            <button
              onClick={() => setActiveCaseLayerTab('posdcorb')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeCaseLayerTab === 'posdcorb' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              POSDCORB Functions (7)
            </button>
            <button
              onClick={() => setActiveCaseLayerTab('schools')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeCaseLayerTab === 'schools' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Management Schools (4)
            </button>
          </div>
        </div>

        {/* TAB 1: POSDCORB Functions */}
        {activeCaseLayerTab === 'posdcorb' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.values(POSDCORB_FUNCTIONS).map(func => (
              <div
                key={func.code}
                className="p-5 rounded-2xl border border-slate-800/80 bg-dark-900/90 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm border"
                      style={{
                        backgroundColor: `${func.color}15`,
                        color: func.color,
                        borderColor: `${func.color}40`
                      }}
                    >
                      {func.code}
                    </span>
                    <span className="text-sm font-bold text-white font-sans">{func.name}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                    {func.definition}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-xs font-mono text-cyan-300/90 leading-relaxed bg-dark-950/40 p-2.5 rounded-lg">
                  <strong className="text-cyan-400 block mb-0.5">QC Application:</strong>
                  {func.qcApplication}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Management Schools of Thought */}
        {activeCaseLayerTab === 'schools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.values(MANAGEMENT_SCHOOLS).map(school => (
              <div
                key={school.id}
                className="p-6 rounded-2xl border border-slate-800 bg-dark-900/90 space-y-3.5 shadow-sm hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-base font-bold text-white font-sans">{school.name}</h4>
                  <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${school.badgeClass}`}>
                    {school.thinkers}
                  </span>
                </div>
                
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {school.focus}
                </p>

                <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed space-y-1">
                  <span className="text-violet-400 font-bold block">Quick Commerce Reality:</span>
                  <span>{school.quickCommerceExample}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
