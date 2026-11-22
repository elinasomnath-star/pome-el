import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import Stepper from '../reactbits/Stepper';
import CompanyBrandIcon from '../common/CompanyBrandIcon';
import confetti from 'canvas-confetti';
import {
  Swords,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Activity,
  Bot
} from 'lucide-react';
import priceWarConfigData from '../../data/priceWarConfig.json';
import { calculateFirmDemand, simulatePriceRound } from '../../engine/priceWar';

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
    gameCompleted
  } = useSimStore();

  const userFirm = priceWarFirms.find(f => f.isUser) || priceWarFirms[1];
  const currentPrice = priceWarPrices[userFirm.id] || userFirm.basePrice;

  // Real-time live simulation based on current prices and market structure
  const liveResults = React.useMemo(() => {
    return simulatePriceRound(
      priceWarFirms,
      priceWarPrices,
      marketStructure,
      priceWarConfigData.marketConfig.structures
    );
  }, [priceWarFirms, priceWarPrices, marketStructure]);

  const currentRoundData = priceHistory[priceHistory.length - 1] || null;
  // Use live results for immediate visual feedback as player adjusts price or market structure
  const currentResults = liveResults.firms;
  const userResult = currentResults[userFirm.id] || {
    price: currentPrice,
    demand: 220000,
    profit: 1750000,
    marginPercent: 26.6,
    marketSharePercent: 20
  };

  React.useEffect(() => {
    if (gameCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [gameCompleted]);

  // Generate Demand Curve points
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

  const svgW = 480;
  const svgH = 240;
  const pad = 45;
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

  const steps = Array.from({ length: maxRounds }).map((_, i) => ({
    title: `R${i + 1}`
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-40">
      
      {/* Header - Elegant 2-Tier Layout with Dedicated Ribbon */}
      <div className="space-y-4 pb-5 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 shrink-0">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
                  Bertrand-Nash Price War Simulator
                </h2>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full font-mono text-xs font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 whitespace-nowrap shrink-0 shadow-sm">
                  <span>Q = A &middot; P<sup>-&epsilon;</sup></span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-sans">
                Set customer delivery fee. AI competitors react using match, undercut, hold, or tit-for-tat heuristics under oligopolistic cross-price elasticity.
              </p>
            </div>
          </div>
        </div>

        {/* Dedicated Market Structure & Reset Toolbar */}
        <div className="p-2.5 rounded-xl bg-dark-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="font-semibold text-slate-200">Market Regime:</span>
            <span className="text-slate-400">
              {marketStructure === 'oligopoly' ? 'High cross-elasticity (Intense retaliation)' : 'Captive differentiation (Pricing power unlocked)'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center p-1 rounded-xl bg-dark-950 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setMarketStructure('oligopoly')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  marketStructure === 'oligopoly'
                    ? 'bg-violet-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Oligopoly (Retaliatory Wars)
              </button>
              <button
                onClick={() => setMarketStructure('monopolistic')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  marketStructure === 'monopolistic'
                    ? 'bg-violet-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monopolistic (Zepto Cafe Niche)
              </button>
            </div>

            <button
              onClick={resetPriceWar}
              className="p-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono px-3"
              title="Reset Game"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 12-Round Stepper */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-dark-900/80 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold text-white">
            Campaign Round: {currentRound} of {maxRounds}
          </span>
          <span className="text-xs font-mono text-cyan-400">
            Controlling: <strong className="text-pink-400">Zepto</strong> &bull; Marginal Cost Floor: ₹{userFirm.unitCost}
          </span>
        </div>
        <Stepper steps={steps} currentStep={currentRound - 1} />
      </div>

      {/* Main Grid: Control Panel + Demand Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 6 Cols: Player Price Controller & AI Rivals */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* User Firm Control Card */}
          <SpotlightCard
            spotlightColor="rgba(236, 72, 153, 0.2)"
            className="p-6 border-2 border-pink-500/50 bg-dark-800/90 shadow-xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CompanyBrandIcon id={userFirm.id} className="w-8 h-8" showBg={true} />
                <div>
                  <span className="text-xs uppercase font-mono text-pink-400 font-bold tracking-wider">
                    Player Decision
                  </span>
                  <h3 className="text-xl font-bold text-white font-sans mt-0.5">
                    {userFirm.name} Delivery & Handling Fee
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold font-mono text-pink-400">
                  ₹{currentPrice.toFixed(1)}
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Margin: ₹{(currentPrice - userFirm.unitCost).toFixed(1)} / drop
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="10"
                max="65"
                step="0.5"
                value={currentPrice}
                onChange={(e) => setFirmPrice(userFirm.id, parseFloat(e.target.value))}
                disabled={gameCompleted}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-pink-400 hover:accent-pink-300 transition-all border border-slate-800"
                style={{
                  background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${((currentPrice - 10) / 55) * 100}%, #0f172a ${((currentPrice - 10) / 55) * 100}%, #0f172a 100%)`
                }}
              />
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>₹10 (Price War Floor)</span>
                <span>Marginal Cost: ₹{userFirm.unitCost}</span>
                <span>₹65 (Premium Fee)</span>
              </div>
            </div>

            {/* Evaluator Scenario Demonstration Presets */}
            <div className="space-y-2 pt-1">
              <span className="text-xs text-slate-400 font-mono block">
                Demonstration Presets (for Evaluator Presentation):
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setMarketStructure('oligopoly');
                    setFirmPrice(userFirm.id, 18);
                  }}
                  disabled={gameCompleted}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    currentPrice === 18 && marketStructure === 'oligopoly'
                      ? 'bg-rose-500 text-white shadow-md font-bold'
                      : 'bg-dark-900 border border-rose-500/30 text-rose-300 hover:bg-rose-500/10'
                  }`}
                  title="Price below MC (₹23.50) triggers severe capital burn"
                >
                  Price War Trap (₹18)
                </button>

                <button
                  onClick={() => {
                    setMarketStructure('oligopoly');
                    setFirmPrice(userFirm.id, 32);
                  }}
                  disabled={gameCompleted}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    currentPrice === 32 && marketStructure === 'oligopoly'
                      ? 'bg-cyan-500 text-white shadow-md font-bold'
                      : 'bg-dark-900 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10'
                  }`}
                  title="Steady-state positive profit covering dark-store overhead"
                >
                  Baseline (₹32)
                </button>

                <button
                  onClick={() => {
                    setMarketStructure('oligopoly');
                    setFirmPrice(userFirm.id, 38);
                  }}
                  disabled={gameCompleted}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    currentPrice === 38 && marketStructure === 'oligopoly'
                      ? 'bg-emerald-500 text-white shadow-md font-bold'
                      : 'bg-dark-900 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10'
                  }`}
                  title="Profit maximization under Bertrand-Nash equilibrium"
                >
                  Optimal Margin (₹38)
                </button>

                <button
                  onClick={() => {
                    setMarketStructure('monopolistic');
                    setFirmPrice(userFirm.id, 38);
                  }}
                  disabled={gameCompleted}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    currentPrice === 38 && marketStructure === 'monopolistic'
                      ? 'bg-violet-600 text-white shadow-md font-bold'
                      : 'bg-dark-900 border border-violet-500/40 text-violet-300 hover:bg-violet-500/10'
                  }`}
                  title="Differentiated captive niche (Zepto Cafe) lowers cross-elasticity, generating super-normal profits"
                >
                  ★ Zepto Cafe Niche (+₹81L)
                </button>
              </div>
            </div>

            {/* Next Round CTA */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-800">
              <div className="text-xs text-slate-300 font-mono">
                {gameCompleted ? (
                  <strong className="text-emerald-400">12-Round Campaign Complete!</strong>
                ) : (
                  <span>Ready for Round {currentRound}?</span>
                )}
              </div>

              {!gameCompleted ? (
                <button
                  onClick={nextPriceRound}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
                >
                  <span>Simulate Round {currentRound}</span>
                  <Play className="w-4 h-4 fill-white" />
                </button>
              ) : (
                <button
                  onClick={resetPriceWar}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-violet-600/30"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>
              )}
            </div>
          </SpotlightCard>

          {/* AI Rival Behavioral Strategies */}
          <div className="rounded-2xl border border-slate-800 bg-dark-900/90 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-2 font-bold text-slate-200">
                <Bot className="w-4 h-4 text-cyan-400" />
                AI Competitor Heuristics
              </span>
              <span>Oligopoly Interdependence</span>
            </div>

            <div className="space-y-3">
              {priceWarFirms.filter(f => !f.isUser).map(rival => {
                const rivalPrice = priceWarPrices[rival.id] || rival.basePrice;

                return (
                  <div
                    key={rival.id}
                    className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <CompanyBrandIcon id={rival.id} className="w-8 h-8" showBg={true} />
                      <div>
                        <div className="font-bold text-white font-sans text-sm">{rival.name}</div>
                        <div className="text-xs font-mono text-slate-400">
                          Price: <strong className="text-white">₹{rivalPrice.toFixed(1)}</strong> &bull; Unit Cost: ₹{rival.unitCost}
                        </div>
                      </div>
                    </div>

                    <select
                      value={rival.aiStrategy}
                      onChange={(e) => setAIStrategy(rival.id, e.target.value)}
                      disabled={gameCompleted}
                      className="bg-dark-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 focus:border-cyan-500"
                    >
                      {priceWarConfigData.aiStrategies.map(strat => (
                        <option key={strat.id} value={strat.id}>
                          {strat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 6 Cols: Demand Curve & Nash Status */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Live Demand Curve Chart */}
          <div className="rounded-2xl border border-slate-800 bg-dark-900/90 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2 font-bold text-white text-sm">
                <Activity className="w-4 h-4 text-pink-400" />
                Live Constant-Elasticity Demand Curve
              </span>
              <span className="text-cyan-400 font-mono">
                Own Elasticity: e={userFirm.ownElasticity}
              </span>
            </div>

            <div className="w-full flex items-center justify-center">
              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
                <line x1={pad} y1={svgH - pad} x2={svgW - pad} y2={svgH - pad} stroke="#334155" strokeWidth="1.5" />
                <line x1={pad} y1={pad} x2={pad} y2={svgH - pad} stroke="#334155" strokeWidth="1.5" />

                <path d={pathData} fill="none" stroke="#ec4899" strokeWidth="2.5" />

                <circle cx={currentOpX} cy={currentOpY} r="7" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
                
                <line x1={currentOpX} y1={svgH - pad} x2={currentOpX} y2={currentOpY} stroke="#f472b6" strokeDasharray="3 3" opacity="0.6" />
                <line x1={pad} y1={currentOpY} x2={currentOpX} y2={currentOpY} stroke="#f472b6" strokeDasharray="3 3" opacity="0.6" />

                <text x={currentOpX + 10} y={currentOpY - 8} fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  (₹{currentPrice}, {Math.round(userResult.demand || 0).toLocaleString()} orders)
                </text>

                <text x={svgW / 2} y={svgH - 8} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">
                  Delivery Fee P (₹) →
                </text>
                <text x={-svgH / 2} y={16} transform="rotate(-90)" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">
                  Monthly Orders Q →
                </text>
              </svg>
            </div>
          </div>

          {/* Nash Equilibrium Status Bar */}
          <div className={`p-5 rounded-2xl border transition-all ${
            nashStatus.isNash
              ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/25 border-amber-500/40 text-amber-300'
          }`}>
            <div className="flex items-center gap-2 font-mono text-xs font-bold mb-1.5">
              {nashStatus.isNash ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span>{nashStatus.isNash ? 'NASH EQUILIBRIUM ACHIEVED' : 'UNSTABLE: PROFITABLE DEVIATION POSSIBLE'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {nashStatus.statusText}
            </p>
            {!nashStatus.isNash && nashStatus.deviations?.zepto && (
              <div className="text-xs font-mono text-amber-300 mt-2 pt-2 border-t border-amber-500/20">
                &bull; Zepto Best Response: <strong>₹{nashStatus.deviations.zepto.bestPrice}</strong> (Potential Gain: +₹{Math.round(nashStatus.deviations.zepto.potentialGain).toLocaleString()})
              </div>
            )}
          </div>

          {/* Round & Cumulative Profit Counters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-dark-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Round {currentRound} Profit</span>
              <div className={`text-2xl font-bold font-mono ${userResult.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₹<CountUp to={userResult.profit} />
              </div>
              <span className="text-xs text-slate-400 font-mono">Margin: {userResult.marginPercent}%</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-dark-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Cumulative Profit (Zepto)</span>
              <div className={`text-2xl font-bold font-mono ${cumulativeProfits['zepto'] >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                ₹<CountUp to={cumulativeProfits['zepto'] || 0} />
              </div>
              <span className="text-xs text-slate-400 font-mono">12-Round Aggregate</span>
            </div>
          </div>

        </div>

      </div>

      {/* Market Performance Breakdown Table (Spacious, legible padding) */}
      <div className="rounded-2xl border border-slate-800 bg-dark-900/90 p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white font-sans">
          Market Performance Across All 4 Quick Commerce Competitors
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3">Competitor Firm</th>
                <th className="py-3 px-3">Price Set</th>
                <th className="py-3 px-3">Unit Cost</th>
                <th className="py-3 px-3">Monthly Orders</th>
                <th className="py-3 px-3">Round Share</th>
                <th className="py-3 px-3">Round Profit</th>
                <th className="py-3 px-3">Cumulative Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {priceWarFirms.map(firm => {
                const res = currentResults[firm.id] || {};
                const cumProfit = cumulativeProfits[firm.id] || 0;

                return (
                  <tr key={firm.id} className="hover:bg-dark-800/40">
                    <td className="py-3.5 px-3 font-semibold text-white flex items-center gap-2.5">
                      <CompanyBrandIcon id={firm.id} className="w-5 h-5" showBg={false} />
                      <span>{firm.name} {firm.isUser && '(You)'}</span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-pink-400 text-sm">
                      ₹{(priceWarPrices[firm.id] || firm.basePrice).toFixed(1)}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">₹{firm.unitCost}</td>
                    <td className="py-3.5 px-3 text-white font-medium">
                      {Math.round(res.demand || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-cyan-400 font-bold">
                      {res.marketSharePercent || 0}%
                    </td>
                    <td className={`py-3.5 px-3 font-bold ${(res.profit || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ₹{Math.round(res.profit || 0).toLocaleString()}
                    </td>
                    <td className={`py-3.5 px-3 font-bold ${cumProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
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
