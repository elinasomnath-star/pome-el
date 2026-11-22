import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import GradientText from '../reactbits/GradientText';
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
  Zap
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

  const firm = currentCompanies.find(c => c.id === selectedCompanyId) || currentCompanies[0];
  const firmBCG = bcgMetrics.find(b => b.id === selectedCompanyId) || bcgMetrics[0];

  const recommendation = recommendCompetitiveStrategy(firm, industryAttractiveness, firmBCG);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight flex items-center gap-2">
              <Compass className="w-7 h-7 text-violet-400" />
              <span>Competitive Strategy Recommender & Case Layer</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Porter Generic Strategies & POSDCORB
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Rule-based inference engine mapping quick-commerce economics to Porter's Generic Strategies, BCG imperatives, and POSDCORB functions.
          </p>
        </div>

        {/* Firm Switcher */}
        <div className="flex items-center gap-2">
          {currentCompanies.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCompanyId(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all border ${
                c.id === selectedCompanyId
                  ? 'bg-violet-600/30 border-violet-500 text-white shadow-md'
                  : 'bg-dark-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {c.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Recommendation Spotlight Card */}
      <SpotlightCard
        spotlightColor="rgba(139, 92, 246, 0.25)"
        className="p-6 sm:p-8 border-2 border-violet-500/50 bg-gradient-to-br from-dark-800 to-violet-950/20 shadow-2xl"
      >
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase text-violet-400 font-bold tracking-wider">
                Primary Competitive Strategy
              </span>
              <h3 className="text-3xl font-extrabold text-white font-sans mt-1">
                <GradientText colors={['#a78bfa', '#38bdf8', '#f472b6']}>
                  {recommendation.strategy}
                </GradientText>
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">BCG Prescriptive Action</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">{recommendation.bcgAction}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                {firmBCG.quadrant}
              </div>
            </div>
          </div>

          {/* Plain English Explanation */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">
              Plain-English Strategic Synthesis
            </h4>
            <p className="text-base text-slate-200 leading-relaxed font-sans">
              {recommendation.rationale}
            </p>
          </div>

          {/* Strategic Priorities */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">
              Core Tactical Imperatives
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recommendation.strategicPriorities.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-dark-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rule-Firing Trace Box */}
          <div className="p-4 rounded-xl bg-dark-950/80 border border-slate-800/90 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-violet-400">
              <Sparkles className="w-4 h-4" />
              <span>Inference Engine Rule-Firing Trace:</span>
            </div>
            {recommendation.firedRules.map((rule, idx) => (
              <div key={idx} className="text-xs font-mono text-slate-300 flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0">[{rule.ruleId}]:</span>
                <span>{rule.description}</span>
              </div>
            ))}
          </div>

        </div>
      </SpotlightCard>

      {/* Case Layer: Unit I POSDCORB Interactive Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Case Layer: POSDCORB in Quick Commerce (Unit I)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Luther Gulick & Lyndall Urwick (1937)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {Object.values(POSDCORB_FUNCTIONS).map(func => (
            <div
              key={func.code}
              className="p-4 rounded-xl border border-slate-800 bg-dark-900/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs"
                    style={{ backgroundColor: `${func.color}25`, color: func.color }}
                  >
                    {func.code}
                  </span>
                  <span className="text-xs font-bold text-white font-sans">{func.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mb-2 font-sans">
                  {func.definition}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-cyan-300/90 leading-tight">
                <strong>QC Application:</strong> {func.qcApplication}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Management Schools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <Layers className="w-5 h-5 text-pink-400" />
            <span>Classic Management Schools of Thought</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Taylor, Fayol, Mayo, Burns & Stalker</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(MANAGEMENT_SCHOOLS).map(school => (
            <div
              key={school.id}
              className="p-4 rounded-xl border border-slate-800 bg-dark-900/80 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{school.name}</h4>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${school.badgeClass}`}>
                  {school.thinkers.split(',')[0]}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {school.focus}
              </p>
              <div className="p-2.5 rounded-lg bg-dark-950/60 border border-slate-800 text-[11px] font-mono text-slate-400">
                <span className="text-white font-semibold">Quick Commerce Reality: </span>
                {school.quickCommerceExample}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

