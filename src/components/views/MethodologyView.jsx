import React from 'react';
import methodologyData from '../../data/methodology.json';
import SpotlightCard from '../reactbits/SpotlightCard';
import {
  BookOpen,
  Printer,
  FileDown,
  Calculator,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  Code
} from 'lucide-react';

export default function MethodologyView() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0 print:bg-white print:text-black">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800 print:border-b-2 print:border-black">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white print:text-black tracking-tight flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-cyan-400 print:text-black" />
              <span>Model Methodology, Formulations & Assumptions</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 print:text-black border border-cyan-500/30">
              {methodologyData.version}
            </span>
          </div>
          <p className="text-sm text-slate-400 print:text-gray-700 mt-1">
            Complete mathematical specification, academic literature citations, and parameter calibration guidelines.
          </p>
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
      <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-950/20 print:border-gray-300 print:bg-gray-50 text-xs text-slate-300 print:text-black flex items-center gap-3">
        <Calculator className="w-5 h-5 text-violet-400 shrink-0" />
        <div>
          <strong>Academic Pedagogy: </strong>
          Designed for {methodologyData.courseContext}. Integrates Microeconomic Market Structure Theory with Organizational Behavior and Strategic Management.
        </div>
      </div>

      {/* Theoretical Formulations Detailed Cards */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white print:text-black font-sans border-b border-slate-800 pb-2">
          Core Mathematical Formulations & Framework References
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {methodologyData.theories.map((theory, idx) => (
            <SpotlightCard
              key={idx}
              spotlightColor="rgba(6, 182, 212, 0.15)"
              className="p-5 border border-slate-800 bg-dark-900/90 print:bg-white print:border-gray-300 print:text-black space-y-3"
            >
              <div className="flex items-start justify-between">
                <h4 className="text-base font-bold text-white print:text-black font-sans">
                  {theory.name}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 print:bg-gray-200 text-cyan-300 print:text-black border border-slate-700">
                  {theory.pioneer.split(',')[0]}
                </span>
              </div>

              <div className="text-xs text-slate-400 print:text-gray-600 font-mono">
                Pioneer: {theory.pioneer}
              </div>

              {/* Formula Block */}
              <div className="p-3 rounded-lg bg-dark-950 print:bg-gray-100 border border-slate-800 print:border-gray-300 font-mono text-xs text-cyan-300 print:text-black">
                {theory.formula}
              </div>

              {/* Explanations or Quadrants */}
              {theory.quadrants ? (
                <div className="space-y-1.5 pt-1 text-xs text-slate-300 print:text-black">
                  {Object.entries(theory.quadrants).map(([quad, desc]) => (
                    <div key={quad} className="text-[11px] leading-snug">
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
              <div className="pt-2 border-t border-slate-800 print:border-gray-300 text-[11px] text-slate-400 print:text-gray-600 font-mono">
                <strong>Assumption:</strong> {theory.assumptions}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      {/* Model Limitations Notice */}
      <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 print:bg-yellow-50 print:border-yellow-300 space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-300 print:text-black font-sans">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Model Boundaries & Practical Limitations</span>
        </div>
        <ul className="list-disc list-inside text-xs text-slate-300 print:text-gray-800 space-y-1 font-sans">
          {methodologyData.limitations.map((lim, lIdx) => (
            <li key={lIdx}>{lim}</li>
          ))}
        </ul>
      </div>

      {/* Verified Placeholder Data Disclosure */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-dark-900/60 print:bg-white text-xs text-slate-400 print:text-black space-y-2">
        <h4 className="text-sm font-bold text-white print:text-black font-sans">
          Academic Audit & Data Provenance Notice
        </h4>
        <p className="leading-relaxed">
          In compliance with rigorous academic research standards, all baseline figures are derived from publicly filed Q4 FY24 shareholder earnings disclosures (Zomato Ltd), IPO draft prospectuses (Swiggy Limited DRHP 2024), and curated venture research (Bernstein, JM Financial, Redseer). Where proprietary dark-store allocation figures are unlisted or estimated, they carry an explicit <strong className="text-cyan-400">[PLACEHOLDER]</strong> label in <code className="bg-dark-800 px-1.5 py-0.5 rounded text-cyan-300">/src/data/*.json</code> and must be verified against future statutory audits.
        </p>
      </div>

    </div>
  );
}

