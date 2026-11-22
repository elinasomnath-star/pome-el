import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import GradientText from '../reactbits/GradientText';
import Stepper from '../reactbits/Stepper';
import confetti from 'canvas-confetti';
import {
  Flame,
  Swords,
  Play,
  RotateCcw,
  Trophy,
  Scale,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sliders,
  DollarSign,
  Activity,
  Bot
} from 'lucide-react';
import priceWarConfigData from '../../data/priceWarConfig.json';
import { calculateFirmDemand } from '../../engine/priceWar';

export default function PriceWarView() {
  const {
    priceWarFirms,
    priceWarPrices,
    setFirmPrice,
    setAIStrategy,
    marketStructure,
    setMarketStructure,
    currentRound,
    maxRounds,
    priceHistory,
    cumulativeProfits,
    nextPriceRound,
    resetPriceWar,
    nashStatus,
    gameCompleted,
    finalScore
  } = useSimStore();

  const userFirm = priceWarFirms.find(f => f.isUser) || priceWarFirms[1]; // Zepto
  const currentPrice = priceWarPrices[userFirm.id] || userFirm.basePrice;

  const currentRoundData = priceHistory[priceHistory.length - 1] || null;
  const currentResults = currentRoundData?.results?.firms || {};
  const userResult = currentResults[userFirm.id] || {
    price: currentPrice,
    demand: 350000,
    profit: 150000,
    marketSharePercent: 28
  };

  // Trigger confetti when game completes
  React.useEffect(() => {
    if (gameCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [gameCompleted]);

  // Generate Demand Curve points for User Firm:
  // Scan P from 12 to 65
  const demandCurvePoints = [];
  const minP = 12;
  const maxP = 65;
  for (let p = minP; p <= maxP; p += 2) {
    const tempPrices = { ...priceWarPrices, [userFirm.id]: p };
    const q = calculateFirmDemand(
      userFirm,
      tempPrices,
      priceWarFirms,
      marketStructure,
      priceWarConfigData.marketConfig.structures
    );
    demandCurvePoints.push({ price: p, demand: q });
  }

  // SVG dimensions for Demand Curve
  const svgW = 460;
  const svgH = 220;
  const pad = 40;
  const maxD = Math.max(...demandCurvePoints.map(d => d.demand)) * 1.05;
  const minD = Math.min(...demandCurvePoints.map(d => d.demand)) * 0.95;

  const mapChartX = (p) => pad + ((p - minP) / (maxP - minP)) * (svgW - 2 * pad);
  const mapChartY = (q) => svgH - pad - ((q - minD) / (maxD - minD)) * (svgH - 2 * pad);

  const pathData = demandCurvePoints.map((pt, i) => {
    const x = mapChartX(pt.price);
    const y = mapChartY(pt.demand);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const currentOpX = mapChartX(currentPrice);
  const currentOpY = mapChartY(userResult.demand || 300000);

  // Stepper steps for 12 rounds
  const steps = Array.from({ length: maxRounds }).map((_, i) => ({
    title: `R${i + 1}`
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight flex items-center gap-2">
              <Swords className="w-7 h-7 text-pink-400" />
              <span>Bertrand-Nash Price War Simulator</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-pink-500/20 text-pink-300 border border-pink-500/30">
              Constant Elasticity
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Set delivery & handling fee per order. AI rivals react using match, undercut, hold, or tit-for-tat rules.
          </p>
        </div>

        {/* Market Structure Toggle (Oligopoly vs Monopolistic) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-dark-800 border border-slate-700 text-xs font-mono">
            <button
              onClick={() => setMarketStructure('oligopoly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                marketStructure === 'oligopoly'
                  ? 'bg-violet-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Oligopoly (High Cross-Elasticity)
            </button>
            <button
              onClick={() => setMarketStructure('monopolistic')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                marketStructure === 'monopolistic'
                  ? 'bg-violet-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monopolistic Competition (Niche Differentiation)
            </button>
          </div>

          <button
            onClick={resetPriceWar}
            className="p-2.5 rounded-xl bg-dark-800 border border-slate-700 text-slate-400 hover:text-white"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 12-Round Stepper */}
      <div className="p-3.5 rounded-2xl border border-slate-800 bg-dark-900/80">
        <div className="flex items-center justify-between mb-1 px-1">
          <span className="text-xs font-mono font-bold text-slate-300">
            Round Progress: {currentRound} of {maxRounds}
          </span>
          <span className="text-xs font-mono text-cyan-400">
            User Firm: <strong>Zepto</strong> | Unit Cost: ₹{userFirm.unitCost}
          </span>
        </div>
        <Stepper steps={steps} currentStep={currentRound - 1} />
      </div>

      {/* Main Grid: Control Panel + Live Demand Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: User Price Controller & AI Opponents */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* User Firm Control Card */}
          <SpotlightCard
            spotlightColor="rgba(236, 72, 153, 0.2)"
            className="p-5 border-2 border-pink-500/50 bg-dark-800/90 shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-pink-400 font-bold tracking-wider">
                    You Control (Player Firm)
                  </span>
                  <h3 className="text-xl font-extrabold text-white font-sans flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink-500" />
                    Zepto Delivery & Handling Fee
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold font-mono text-pink-400">
                    ₹{currentPrice.toFixed(1)}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Margin: ₹{(currentPrice - userFirm.unitCost).toFixed(1)} / order
                  </span>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="10"
                  max="65"
                  step="0.5"
                  value={currentPrice}
                  onChange={(e) => setFirmPrice(userFirm.id, parseFloat(e.target.value))}
                  disabled={gameCompleted}
                  className="w-full h-3 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400 transition-all"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>₹10 (Aggressive Discount)</span>
                  <span>Unit Cost Floor: ₹{userFirm.unitCost}</span>
                  <span>₹65 (Premium Margin)</span>
                </div>
              </div>

              {/* Preset Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-mono">Presets:</span>
                {[20, 26, 32, 40, 50].map(p => (
                  <button
                    key={p}
                    onClick={() => setFirmPrice(userFirm.id, p)}
                    disabled={gameCompleted}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      currentPrice === p
                        ? 'bg-pink-500 text-white'
                        : 'bg-dark-900 border border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    ₹{p}
                  </button>
                ))}
              </div>

              {/* Next Round CTA */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <div className="text-xs text-slate-400 font-mono">
                  {gameCompleted ? (
                    <span className="text-emerald-400 font-bold">12-Round Simulation Complete!</span>
                  ) : (
                    <span>Ready for Round {currentRound + 1}?</span>
                  )}
                </div>

                {!gameCompleted ? (
                  <button
                    onClick={nextPriceRound}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
                  >
                    <span>Simulate Round {currentRound}</span>
                    <Play className="w-4 h-4 fill-white" />
                  </button>
                ) : (
                  <button
                    onClick={resetPriceWar}
                    className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Play Again</span>
                  </button>
                )}
              </div>
            </div>
          </SpotlightCard>

          {/* AI Competitor Rule Configuration */}
          <div className="rounded-2xl border border-slate-800 bg-dark-900/90 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 font-bold text-slate-200">
                <Bot className="w-4 h-4 text-cyan-400" />
                AI Rival Behavioral Strategies
              </span>
              <span>Mutual Interdependence</span>
            </div>

            <div className="space-y-2.5">
              {priceWarFirms.filter(f => !f.isUser).map(rival => {
                const rivalPrice = priceWarPrices[rival.id] || rival.basePrice;
                const rivalRes = currentResults[rival.id] || {};

                return (
                  <div
                    key={rival.id}
                    className="p-3 rounded-xl bg-dark-800/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: rival.color }} />
                      <div>
                        <div className="font-bold text-white font-sans">{rival.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">
                          Price: <strong className="text-white">₹{rivalPrice.toFixed(1)}</strong> | Cost: ₹{rival.unitCost}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={rival.aiStrategy}
                        onChange={(e) => setAIStrategy(rival.id, e.target.value)}
                        disabled={gameCompleted}
                        className="bg-dark-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                      >
                        {priceWarConfigData.aiStrategies.map(strat => (
                          <option key={strat.id} value={strat.id}>
                            {strat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 6 Cols: Live Demand Curve & Round Performance */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Live Constant-Elasticity Demand Curve SVG */}
          <div className="rounded-2xl border border-slate-800 bg-dark-900/90 p-4 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Activity className="w-4 h-4 text-pink-400" />
                Live Demand Curve: Q = A &bull; P^(-e)
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">
                Own Elasticity: e={userFirm.ownElasticity}
              </span>
            </div>

            {/* SVG Chart */}
            <div className="w-full flex items-center justify-center">
              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
                {/* Axis lines */}
                <line x1={pad} y1={svgH - pad} x2={svgW - pad} y2={svgH - pad} stroke="#334155" strokeWidth="1.5" />
                <line x1={pad} y1={pad} x2={pad} y2={svgH - pad} stroke="#334155" strokeWidth="1.5" />

                {/* Demand Curve Line */}
                <path d={pathData} fill="none" stroke="#ec4899" strokeWidth="2.5" />

                {/* Operating Point */}
                <circle cx={currentOpX} cy={currentOpY} r="7" fill="#ec4899" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                
                {/* Crosshairs */}
                <line x1={currentOpX} y1={svgH - pad} x2={currentOpX} y2={currentOpY} stroke="#f472b6" strokeDasharray="3 3" opacity="0.6" />
                <line x1={pad} y1={currentOpY} x2={currentOpX} y2={currentOpY} stroke="#f472b6" strokeDasharray="3 3" opacity="0.6" />

                {/* Operating Point Label */}
                <text x={currentOpX + 10} y={currentOpY - 8} fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  (₹{currentPrice}, {Math.round(userResult.demand || 0).toLocaleString()} orders)
                </text>

                {/* Axis labels */}
                <text x={svgW / 2} y={svgH - 8} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                  Price P (₹ Delivery Fee) →
                </text>
                <text x={-svgH / 2} y={15} transform="rotate(-90)" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                  Monthly Orders Q →
                </text>
              </svg>
            </div>
          </div>

          {/* Nash Equilibrium Diagnostic Status */}
          <div className={`p-4 rounded-2xl border transition-all ${
            nashStatus.isNash
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
          }`}>
            <div className="flex items-center gap-2 font-mono text-xs font-bold mb-1">
              {nashStatus.isNash ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
              )}
              <span>{nashStatus.isNash ? 'NASH EQUILIBRIUM ACHIEVED' : 'UNSTABLE / NASH DEVIATION POSSIBLE'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {nashStatus.statusText}
            </p>
            {!nashStatus.isNash && nashStatus.deviations?.zepto && (
              <div className="text-[11px] font-mono text-amber-400/90 mt-1">
                &bull; Zepto Best-Response Price: ₹{nashStatus.deviations.zepto.bestPrice} (Potential Gain: +₹{Math.round(nashStatus.deviations.zepto.potentialGain).toLocaleString()})
              </div>
            )}
          </div>

          {/* Live Cumulative & Round Profit Counters */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-800 bg-dark-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Round {currentRound} Profit</span>
              <div className={`text-xl font-bold font-mono ${userResult.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₹<CountUp to={userResult.profit} />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Margin: {userResult.marginPercent}%</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-dark-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Cumulative Profit (Zepto)</span>
              <div className={`text-xl font-bold font-mono ${cumulativeProfits['zepto'] >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                ₹<CountUp to={cumulativeProfits['zepto'] || 0} />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">12-Round Aggregate</span>
            </div>
          </div>

        </div>

      </div>

      {/* Round Performance Breakdown Table */}
      <div className="rounded-2xl border border-slate-800 bg-dark-900/90 p-5 shadow-xl">
        <h3 className="text-base font-bold text-white mb-3 font-sans">
          Market Performance Across All 4 Quick Commerce Competitors
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Firm</th>
                <th className="py-2.5 px-3">Price Set</th>
                <th className="py-2.5 px-3">Unit Cost</th>
                <th className="py-2.5 px-3">Monthly Orders</th>
                <th className="py-2.5 px-3">Round Share</th>
                <th className="py-2.5 px-3">Round Profit</th>
                <th className="py-2.5 px-3">Cumulative Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {priceWarFirms.map(firm => {
                const res = currentResults[firm.id] || {};
                const cumProfit = cumulativeProfits[firm.id] || 0;

                return (
                  <tr key={firm.id} className="hover:bg-dark-800/50">
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: firm.color }} />
                      {firm.name} {firm.isUser && '(You)'}
                    </td>
                    <td className="py-3 px-3 font-bold text-pink-400">
                      ₹{(priceWarPrices[firm.id] || firm.basePrice).toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-slate-400">₹{firm.unitCost}</td>
                    <td className="py-3 px-3 text-white font-medium">
                      {Math.round(res.demand || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-cyan-400 font-bold">
                      {res.marketSharePercent || 0}%
                    </td>
                    <td className={`py-3 px-3 font-bold ${(res.profit || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ₹{Math.round(res.profit || 0).toLocaleString()}
                    </td>
                    <td className={`py-3 px-3 font-bold ${cumProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ₹{Math.round(cumProfit).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

