import React, { useState } from 'react';
import methodologyData from '../../data/methodology.json';
import SpotlightCard from '../reactbits/SpotlightCard';
import DataProvenanceBadge from '../common/DataProvenanceBadge';
import {
  BookOpen,
  Printer,
  FileDown,
  Calculator,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  Code,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';

export default function MethodologyView() {
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'strategy' | 'economics' | 'org'

  const handlePrint = () => {
    window.print();
  };

  const categorizedTheories = methodologyData.theories.filter(theory => {
    if (selectedCategory === 'strategy') {
      return theory.name.includes('BCG') || theory.name.includes('Five Forces') || theory.name.includes('Generic');
    }
    if (selectedCategory === 'economics') {
      return theory.name.includes('Bertrand') || theory.name.includes('Elasticity') || theory.name.includes('Experience');
    }
    if (selectedCategory === 'org') {
      return theory.name.includes('Administrative') || theory.name.includes('Mechanistic') || theory.name.includes('POSDCORB');
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0 print:bg-white print:text-black">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 print:border-b-2 print:border-black">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 print:text-black">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white print:text-black tracking-tight">
                  Model Methodology, Formulations & Assumptions
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 print:text-black border border-cyan-500/30">
                  {methodologyData.version}
                </span>
              </div>
              <p className="text-sm text-slate-400 print:text-gray-700 mt-1">
                Complete mathematical specifications, literature citations, and parameter calibration guidelines.
              </p>
            </div>
          </div>
        </div>

        {/* Export Report / Print Button */}
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Export Report (Print / PDF)</span>
          </button>
        </div>
      </div>

      {/* Course Framing Banner */}
      <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-950/20 print:border-gray-300 print:bg-gray-50 text-xs sm:text-sm text-slate-300 print:text-black flex items-center gap-3">
        <Calculator className="w-5 h-5 text-violet-400 shrink-0" />
        <div>
          <strong>Academic Pedagogy: </strong>
          Designed for {methodologyData.courseContext}. Integrates Microeconomic Market Structure Theory with Strategic Management and Organizational Behavior.
        </div>
      </div>

      {/* Data Quality & Provenance Audit */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-dark-900/90 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Data Provenance & Quality Audit Summary</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Transparent classification of all quantitative parameters across statutory filings, equity research, and placeholder estimates.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">1 Verified Filing</span>
            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">1 DRHP Estimate</span>
            <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">2 Research Placeholders</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-dark-950/80 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">Verified Statutory Data</span>
              <DataProvenanceBadge type="verified" year="2024" confidence="high" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Blinkit FY24 financials (₹3,950 Cr, 639 dark stores) sourced from Zomato Ltd statutory shareholder letters and audited filings.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-950/80 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">Research Carve-Out Estimates</span>
              <DataProvenanceBadge type="estimate" year="2024" confidence="medium" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Swiggy Instamart segment numbers (₹2,350 Cr, 23% share) derived from Swiggy Ltd's 2024 IPO Draft Red Herring Prospectus (DRHP).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-950/80 border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400">Tagged Placeholders</span>
              <DataProvenanceBadge type="placeholder" year="2024" confidence="medium" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Zepto (unlisted startup pitch decks) and BB Now (Tata Digital scheduled vs quick split) are explicitly tagged for replacement upon audited RoC filings.
            </p>
          </div>
        </div>
      </div>

      {/* Theoretical Formulations with Progressive Disclosure Category Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white print:text-black font-sans">
              Core Mathematical Formulations & Framework References
            </h3>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-0.5">
              Formulas implemented in pure functions under <code className="text-cyan-300 font-mono">/src/engine</code>.
            </p>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-dark-800 border border-slate-700 text-xs font-mono print:hidden">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === 'all' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Formulations
            </button>
            <button
              onClick={() => setSelectedCategory('strategy')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === 'strategy' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Strategy & Forces
            </button>
            <button
              onClick={() => setSelectedCategory('economics')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === 'economics' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Economics & Pricing
            </button>
            <button
              onClick={() => setSelectedCategory('org')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === 'org' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Org Architecture
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categorizedTheories.map((theory, idx) => (
            <SpotlightCard
              key={idx}
              spotlightColor="rgba(6, 182, 212, 0.15)"
              className="p-6 border border-slate-800 bg-dark-900/90 print:bg-white print:border-gray-300 print:text-black space-y-4 rounded-2xl shadow-md"
            >
              <div className="flex items-start justify-between">
                <h4 className="text-base font-bold text-white print:text-black font-sans">
                  {theory.name}
                </h4>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-dark-800 print:bg-gray-200 text-cyan-300 print:text-black border border-slate-700">
                  {theory.pioneer.split(',')[0]}
                </span>
              </div>

              <div className="text-xs text-slate-400 print:text-gray-600 font-mono">
                Pioneering Thinker: {theory.pioneer}
              </div>

              {/* Formula Block */}
              <div className="p-3.5 rounded-xl bg-dark-950 print:bg-gray-100 border border-slate-800 print:border-gray-300 font-mono text-xs text-cyan-300 print:text-black leading-relaxed">
                {theory.formula}
              </div>

              {/* Explanations or Quadrants */}
              {theory.quadrants ? (
                <div className="space-y-2 pt-1 text-xs text-slate-300 print:text-black">
                  {Object.entries(theory.quadrants).map(([quad, desc]) => (
                    <div key={quad} className="text-xs leading-snug">
                      <strong className="text-white print:text-black">{quad}: </strong>
                      <span className="text-slate-400 print:text-gray-700">{desc}</span>
                    </div>
                  ))}
                </div>
              ) : theory.interpretation ? (
                <p className="text-xs text-slate-300 print:text-black leading-relaxed">
                  {theory.interpretation}
                </p>
              ) : theory.nashEquilibrium ? (
                <p className="text-xs text-slate-300 print:text-black leading-relaxed">
                  {theory.nashEquilibrium}
                </p>
              ) : theory.contingencySpectrum ? (
                <p className="text-xs text-slate-300 print:text-black leading-relaxed">
                  {theory.contingencySpectrum}
                </p>
              ) : null}

              {/* Underlying Assumptions */}
              <div className="pt-3 border-t border-slate-800 print:border-gray-300 text-xs text-slate-400 print:text-gray-600 font-mono">
                <strong className="text-slate-300 print:text-black">Core Assumption:</strong> {theory.assumptions}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      {/* Model Limitations Notice */}
      <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 print:bg-yellow-50 print:border-yellow-300 space-y-2.5">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-300 print:text-black font-sans">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>Model Boundaries & Practical Limitations</span>
        </div>
        <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 print:text-gray-800 space-y-1.5 font-sans leading-relaxed">
          {methodologyData.limitations.map((lim, lIdx) => (
            <li key={lIdx}>{lim}</li>
          ))}
        </ul>
      </div>

      {/* Academic Audit & Data Provenance Notice */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-dark-900/60 print:bg-white text-xs sm:text-sm text-slate-300 print:text-black space-y-2.5">
        <h4 className="text-base font-bold text-white print:text-black font-sans">
          Academic Research Compliance Notice
        </h4>
        <p className="leading-relaxed">
          In compliance with academic standards for management pedagogy, baseline figures are derived from publicly filed Q4 FY24 shareholder earnings disclosures (Zomato Ltd), IPO draft prospectuses (Swiggy Limited DRHP 2024), and curated research (Bernstein, JM Financial, Redseer). Where proprietary dark-store allocation figures are estimated, they carry an explicit <strong className="text-cyan-400">[PLACEHOLDER]</strong> label in <code className="bg-dark-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono">/src/data/*.json</code> and must be verified against future statutory audits.
        </p>
      </div>

    </div>
  );
}
