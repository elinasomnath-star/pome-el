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
  RotateCcw
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
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight flex items-center gap-2">
              <Calculator className="w-7 h-7 text-pink-400" />
              <span>Elasticity Numerical Problem Solver (POME Unit IV)</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-pink-500/20 text-pink-300 border border-pink-500/30">
              Arc & Point Formulations
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Solve price elasticity of demand (PED) and supply (PES) with step-by-step worked algebraic proofs, revenue impacts, and textbook practice numericals.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-dark-800 border border-slate-700 text-xs font-mono">
          <button
            onClick={() => setActiveTab('demand')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'demand' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Price Elasticity of Demand (PED)
          </button>
          <button
            onClick={() => setActiveTab('supply')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'supply' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Elasticity of Supply (PES)
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'practice' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Practice Problems ({PRACTICE_PROBLEMS.length})
          </button>
        </div>
      </div>

      {/* DEMAND TAB */}
      {activeTab === 'demand' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 5 Cols: Inputs */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-dark-900/90 p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white font-sans border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Demand Variables (P1, P2, Q1, Q2)</span>
              <span className="text-[11px] font-mono text-pink-400">Delivery Fee vs Orders</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Initial Price P₁ (₹):</label>
                <input
                  type="number"
                  value={demandP1}
                  onChange={(e) => setDemandP1(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white font-mono text-sm focus:border-pink-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">New Price P₂ (₹):</label>
                <input
                  type="number"
                  value={demandP2}
                  onChange={(e) => setDemandP2(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-pink-400 font-bold font-mono text-sm focus:border-pink-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Initial Quantity Q₁:</label>
                <input
                  type="number"
                  value={demandQ1}
                  onChange={(e) => setDemandQ1(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white font-mono text-sm focus:border-pink-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">New Quantity Q₂:</label>
                <input
                  type="number"
                  value={demandQ2}
                  onChange={(e) => setDemandQ2(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-cyan-400 font-bold font-mono text-sm focus:border-pink-500"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Examples:</span>
              <button
                onClick={() => { setDemandP1(25); setDemandP2(35); setDemandQ1(50000); setDemandQ2(44000); }}
                className="px-2 py-1 rounded bg-dark-800 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-white"
              >
                Inelastic Fee Hike
              </button>
              <button
                onClick={() => { setDemandP1(40); setDemandP2(25); setDemandQ1(20000); setDemandQ2(38000); }}
                className="px-2 py-1 rounded bg-dark-800 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-white"
              >
                Elastic Discount
              </button>
            </div>
          </div>

          {/* Right 7 Cols: Results & Step-by-Step Proof */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Classification & Revenue Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <SpotlightCard spotlightColor="rgba(236, 72, 153, 0.2)" className="p-4 border border-slate-800 bg-dark-800/90">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Arc Elasticity (Midpoint)</span>
                <div className="text-2xl font-extrabold text-pink-400 font-mono">
                  Ed = {arcDemand.arcValue}
                </div>
                <div className="text-xs font-bold text-white mt-1">
                  |Ed| = {arcDemand.absoluteArc} &bull; {arcDemand.classification}
                </div>
              </SpotlightCard>

              <SpotlightCard spotlightColor="rgba(6, 182, 212, 0.2)" className="p-4 border border-slate-800 bg-dark-800/90">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Total Revenue Impact</span>
                <div className={`text-2xl font-extrabold font-mono ${arcDemand.revenueDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {arcDemand.revenueDelta >= 0 ? '+' : ''}₹{arcDemand.revenueDelta.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  TR₁: ₹{arcDemand.revenue1.toLocaleString()} → TR₂: ₹{arcDemand.revenue2.toLocaleString()}
                </div>
              </SpotlightCard>
            </div>

            {/* Step-by-step Algebraic Proof Card */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-dark-900/90 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Step-by-Step Algebraic Solution</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Arc & Point Comparison</span>
              </div>

              <div className="space-y-1.5 font-mono text-xs text-slate-300">
                {arcDemand.steps.map((step, sIdx) => (
                  <div key={sIdx} className="p-2 rounded-lg bg-dark-950 border border-slate-800/80">
                    {step}
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/30 text-xs text-slate-300 space-y-1">
                <strong className="text-violet-400 font-mono">Point Method Alternative: </strong>
                <span>{pointDemand.step}</span>
              </div>

              {/* Revenue Interpretation */}
              <p className="text-xs text-slate-400 italic pt-1 leading-relaxed">
                <strong>Managerial Takeaway: </strong>{arcDemand.revenueInterpretation}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* SUPPLY TAB */}
      {activeTab === 'supply' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-dark-900/90 p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white font-sans border-b border-slate-800 pb-2">
              Supply Variables (P1, P2, Q1, Q2) - Rider Fleet Labor
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">P₁ (Rider Incentive ₹):</label>
                <input
                  type="number"
                  value={supplyP1}
                  onChange={(e) => setSupplyP1(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">P₂ (Rider Incentive ₹):</label>
                <input
                  type="number"
                  value={supplyP2}
                  onChange={(e) => setSupplyP2(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-emerald-400 font-bold font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Q₁ (Riders on Duty):</label>
                <input
                  type="number"
                  value={supplyQ1}
                  onChange={(e) => setSupplyQ1(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Q₂ (Riders on Duty):</label>
                <input
                  type="number"
                  value={supplyQ2}
                  onChange={(e) => setSupplyQ2(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-cyan-400 font-bold font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-dark-900/90 p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white font-sans border-b border-slate-800 pb-2">
              Price Elasticity of Supply (PES) Result
            </h3>

            <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-2">
              <div className="text-2xl font-bold font-mono text-emerald-400">
                Es = {supplyRes.arcPes}
              </div>
              <div className="text-xs font-bold text-white font-sans">
                {supplyRes.classification}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {supplyRes.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PRACTICE PROBLEMS TAB */}
      {activeTab === 'practice' && (
        <div className="space-y-4">
          <div className="text-xs font-mono text-slate-400">
            Curated syllabus exam numericals based on Indian quick commerce pricing decisions:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PRACTICE_PROBLEMS.map((prob) => {
              const isRevealed = revealedSolutions[prob.id];

              return (
                <SpotlightCard
                  key={prob.id}
                  spotlightColor="rgba(139, 92, 246, 0.2)"
                  className="p-5 border border-slate-800 bg-dark-900/90 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-500/30">
                      {prob.type === 'demand' ? 'Demand Numerical' : 'Supply Numerical'}
                    </span>
                    <h4 className="text-sm font-bold text-white font-sans">{prob.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {prob.context}
                    </p>
                    <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800 font-mono text-[11px] text-cyan-300">
                      P₁ = ₹{prob.p1}, P₂ = ₹{prob.p2} &bull; Q₁ = {prob.q1.toLocaleString()}, Q₂ = {prob.q2.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => loadProblemIntoCalculator(prob)}
                        className="px-2.5 py-1.5 rounded-lg bg-dark-800 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-white"
                      >
                        Load in Solver
                      </button>

                      <button
                        onClick={() => toggleSolution(prob.id)}
                        className="px-3 py-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600 text-violet-200 font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isRevealed ? 'Hide Solution' : 'Reveal Answer'}</span>
                      </button>
                    </div>

                    {isRevealed && (
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200 font-mono leading-relaxed animate-in fade-in">
                        <strong className="block text-emerald-300 mb-1">Worked Solution:</strong>
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
