import React, { useState } from 'react';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import GradientText from '../reactbits/GradientText';
import {
  calculateArcDemandElasticity,
  calculatePointDemandElasticity,
  calculateSupplyElasticity,
  PRACTICE_PROBLEMS
} from '../../engine/elasticity';
import {
  Calculator,
  TrendingDown,
  TrendingUp,
  DollarSign,
  HelpCircle,
  Eye,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export default function ElasticityCalculatorView() {
  const [activeTab, setActiveTab] = useState('demand'); // 'demand' | 'supply' | 'practice'

  // Demand inputs (defaults to typical quick commerce delivery fee shift)
  const [demandP1, setDemandP1] = useState(25);
  const [demandP2, setDemandP2] = useState(35);
  const [demandQ1, setDemandQ1] = useState(50000);
  const [demandQ2, setDemandQ2] = useState(44000);

  // Supply inputs
  const [supplyP1, setSupplyP1] = useState(40);
  const [supplyP2, setSupplyP2] = useState(60);
  const [supplyQ1, setSupplyQ1] = useState(1500);
  const [supplyQ2, setSupplyQ2] = useState(2400);

  // Practice problem reveal states
  const [revealedSolutions, setRevealedSolutions] = useState({});

  const arcDemand = calculateArcDemandElasticity(demandP1, demandP2, demandQ1, demandQ2);
  const pointDemand = calculatePointDemandElasticity(demandP1, demandP2, demandQ1, demandQ2);
  const supplyRes = calculateSupplyElasticity(supplyP1, supplyP2, supplyQ1, supplyQ2);

  const toggleSolution = (id) => {
    setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const loadProblemIntoCalculator = (prob) => {
    if (prob.type === 'demand') {
      setActiveTab('demand');
      setDemandP1(prob.p1);
      setDemandP2(prob.p2);
      setDemandQ1(prob.q1);
      setDemandQ2(prob.q2);
    } else {
      setActiveTab('supply');
      setSupplyP1(prob.p1);
      setSupplyP2(prob.p2);
      setSupplyQ1(prob.q1);
      setSupplyQ2(prob.q2);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-6">
      
      {/* Title & Header - De-cramped with Generous Spacing */}
      <div className="space-y-4 pb-5 border-b border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
                  Elasticity Numerical Solver & Workshop
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Managerial Economics & Elasticity
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Solve Price Elasticity of Demand (PED) and Supply (PES) with step-by-step algebraic proofs, revenue tests, and practice problems.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher - Dedicated Toolbar */}
        <div className="flex items-center p-1 rounded-xl bg-dark-900 border border-slate-800 text-xs font-mono shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('demand')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'demand' ? 'bg-pink-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Price Elasticity of Demand (PED)
          </button>
          <button
            onClick={() => setActiveTab('supply')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'supply' ? 'bg-pink-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Elasticity of Supply (PES)
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'practice' ? 'bg-pink-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Practice Problems ({PRACTICE_PROBLEMS.length})
          </button>
        </div>
      </div>

      {/* DEMAND TAB */}
      {activeTab === 'demand' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left 5 Cols: Inputs */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-dark-900/90 p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-sans">
                Demand Variables (P₁, P₂, Q₁, Q₂)
              </h3>
              <span className="text-xs font-mono text-pink-400">Delivery Fee vs Orders</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-medium">Initial Price P₁ (₹):</label>
                <input
                  type="number"
                  value={demandP1}
                  onChange={(e) => setDemandP1(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white font-mono text-sm focus:border-pink-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-medium">New Price P₂ (₹):</label>
                <input
                  type="number"
                  value={demandP2}
                  onChange={(e) => setDemandP2(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-pink-400 font-bold font-mono text-sm focus:border-pink-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-medium">Initial Quantity Q₁:</label>
                <input
                  type="number"
                  value={demandQ1}
                  onChange={(e) => setDemandQ1(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white font-mono text-sm focus:border-pink-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-medium">New Quantity Q₂:</label>
                <input
                  type="number"
                  value={demandQ2}
                  onChange={(e) => setDemandQ2(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-cyan-400 font-bold font-mono text-sm focus:border-pink-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 block">Syllabus Quick Presets:</span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => { setDemandP1(25); setDemandP2(35); setDemandQ1(50000); setDemandQ2(44000); }}
                  className="px-3 py-1.5 rounded-lg bg-dark-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
                >
                  Inelastic Fee Hike
                </button>
                <button
                  onClick={() => { setDemandP1(40); setDemandP2(25); setDemandQ1(20000); setDemandQ2(38000); }}
                  className="px-3 py-1.5 rounded-lg bg-dark-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
                >
                  Elastic Discount War
                </button>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Results & Step-by-Step Proof */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Classification & Revenue Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SpotlightCard spotlightColor="rgba(236, 72, 153, 0.2)" className="p-5 border border-slate-800 bg-dark-900/90 rounded-2xl">
                <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Arc Elasticity (Midpoint)</span>
                <div className="text-3xl font-extrabold text-pink-400 font-mono">
                  Ed = {arcDemand.arcValue}
                </div>
                <div className="text-xs font-bold text-white mt-1">
                  |Ed| = {arcDemand.absoluteArc} &bull; <span className="text-pink-300">{arcDemand.classification}</span>
                </div>
              </SpotlightCard>

              <SpotlightCard spotlightColor="rgba(6, 182, 212, 0.2)" className="p-5 border border-slate-800 bg-dark-900/90 rounded-2xl">
                <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Total Revenue Test</span>
                <div className={`text-3xl font-extrabold font-mono ${arcDemand.revenueDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {arcDemand.revenueDelta >= 0 ? '+' : ''}₹{arcDemand.revenueDelta.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  TR₁: ₹{arcDemand.revenue1.toLocaleString()} → TR₂: ₹{arcDemand.revenue2.toLocaleString()}
                </div>
              </SpotlightCard>
            </div>

            {/* Step-by-step Algebraic Proof Card */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-dark-900/90 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-mono font-bold uppercase text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Step-by-Step Algebraic Midpoint Proof</span>
                </h4>
                <span className="text-xs font-mono text-slate-400">Allen & Lerner Formula</span>
              </div>

              <div className="space-y-2 font-mono text-xs text-slate-200">
                {arcDemand.steps.map((step, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl bg-dark-950 border border-slate-800/80 leading-relaxed">
                    {step}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 text-xs text-slate-300 space-y-1">
                <strong className="text-violet-400 font-mono block">Point Method Alternative: </strong>
                <span>{pointDemand.step}</span>
              </div>

              {/* Revenue Interpretation */}
              <div className="pt-2 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80">
                <strong className="text-white">Managerial Interpretation: </strong>
                {arcDemand.revenueInterpretation}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUPPLY TAB */}
      {activeTab === 'supply' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-dark-900/90 p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white font-sans border-b border-slate-800 pb-3">
              Supply Variables (P₁, P₂, Q₁, Q₂) - Delivery Rider Fleet
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-medium">P₁ (Base Payout ₹):</label>
                <input
                  type="number"
                  value={supplyP1}
                  onChange={(e) => setSupplyP1(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-medium">P₂ (Surge Payout ₹):</label>
                <input
                  type="number"
                  value={supplyP2}
                  onChange={(e) => setSupplyP2(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-emerald-400 font-bold font-mono text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-medium">Q₁ (Riders on Duty):</label>
                <input
                  type="number"
                  value={supplyQ1}
                  onChange={(e) => setSupplyQ1(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-medium">Q₂ (Riders on Duty):</label>
                <input
                  type="number"
                  value={supplyQ2}
                  onChange={(e) => setSupplyQ2(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-cyan-400 font-bold font-mono text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-dark-900/90 p-6 space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-white font-sans border-b border-slate-800 pb-3">
              Price Elasticity of Supply (PES) Assessment
            </h3>

            <div className="p-5 rounded-xl bg-dark-950 border border-slate-800 space-y-3">
              <div className="text-3xl font-bold font-mono text-emerald-400">
                Es = {supplyRes.arcPes}
              </div>
              <div className="text-sm font-bold text-white font-sans">
                {supplyRes.classification}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {supplyRes.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PRACTICE PROBLEMS TAB */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="text-sm font-mono text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Curated syllabus exam numericals based on Indian quick commerce pricing decisions:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRACTICE_PROBLEMS.map((prob) => {
              const isRevealed = revealedSolutions[prob.id];

              return (
                <SpotlightCard
                  key={prob.id}
                  spotlightColor="rgba(139, 92, 246, 0.2)"
                  className="p-6 border border-slate-800 bg-dark-900/90 space-y-5 flex flex-col justify-between rounded-2xl shadow-md"
                >
                  <div className="space-y-3">
                    <span className="text-xs uppercase font-mono px-2.5 py-1 rounded bg-violet-950 text-violet-300 border border-violet-500/30 inline-block font-semibold">
                      {prob.type === 'demand' ? 'Demand Numerical' : 'Supply Numerical'}
                    </span>
                    <h4 className="text-base font-bold text-white font-sans">{prob.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {prob.context}
                    </p>
                    <div className="p-3 rounded-xl bg-dark-950 border border-slate-800 font-mono text-xs text-cyan-300">
                      P₁ = ₹{prob.p1}, P₂ = ₹{prob.p2} &bull; Q₁ = {prob.q1.toLocaleString()}, Q₂ = {prob.q2.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => loadProblemIntoCalculator(prob)}
                        className="px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
                      >
                        Load in Solver
                      </button>

                      <button
                        onClick={() => toggleSolution(prob.id)}
                        className="px-3.5 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600 text-violet-200 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isRevealed ? 'Hide Solution' : 'Reveal Answer'}</span>
                      </button>
                    </div>

                    {isRevealed && (
                      <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200 font-mono leading-relaxed animate-in fade-in">
                        <strong className="block text-emerald-300 mb-1.5 font-sans">Worked Solution:</strong>
                        {prob.solutionSummary}
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
