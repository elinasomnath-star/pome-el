import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import GradientText from '../reactbits/GradientText';
import DataProvenanceBadge from '../common/DataProvenanceBadge';
import CompanyBrandIcon from '../common/CompanyBrandIcon';
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
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function OverviewView() {
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
  
  const healthScore = computeStrategicHealthScore(
    firm,
    industryAttractiveness.attractivenessIndex,
    firm.annualGrowthRate
  );

  const recommendation = recommendCompetitiveStrategy(firm, industryAttractiveness, firmBCG);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-40">
      
      {/* Header & Company Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
              Executive Overview
            </h2>
            <span
              className="text-xs px-3 py-1 rounded-full font-sans font-bold border flex items-center gap-2"
              style={{
                borderColor: `${firm.color}60`,
                backgroundColor: `${firm.color}15`,
                color: firm.color
              }}
            >
              <CompanyBrandIcon id={firm.id} className="w-4 h-4" />
              <span>{firm.name}</span>
            </span>
            <DataProvenanceBadge
              type="verified"
              source={firm.source}
              year={firm.year || '2024'}
              confidence="high"
            />
          </div>
          <p className="text-sm text-slate-300">
            Real Q4 FY24 / FY25 audited disclosures: market share, dark store network density, and strategic posture in Indian quick commerce.
          </p>
        </div>

        {/* Company Quick-Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {currentCompanies.map(c => {
            const isSelected = c.id === selectedCompanyId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCompanyId(c.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border shrink-0 cursor-pointer ${
                  isSelected
                    ? 'border-violet-500 bg-violet-600/30 text-white shadow-lg shadow-violet-500/20 ring-1 ring-violet-500/50'
                    : 'border-slate-800 bg-dark-800/80 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <CompanyBrandIcon id={c.id} className="w-4 h-4" />
                <span>{c.name.split(' ')[0]}</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {c.marketShare}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary KPI Cards (Spacious, prominent numbers, readable labels) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Market Share */}
        <SpotlightCard
          spotlightColor="rgba(250, 204, 21, 0.15)"
          className="p-6 border border-slate-800/80 bg-dark-800/60"
        >
          <div className="flex items-center justify-between text-slate-300 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Metro Market Share</span>
            <Percent className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-4xl font-extrabold text-white font-mono tracking-tight">
            <CountUp to={firm.marketShare} decimals={1} suffix="%" />
          </div>
          <div className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <span>Rank #{currentCompanies.slice().sort((a,b) => b.marketShare - a.marketShare).findIndex(x => x.id === firm.id) + 1} of 4</span>
            <span className="text-yellow-400 font-mono font-medium">₹{firm.revenue} Cr Revenue</span>
          </div>
        </SpotlightCard>

        {/* KPI 2: YoY Growth Rate */}
        <SpotlightCard
          spotlightColor="rgba(6, 182, 212, 0.15)"
          className="p-6 border border-slate-800/80 bg-dark-800/60"
        >
          <div className="flex items-center justify-between text-slate-300 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">YoY GMV Growth</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-4xl font-extrabold text-white font-mono tracking-tight">
            <CountUp to={firm.annualGrowthRate} decimals={1} prefix="+" suffix="%" />
          </div>
          <div className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <span>Sector Avg: +58%</span>
            <span className={firm.annualGrowthRate >= 58 ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
              {firm.annualGrowthRate >= 58 ? "Outperforming" : "Moderate"}
            </span>
          </div>
        </SpotlightCard>

        {/* KPI 3: Industry Attractiveness Index */}
        <SpotlightCard
          spotlightColor="rgba(236, 72, 153, 0.15)"
          className="p-6 border border-slate-800/80 bg-dark-800/60 cursor-pointer"
        >
          <div
            onClick={() => setActiveTab('forces')}
            className="flex items-center justify-between text-slate-300 mb-3 group"
          >
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Industry Attractiveness</span>
            <Compass className="w-4 h-4 text-pink-400 group-hover:rotate-45 transition-transform" />
          </div>
          <div className="text-4xl font-extrabold text-white font-mono tracking-tight">
            <CountUp to={industryAttractiveness.attractivenessIndex} decimals={1} suffix=" / 10" />
          </div>
          <div className="text-xs mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-slate-300">Porter 5 Forces</span>
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
          spotlightColor="rgba(139, 92, 246, 0.15)"
          className="p-6 border border-slate-800/80 bg-dark-800/60"
        >
          <div className="flex items-center justify-between text-slate-300 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Strategic Health</span>
            <ShieldCheck className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-4xl font-extrabold text-white font-mono tracking-tight">
            <CountUp to={healthScore} suffix="/100" />
          </div>
          <div className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <span>Buffer vs Shocks</span>
            <span className={`font-semibold ${
              healthScore >= 70 ? 'text-emerald-400' : healthScore >= 50 ? 'text-cyan-400' : 'text-rose-400'
            }`}>
              {healthScore >= 70 ? 'Resilient Lead' : healthScore >= 50 ? 'Competitive' : 'Vulnerable'}
            </span>
          </div>
        </SpotlightCard>

      </div>

      {/* Operational Delivery Telemetry (Clean, readable grid) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
          Fulfillment & Unit Economics Telemetry
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-dark-800/40">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
              <Building className="w-4 h-4 text-violet-400" />
              <span>Dark Stores</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              <CountUp to={firm.darkStoreCount} />
            </div>
            <div className="text-xs text-slate-400 mt-1">Micro-fulfillment hubs</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-dark-800/40">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Avg Delivery SLA</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              <CountUp to={firm.avgDeliveryTimeMin} decimals={1} suffix=" min" />
            </div>
            <div className="text-xs text-slate-400 mt-1">Doorstep turnaround</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-dark-800/40">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
              <ShoppingBag className="w-4 h-4 text-pink-400" />
              <span>Avg Basket (AOV)</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              <CountUp to={firm.avgOrderValueINR} prefix="₹" />
            </div>
            <div className="text-xs text-slate-400 mt-1">Average order value</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-dark-800/40">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
              <Percent className="w-4 h-4 text-emerald-400" />
              <span>Take Rate</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              <CountUp to={firm.takeRatePercent} decimals={1} suffix="%" />
            </div>
            <div className="text-xs text-slate-400 mt-1">Commission + Ad share</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-dark-800/40 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>EBITDA Margin</span>
            </div>
            <div className={`text-2xl font-bold font-mono ${firm.ebitdaMarginPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <CountUp to={firm.ebitdaMarginPercent} decimals={1} suffix="%" />
            </div>
            <div className="text-xs text-slate-400 mt-1">Operating margin</div>
          </div>
        </div>
      </div>

      {/* Strategic Recommender Quick Banner (Spacious, generous breathing room) */}
      <div className="p-6 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/30 via-dark-800/60 to-dark-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-200 border border-violet-500/30">
                Porter Generic Strategy
              </span>
              <span className="text-xs font-mono text-slate-300">
                BCG Action: <strong className="text-cyan-300">{recommendation.bcgAction}</strong>
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white font-sans">
              Recommended: <GradientText colors={['#a78bfa', '#38bdf8']}>{recommendation.strategy}</GradientText>
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {recommendation.rationale}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('recommender')}
            className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold font-mono flex items-center gap-2 shrink-0 transition-all shadow-lg shadow-violet-600/30 cursor-pointer self-start md:self-auto"
          >
            <span>View Rule-Firing Trace</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
