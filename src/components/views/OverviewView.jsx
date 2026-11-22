import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import GradientText from '../reactbits/GradientText';
import ShinyText from '../reactbits/ShinyText';
import DataProvenanceBadge from '../common/DataProvenanceBadge';
import { computeStrategicHealthScore } from '../../engine/forces';
import { recommendCompetitiveStrategy } from '../../engine/recommender';
import {
  TrendingUp,
  Percent,
  Compass,
  ShieldCheck,
  Building,
  Clock,
  ShoppingBag,
  Layers,
  ArrowUpRight,
  Info,
  Sparkles,
  Zap
} from 'lucide-react';

export default function OverviewView() {
  const {
    currentCompanies,
    selectedCompanyId,
    setSelectedCompanyId,
    industryAttractiveness,
    currentForceScores,
    bcgMetrics,
    activeShocks,
    setActiveTab
  } = useSimStore();

  const firm = currentCompanies.find(c => c.id === selectedCompanyId) || currentCompanies[0];
  const firmBCG = bcgMetrics.find(b => b.id === selectedCompanyId) || bcgMetrics[0];
  
  // Calculate strategic health score
  const healthScore = computeStrategicHealthScore(
    firm,
    industryAttractiveness.attractivenessIndex,
    firm.annualGrowthRate
  );

  // Get strategy recommendation
  const recommendation = recommendCompetitiveStrategy(firm, industryAttractiveness, firmBCG);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header & Company Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
              Executive Strategic Overview
            </h2>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border"
              style={{
                borderColor: `${firm.color}60`,
                backgroundColor: `${firm.color}15`,
                color: firm.color
              }}
            >
              Active Firm: {firm.name}
            </span>
            <DataProvenanceBadge
              type={firm.provenanceType || (firm.isPlaceholder ? 'placeholder' : 'verified')}
              source={firm.source}
              year={firm.year || '2024'}
              confidence={firm.confidence}
            />
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time telemetry, market share positioning, and strategic viability under current industry forces.
          </p>
        </div>

        {/* Company Quick-Tabs */}
        <div className="flex flex-wrap gap-2">
          {currentCompanies.map(c => {
            const isSelected = c.id === selectedCompanyId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCompanyId(c.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'border-violet-500 bg-violet-600/20 text-white shadow-lg shadow-violet-500/20'
                    : 'border-slate-800 bg-dark-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name}</span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">
                  {c.marketShare}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary KPI Spotlight Cards (Module 1 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Market Share */}
        <SpotlightCard
          spotlightColor="rgba(250, 204, 21, 0.2)"
          className="p-5 border-l-4 border-l-yellow-400"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Metro Market Share</span>
            <Percent className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
            <CountUp to={firm.marketShare} decimals={1} suffix="%" />
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Rank: #{currentCompanies.slice().sort((a,b) => b.marketShare - a.marketShare).findIndex(x => x.id === firm.id) + 1} of 4</span>
            <span className="text-yellow-400 font-mono">₹{firm.revenue} Cr FY24</span>
          </div>
        </SpotlightCard>

        {/* KPI 2: Estimated Growth */}
        <SpotlightCard
          spotlightColor="rgba(6, 182, 212, 0.2)"
          className="p-5 border-l-4 border-l-cyan-400"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">YoY Growth Rate</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
            <CountUp to={firm.annualGrowthRate} decimals={1} prefix="+" suffix="%" />
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Market Benchmark: +58%</span>
            <span className={firm.annualGrowthRate >= 58 ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
              {firm.annualGrowthRate >= 58 ? "Outperforming" : "Lagging"}
            </span>
          </div>
        </SpotlightCard>

        {/* KPI 3: Industry Attractiveness Index */}
        <SpotlightCard
          spotlightColor="rgba(236, 72, 153, 0.2)"
          className="p-5 border-l-4 border-l-pink-400 cursor-pointer"
        >
          <div
            onClick={() => setActiveTab('forces')}
            className="flex items-center justify-between text-slate-400 mb-2 group"
          >
            <span className="text-xs font-mono uppercase tracking-wider">Industry Attractiveness</span>
            <Compass className="w-4 h-4 text-pink-400 group-hover:rotate-45 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
            <CountUp to={industryAttractiveness.attractivenessIndex} decimals={1} suffix=" / 10" />
          </div>
          <div className="text-xs mt-2 flex items-center justify-between">
            <span className="text-slate-400">Porter 5 Forces</span>
            <span className={`font-semibold ${
              industryAttractiveness.attractivenessIndex >= 4.5 ? 'text-emerald-400' :
              industryAttractiveness.attractivenessIndex >= 3.0 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {industryAttractiveness.tier}
            </span>
          </div>
        </SpotlightCard>

        {/* KPI 4: Strategic Health Score */}
        <SpotlightCard
          spotlightColor="rgba(139, 92, 246, 0.2)"
          className="p-5 border-l-4 border-l-violet-500"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Strategic Health Score</span>
            <ShieldCheck className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
            <CountUp to={healthScore} suffix="/100" />
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Buffer vs Shocks</span>
            <span className={`font-semibold ${
              healthScore >= 70 ? 'text-emerald-400' : healthScore >= 50 ? 'text-cyan-400' : 'text-rose-400'
            }`}>
              {healthScore >= 70 ? 'Resilient' : healthScore >= 50 ? 'Moderate' : 'Vulnerable'}
            </span>
          </div>
        </SpotlightCard>

      </div>

      {/* Operational Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        <div className="p-3.5 rounded-xl border border-slate-800 bg-dark-800/60 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Building className="w-3.5 h-3.5 text-violet-400" />
            <span>Dark Stores</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            <CountUp to={firm.darkStoreCount} />
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Micro-fulfillment hubs</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-dark-800/60 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Avg Delivery SLA</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            <CountUp to={firm.avgDeliveryTimeMin} decimals={1} suffix=" min" />
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Order to doorstep</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-dark-800/60 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <ShoppingBag className="w-3.5 h-3.5 text-pink-400" />
            <span>Avg Order Value (AOV)</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            <CountUp to={firm.avgOrderValueINR} prefix="₹" />
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Basket size</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-dark-800/60 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Percent className="w-3.5 h-3.5 text-emerald-400" />
            <span>Take Rate</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            <CountUp to={firm.takeRatePercent} decimals={1} suffix="%" />
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Commission + Ad revenue</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-dark-800/60 backdrop-blur-md col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>EBITDA Margin</span>
          </div>
          <div className={`text-xl font-bold font-mono ${firm.ebitdaMarginPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            <CountUp to={firm.ebitdaMarginPercent} decimals={1} suffix="%" />
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Contribution to break-even</div>
        </div>

      </div>

      {/* Strategic Recommender Quick Banner */}
      <div className="p-5 rounded-2xl border border-violet-500/40 bg-gradient-to-r from-violet-950/40 via-dark-800 to-dark-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Porter Generic Strategy Recommendation
              </span>
              <span className="text-xs font-mono text-slate-400">
                BCG Action: <span className="text-white font-bold">{recommendation.bcgAction}</span>
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Recommended: <GradientText colors={['#a78bfa', '#38bdf8']}>{recommendation.strategy}</GradientText>
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {recommendation.rationale}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('recommender')}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-lg shadow-violet-600/30 cursor-pointer"
          >
            <span>View Rule-Firing Trace</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Data Source & Academic Citation Notice */}
      <div className="p-4 rounded-xl border border-slate-800/80 bg-dark-900/60 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-slate-300">Data Source:</span> {firm.source}
            <div className="text-[11px] text-slate-500 mt-0.5">{firm.notes}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-800 border border-slate-700 text-slate-300">
            Confidence: {firm.confidence}
          </span>
          <button
            onClick={() => setActiveTab('methodology')}
            className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px] cursor-pointer"
          >
            Formulas & Assumptions
          </button>
        </div>
      </div>

    </div>
  );
}

