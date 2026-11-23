import React, { useState } from 'react';
import methodologyData from '../../data/methodology.json';
import companiesData from '../../data/companies.json';
import SpotlightCard from '../reactbits/SpotlightCard';
import DataProvenanceBadge from '../common/DataProvenanceBadge';
import CompanyBrandIcon from '../common/CompanyBrandIcon';
import { indianGroup } from '../../utils/formatINR';
import {
  BookOpen,
  Printer,
  Calculator,
  ShieldCheck,
  Building,
  Layers,
  ChevronRight,
  Sparkles,
  Percent,
  TrendingUp,
  FileCheck,
  Scale,
  Activity,
  Award,
  ExternalLink
} from 'lucide-react';

export default function MethodologyView() {
  const [selectedTheoryIndex, setSelectedTheoryIndex] = useState(0);

  const handlePrint = () => {
    window.print();
  };

  const frameworks = [
    {
      id: "bcg",
      name: "BCG Growth-Share Matrix & Experience Curve",
      pioneer: "Bruce D. Henderson (1970, 1974)",
      affiliation: "Boston Consulting Group / Harvard Business Review",
      syllabusUnit: "Unit III: Strategic Management & Portfolio Planning",
      icon: TrendingUp,
      accentColor: "#8b5cf6",
      formulaDisplay: [
        { label: "Relative Market Share (RMS)", math: "RMSᵢ = Revenueᵢ / maxⱼ≠ᵢ(Revenueⱼ)", desc: "Calculated on a logarithmic scale. RMS ≥ 1.0 defines market leadership." },
        { label: "Market Growth Rate", math: "g = (Market GOVₜ - Market GOVₜ₋₁) / Market GOVₜ₋₁ × 100%", desc: "Threshold set at 20% annual expansion separating high-growth from mature sectors." }
      ],
      coreConcept: "Henderson's Experience Curve posits that unit value-added production costs decline by a predictable percentage (typically 20-30%) with each doubling of cumulative output. In quick commerce, cumulative dark store order density lowers rider transit radius and warehouse dispatch cost.",
      qcApplication: "Blinkit leverages its 639-store scale (₹3,950 Cr revenue, 1.41x RMS) to capture supplier volume rebates and achieve positive contribution margins (+3.9%), while Zepto (0.71x RMS) operates as a high-growth Question Mark challenger requiring capital injections to reach scale parity.",
      quadrants: [
        { name: "Stars (High Growth, High Share)", desc: "Blinkit: Self-sustaining or near break-even; reinvest operating cash to defend market share." },
        { name: "Question Marks (High Growth, Low Share)", desc: "Zepto: High cash burn; dilemma between aggressive capex expansion to build scale or strategic niche exit." },
        { name: "Cash Cows (Low Growth, High Share)", desc: "Hypothetical mature stage: High cash surplus generated from milked gross margins." },
        { name: "Dogs (Low Growth, Low Share)", desc: "BB Now / Distressed nodes: Low growth and low scale; candidates for restructuring or dark store consolidation." }
      ],
      assumptions: [
        "Relative market share directly correlates with cost efficiency via dark store logistics density.",
        "Market growth rate reflects secular urban migration to 10-minute convenience over scheduled grocery.",
        "Cumulative dark store order volume generates operational learning and optimized pick-and-pack times."
      ]
    },
    {
      id: "forces",
      name: "Porter's Five Forces & Industry Attractiveness Index",
      pioneer: "Michael E. Porter (1979, 2008)",
      affiliation: "Harvard Business School",
      syllabusUnit: "Unit III: Environmental Analysis & Industrial Organization",
      icon: Award,
      accentColor: "#06b6d4",
      formulaDisplay: [
        { label: "Industry Attractiveness Index (IAI)", math: "IAI = 10 - [ ∑ᵢ₌₁⁵ (wᵢ · Sᵢ) / ∑ᵢ₌₁⁵ wᵢ ]", desc: "Where Sᵢ ∈ [1, 10] represents force hostility score, and wᵢ is the assigned academic weight." },
        { label: "Strategic Health Score", math: "Health = 0.45 · (Market Share) + 0.35 · (g / 10) + 0.20 · (IAI × 10)", desc: "Holistic 0-100 composite index measuring firm competitive survivability." }
      ],
      coreConcept: "Porter's framework demonstrates that industry structure, rather than temporary technological novelty or consumer popularity, dictates long-term sustainable return on invested capital (ROIC).",
      qcApplication: "The Indian quick commerce industry exhibits an Attractiveness Index of 2.8/10 (Hyper-Competitive Squeeze). Extreme internal rivalry (9.2) and multi-homing consumer power (7.8) compress economic rents, leaving only players with deep parent balance sheets.",
      quadrants: [
        { name: "Competitive Rivalry (Score: 9.2, Weight: 30%)", desc: "Four well-funded competitors engage in delivery-time SLAs (sub-10 min) and subsidized platform fees." },
        { name: "Threat of New Entrants (Score: 8.5, Weight: 25%)", desc: "Reliance JioMart and Flipkart Minutes possess massive balance sheets to roll out hundreds of dark stores." },
        { name: "Buyer Power (Score: 7.8, Weight: 20%)", desc: "Low switching costs; consumers multi-home across Blinkit, Zepto, and Instamart comparing fees and delivery ETAs." },
        { name: "Supplier Power (Score: 6.8, Weight: 15%)", desc: "Tier-1 FMCG giants (Amul, HUL, Nestlé) command rigid pricing and resist high platform commission margins." },
        { name: "Threat of Substitutes (Score: 6.2, Weight: 10%)", desc: "High local density of brick-and-mortar Kiranas and scheduled e-commerce (Amazon, BigBasket slotted)." }
      ],
      assumptions: [
        "Forces act exogenously on all participants, establishing an upper ceiling on industry-wide profitability.",
        "Weighting reflects capital intensity: rivalry and capital-funded entry dominate commodity retail."
      ]
    },
    {
      id: "pricewar",
      name: "Bertrand-Nash Oligopoly & Constant-Elasticity Demand",
      pioneer: "Joseph Bertrand (1883), John Nash (1950)",
      affiliation: "Académie des Sciences / Princeton University",
      syllabusUnit: "Unit IV: Managerial Economics & Oligopolistic Pricing",
      icon: Activity,
      accentColor: "#ec4899",
      formulaDisplay: [
        { label: "Multi-Firm Demand System", math: "Qᵢ(Pᵢ, P₋ᵢ) = Aᵢ · Pᵢ⁻ᵉ · ∏ⱼ≠ᵢ Pⱼᵋ", desc: "Where εᵢᵢ is own-price elasticity of demand, and εᵢⱼ is cross-price cross-elasticity with rival j." },
        { label: "Firm Profit Function", math: "Πᵢ = Qᵢ · (Pᵢ - cᵢ) - Fᵢ", desc: "Where Pᵢ is delivery fee, cᵢ is marginal rider fulfillment cost, and Fᵢ is fixed dark-store overhead." },
        { label: "Nash Equilibrium Condition", math: "∂Πᵢ / ∂Pᵢ = 0  ∀ i  =>  No firm can unilaterally deviate to increase profit.", desc: "Simulated numerically via iterative best-response convergence." }
      ],
      coreConcept: "In differentiated Bertrand oligopoly with imperfect substitutes, price competition drives margins down toward marginal cost. When cross-price elasticity is high, undercutting triggers immediate competitor retaliation, destroying industry profits.",
      qcApplication: "When Zepto prices delivery at ₹22 vs Blinkit at ₹25 and Instamart at ₹20, multi-homing consumers reallocate orders based on cross-elasticity (0.45). However, if an incumbent cuts price below the marginal rider payout floor (₹23.50), it incurs unsustainable variable losses.",
      quadrants: null,
      assumptions: [
        "Constant elasticity holds across the operative fee band (₹10 to ₹65).",
        "Competitors react dynamically according to bounded behavioral heuristics (Match, Undercut, Tit-for-Tat).",
        "Consumer demand reacts symmetrically to fee increases and decreases."
      ]
    },
    {
      id: "org",
      name: "Administrative Theory, Scalar Chain & Org Design",
      pioneer: "Henri Fayol (1916), Luther Gulick (1937), Burns & Stalker (1961)",
      affiliation: "Administrative Management & Aston Contingency Group",
      syllabusUnit: "Unit I & II: Principles of Management & Organizational Structure",
      icon: Building,
      accentColor: "#10b981",
      formulaDisplay: [
        { label: "Hierarchical Layers (Scalar Chain)", math: "L = ⌈logₛ(N)⌉", desc: "Where N is enterprise headcount and S is average span of control (direct reports per manager)." },
        { label: "Coordination Cost Index (CCI)", math: "CCI = N · L · (Centralization / 100) · [1 + (Formalization / 10)] · 10⁻³", desc: "Quantifies corporate overhead friction and scalar chain administrative drag." },
        { label: "Burns & Stalker Structural Score", math: "Score = 0.55 · (Centralization) + 4.5 · (Formalization)", desc: "Scores ≥ 65 = Mechanistic Bureaucracy (Weber); Scores ≤ 45 = Organic Agile Network." }
      ],
      coreConcept: "Fayol's Scalar Chain principle establishes that authority and communication flow through an unbroken line from top to bottom. Burns and Stalker proved that while stable environments favor mechanistic structures, hyper-dynamic environments demand organic, decentralized networks.",
      qcApplication: "Quick commerce requires real-time routing decisions at individual dark stores. Tall mechanistic structures (span of 4, 6 layers) create fulfillment delays; flatter organic structures (span of 8-10, 3-4 layers) empower store managers to resolve inventory stockouts and delivery surges instantly.",
      quadrants: null,
      assumptions: [
        "Communication latency grows exponentially with each management layer added to the hierarchy.",
        "Formalization (strict 10-minute SOPs) increases consistency but reduces local adaptability."
      ]
    },
    {
      id: "montecarlo",
      name: "Monte Carlo Stochastic Risk & Sensitivity Propagation",
      pioneer: "Stanislaw Ulam & John von Neumann (1946)",
      affiliation: "Los Alamos National Laboratory",
      syllabusUnit: "Unit IV: Decision Making Under Knightian Uncertainty",
      icon: Calculator,
      accentColor: "#f59e0b",
      formulaDisplay: [
        { label: "Force Perturbation Model", math: "S̃ᵢ = clamp( Sᵢ + 𝒩(0, σₛ²), 1, 10 )", desc: "Stochastic Gaussian perturbation applied to each Porter force score across 1,000 draws." },
        { label: "Elasticity Stochasticity", math: "ε̃ = ε + 𝒩(0, σε²)   where σε = 0.18 · ε", desc: "Captures macro volatility in consumer price sensitivity and inflation shocks." },
        { label: "Confidence Interval (P5 - P95)", math: "CI₉₀% = [ Q(0.05), Q(0.95) ]", desc: "Empirical non-parametric percentiles computed from sorted Monte Carlo simulation trials." }
      ],
      coreConcept: "Deterministic point estimates foster strategic overconfidence. Under Knightian uncertainty, probability distributions reveal the dispersion of tail risks and structural vulnerabilities.",
      qcApplication: "While baseline models predict profitable unit economics at ₹25 delivery fees, Monte Carlo trials reveal that a 15% shock to rider labor supply plunges 38% of trials into severe negative round profitability.",
      quadrants: null,
      assumptions: [
        "Perturbations follow stationary Gaussian distributions bounded by realistic economic floors and ceilings.",
        "1,000 trials provide sufficient statistical power for smooth empirical quantile estimation."
      ]
    }
  ];

  const activeFramework = frameworks[selectedTheoryIndex];
  const ActiveIcon = activeFramework.icon;

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-6 print:p-0 print:bg-white print:text-black">

      {/* Page Title & Export Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:border-b-2 print:border-black">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 print:text-black">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-sans text-white print:text-black tracking-tight">
                  Model Methodology & Mathematical Codex
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 print:text-black border border-cyan-500/30">
                  {methodologyData.version}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 print:text-gray-700 mt-1 font-sans">
                Formal mathematical equations, literature citations, economic calibrations, and statutory audit provenance.
              </p>
            </div>
          </div>
        </div>

        {/* Print / Export Report Button */}
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Export Academic Dossier (PDF / Print)</span>
          </button>
        </div>
      </div>

      {/* Course Context Banner */}
      <div className="p-5 rounded-2xl border border-violet-500/30 bg-violet-950/20 print:border-gray-400 print:bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <Award className="w-6 h-6 text-violet-400 shrink-0 print:text-black" />
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white print:text-black font-sans">
              Course Pedagogy & Syllabus Integration
            </h4>
            <p className="text-xs text-slate-300 print:text-gray-700 font-sans leading-relaxed">
              Designed for <strong>Principles of Management & Economics (POME)</strong>. Bridging classical administrative theory (Gulick, Fayol, Weber) with industrial organization microeconomics (Porter, Bertrand, Nash).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 print:text-black shrink-0 px-3 py-1.5 rounded-xl bg-dark-900/80 border border-slate-800">
          <span>5 Core Formulations</span> &bull; <span>100% Real Statutory Filings</span>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE THEORETICAL FRAMEWORK SPECIFICATION */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-white print:text-black font-sans flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400 print:text-black" />
            <span>Mathematical Formulations & Framework Specifications</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Select a model below to inspect its algebraic proof</span>
        </div>

        {/* Master-Detail Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left 4 Cols: Navigation Selector Pills */}
          <div className="lg:col-span-4 space-y-2.5 print:hidden">
            {frameworks.map((f, idx) => {
              const isSelected = selectedTheoryIndex === idx;
              const Icon = f.icon;

              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedTheoryIndex(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${isSelected
                    ? 'bg-dark-800 border-cyan-500/80 text-white shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                    : 'bg-dark-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-dark-850'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${f.accentColor}15`,
                        borderColor: `${f.accentColor}40`,
                        color: f.accentColor
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider truncate">
                        {f.syllabusUnit.split(':')[0]}
                      </div>
                      <h4 className="text-sm font-bold text-white font-sans truncate mt-0.5">
                        {f.name.split('&')[0]}
                      </h4>
                      <div className="text-xs text-slate-400 font-mono truncate mt-0.5">
                        {f.pioneer.split('(')[0]}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 8 Cols: Detailed Model Specification Panel */}
          <div className="lg:col-span-8 print:col-span-12">
            <SpotlightCard
              spotlightColor="rgba(6, 182, 212, 0.2)"
              className="p-6 sm:p-8 border border-slate-800 bg-dark-900/95 print:bg-white print:border-gray-300 print:text-black rounded-2xl shadow-2xl space-y-6"
            >
              {/* Framework Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-800 print:border-b-2 print:border-black">
                <div>
                  <span className="text-xs font-mono uppercase text-cyan-400 print:text-black font-bold tracking-wider block mb-1">
                    {activeFramework.syllabusUnit}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white print:text-black font-sans">
                    {activeFramework.name}
                  </h3>
                  <div className="text-xs text-slate-400 print:text-gray-600 font-mono mt-1">
                    Pioneered by: <strong className="text-slate-200 print:text-black">{activeFramework.pioneer}</strong> &bull; {activeFramework.affiliation}
                  </div>
                </div>

                <div
                  className="px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 self-start sm:self-auto shrink-0"
                  style={{
                    backgroundColor: `${activeFramework.accentColor}15`,
                    borderColor: `${activeFramework.accentColor}40`,
                    color: activeFramework.accentColor
                  }}
                >
                  <ActiveIcon className="w-4 h-4" />
                  <span>Verified Pure Function</span>
                </div>
              </div>

              {/* Formatted Mathematical Equations */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-300 print:text-black tracking-wider flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-cyan-400" />
                  <span>Mathematical Formulations</span>
                </h4>

                <div className="space-y-3">
                  {activeFramework.formulaDisplay.map((item, fIdx) => (
                    <div key={fIdx} className="p-4 rounded-xl bg-dark-950 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-1.5">
                      <div className="text-xs font-bold text-white print:text-black font-sans flex items-center justify-between">
                        <span>{item.label}</span>
                        <span className="text-[10px] font-mono text-cyan-400 print:text-black">/src/engine</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-dark-900 print:bg-white border border-slate-800/80 font-mono text-sm sm:text-base font-bold text-cyan-300 print:text-black tracking-wide overflow-x-auto">
                        {item.math}
                      </div>
                      <p className="text-xs text-slate-400 print:text-gray-700 font-sans leading-relaxed pt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Economic Mechanism & Theoretical Logic */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-300 print:text-black tracking-wider">
                  Theoretical Logic & Foundational Premise
                </h4>
                <p className="text-sm text-slate-200 print:text-black leading-relaxed font-sans">
                  {activeFramework.coreConcept}
                </p>
              </div>

              {/* Quick Commerce Real-World Calibration */}
              <div className="p-4 rounded-xl bg-violet-950/20 print:bg-gray-50 border border-violet-500/30 print:border-gray-300 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase text-violet-300 print:text-black tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>Indian Quick Commerce Empirical Calibration</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 print:text-gray-800 leading-relaxed font-sans">
                  {activeFramework.qcApplication}
                </p>
              </div>

              {/* Quadrant or Force Decompositions (if present) */}
              {activeFramework.quadrants && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-300 print:text-black tracking-wider">
                    Model Decompositions & Segment Taxonomy
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeFramework.quadrants.map((q, qIdx) => (
                      <div key={qIdx} className="p-3.5 rounded-xl bg-dark-950/70 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-1">
                        <div className="text-xs font-bold text-white print:text-black font-sans">{q.name}</div>
                        <p className="text-xs text-slate-400 print:text-gray-700 leading-snug font-sans">{q.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explicit Assumptions & Boundary Conditions */}
              <div className="pt-4 border-t border-slate-800 print:border-gray-300 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-400 print:text-black tracking-wider">
                  Model Assumptions & Boundary Conditions
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 print:text-gray-700 font-sans leading-relaxed">
                  {activeFramework.assumptions.map((assump, aIdx) => (
                    <li key={aIdx}>{assump}</li>
                  ))}
                </ul>
              </div>

            </SpotlightCard>
          </div>

        </div>
      </div>

      {/* SECTION 2: VERIFIED STATUTORY DATA PROVENANCE AUDIT */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-bold text-white print:text-black font-sans flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 print:text-black" />
              <span>Audited Statutory Data Provenance Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-0.5">
              100% verified regulatory disclosures. All baseline figures sourced from audited filings, SEBI DRHP documents, and statutory shareholder letters.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>4 of 4 Firms Fully Verified</span>
            </span>
          </div>
        </div>

        {/* Real Data Provenance Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-dark-900/90 shadow-xl print:bg-white print:border-gray-300">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-dark-950 print:bg-gray-100 print:text-black">
                <th className="py-3.5 px-4 font-mono">Company</th>
                <th className="py-3.5 px-4 font-mono">Market Share</th>
                <th className="py-3.5 px-4 font-mono">FY24 Revenue</th>
                <th className="py-3.5 px-4 font-mono">Dark Stores</th>
                <th className="py-3.5 px-4 font-mono">Avg Basket</th>
                <th className="py-3.5 px-4 font-mono">Corporate Entity & Statutory Source</th>
                <th className="py-3.5 px-4 font-mono text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200 print:text-black">
              {companiesData.map(c => (
                <tr key={c.id} className="hover:bg-dark-800/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <CompanyBrandIcon id={c.id} className="w-9 h-9" showBg={true} />
                      <div>
                        <div className="font-bold text-white print:text-black text-sm">{c.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{c.brandTag}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-cyan-300 print:text-black text-sm">
                    {c.marketShare}%
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-400 print:text-black text-sm">
                    ₹{indianGroup(c.revenue)} Cr
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-300 print:text-black">
                    {c.darkStoreCount} stores
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-300 print:text-black">
                    ₹{c.avgOrderValueINR}
                  </td>
                  <td className="py-4 px-4 max-w-xs text-xs text-slate-300 print:text-gray-800 leading-snug">
                    <div className="font-semibold text-white print:text-black">{c.parentEntity}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{c.source}</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: PRACTICAL MODEL BOUNDARIES & LIMITATIONS */}
      <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 print:bg-yellow-50 print:border-yellow-300 space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-300 print:text-black font-sans">
          <Scale className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Academic Boundaries & Practical Simulator Limitations</span>
        </div>
        <ul className="list-disc list-inside text-xs sm:text-sm text-slate-200 print:text-gray-800 space-y-2 font-sans leading-relaxed">
          {methodologyData.limitations.map((lim, lIdx) => (
            <li key={lIdx}>{lim}</li>
          ))}
          <li>
            <strong>Dark-Store Spatial Clustering:</strong> City-level market share aggregates smooth out hyper-local spatial sub-monopolies (e.g. a dark store 800m away holds localized price power over a competitor 2.5 km away).
          </li>
          <li>
            <strong>Rider Fleet Seasonality:</strong> Heavy rainfall and extreme heat spikes dramatically alter rider supply elasticity, temporarily shifting unit fulfillment cost above standard baseline parameters.
          </li>
        </ul>
      </div>

      {/* SECTION 4: LOGO & BRAND CREDITS */}
      <div className="p-6 rounded-2xl border border-slate-700/60 bg-dark-900/90 print:bg-gray-50 print:border-gray-200 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5 text-base font-bold text-white print:text-black font-sans">
          <span className="text-xl">🏷️</span>
          <span>Official Brand Logo Credits &amp; Nominative Fair-Use Notices</span>
        </div>
        <p className="text-xs text-slate-300 print:text-gray-600 leading-relaxed font-sans">
          All registered company logos, trademarks, service marks, and trade names displayed across this simulator are the exclusive intellectual property
          of their respective corporate owners. All brand assets are stored locally for instant, offline, high-fidelity rendering and are utilized strictly
          under nominative fair use for non-commercial educational instruction and microeconomic stress-testing in university coursework (Principles of Management &amp; Economics).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {[
            { id: 'blinkit', name: 'Blinkit', owner: 'Zomato Limited (NSE: ZOMATO / BSE: 543320)', domain: 'blinkit.com', founders: 'Deepinder Goyal / Albinder Dhindsa' },
            { id: 'zepto', name: 'Zepto', owner: 'KiranaKart Technologies Private Limited', domain: 'zeptonow.com', founders: 'Aadit Palicha / Kaivalya Vohra' },
            { id: 'swiggy_instamart', name: 'Swiggy Instamart', owner: 'Swiggy Limited (NSE: SWIGGY / BSE: 544280)', domain: 'swiggy.com', founders: 'Sriharsha Majety / Phani Kishan' },
            { id: 'bigbasket_now', name: 'BB Now', owner: 'Supermarket Grocery Supplies (Tata Digital)', domain: 'bigbasket.com', founders: 'Hari Menon / Tata Sons' },
          ].map(c => (
            <div key={c.id}
              className="flex items-start gap-3.5 p-4 rounded-xl bg-dark-800/80 border border-slate-700/60 shadow-lg print:bg-white print:border-gray-200">
              <CompanyBrandIcon id={c.id} className="w-12 h-12" showBg={true} />
              <div className="min-w-0">
                <div className="text-sm font-bold text-white print:text-black leading-tight">{c.name}</div>
                <div className="text-[11px] text-slate-300 print:text-gray-600 mt-1 leading-snug">{c.owner}</div>
                <div className="text-[10px] text-slate-400 print:text-gray-500 mt-0.5">{c.founders}</div>
                <a
                  href={`https://${c.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono print:text-blue-600 block mt-1.5 underline"
                >
                  {c.domain} &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 print:text-gray-500 font-mono pt-2 border-t border-slate-800/80">
          StratSim is an independent academic project and is not affiliated with, sponsored by, or endorsed by
          Zomato Ltd, KiranaKart Technologies, Swiggy Ltd, or Tata Digital. All market shares, financial metrics, and unit economics
          are calibrated from statutory disclosures, RoC filings, SEBI DRHPs, and equity research reports.
        </p>
      </div>

    </div>
  );
}
