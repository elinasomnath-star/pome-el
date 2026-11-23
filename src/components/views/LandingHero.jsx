import React from 'react';
import Aurora from '../reactbits/Aurora';
import Particles from '../reactbits/Particles';
import BlurText from '../reactbits/BlurText';
import ShinyText from '../reactbits/ShinyText';
import GradientText from '../reactbits/GradientText';
import Magnet from '../reactbits/Magnet';
import CompanyBrandIcon from '../common/CompanyBrandIcon';
import { ArrowRight, Flame, BarChart2, Shield, Network, Scale, FileText, Sparkles } from 'lucide-react';

export default function LandingHero({ onStartSimulation, onStartGuidedDemo, reduceEffects = false }) {
  const frameworks = [
    { title: "BCG Matrix", desc: "Relative Share vs Market Growth Bubbles", icon: BarChart2, color: "text-violet-400" },
    { title: "Porter's 5 Forces", desc: "Dynamic Radar & Attractiveness Index", icon: Shield, color: "text-cyan-400" },
    { title: "Oligopoly Price War", desc: "Constant Elasticity & Nash Equilibrium", icon: Flame, color: "text-pink-400" },
    { title: "POSDCORB & Org", desc: "Layers = log_span(N) & Contingency", icon: Network, color: "text-emerald-400" },
  ];

  return (
    <div className="relative min-h-[82vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 overflow-hidden border-b border-slate-800/60">
      {/* Background Aurora & Floating Particles (skipped if reduceEffects is true) */}
      {!reduceEffects && (
        <>
          <Aurora speed={0.4} className="absolute inset-0 opacity-80" />
          <Particles particleCount={35} speed={0.3} className="opacity-60" />
        </>
      )}

      <div className="relative z-10 max-w-4xl mx-auto py-12">
        {/* Course Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 text-violet-300 text-xs font-mono uppercase tracking-wider mb-6 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Principles of Management & Economics (POME)</span>
        </div>

        {/* Headline with BlurText */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-sans text-white mb-4">
          <BlurText text="Strategy Under Fire" delay={0.08} className="text-white drop-shadow-lg" />
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-2xl font-light text-slate-300 max-w-2xl mx-auto mb-3">
          <GradientText colors={['#a78bfa', '#38bdf8', '#f472b6']}>
            Play strategist. Stress-test the market.
          </GradientText>
        </p>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-6 font-normal leading-relaxed">
          Interactive strategy simulator for Indian quick commerce. Deploy strategic shocks, wage Bertrand price wars, optimize dark-store org layers, and solve Nash equilibria.
        </p>

        {/* Real Official Brand Showcase Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
          {[
            { id: 'blinkit', name: 'Blinkit', share: '42%' },
            { id: 'zepto', name: 'Zepto', share: '29%' },
            { id: 'swiggy_instamart', name: 'Swiggy Instamart', share: '22%' },
            { id: 'bigbasket_now', name: 'BB Now', share: '7%' },
          ].map(b => (
            <div
              key={b.id}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-dark-900/80 border border-slate-800 shadow-md backdrop-blur-sm"
            >
              <CompanyBrandIcon id={b.id} className="w-8 h-8" showBg={true} />
              <div className="text-left font-sans">
                <span className="text-xs font-bold text-white block leading-tight">{b.name}</span>
                <span className="text-[10.5px] text-cyan-400 font-mono font-semibold">{b.share} GOV</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Magnet strength={36}>
            <button
              onClick={onStartSimulation}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-600 to-cyan-500 text-white font-semibold text-base shadow-xl shadow-violet-600/30 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer group"
            >
              <span>Start Simulation</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Magnet>

          <button
            onClick={onStartGuidedDemo}
            className="px-6 py-4 rounded-2xl bg-dark-800/90 hover:bg-dark-700 border border-slate-700 hover:border-violet-500/60 text-slate-200 font-mono text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Start Guided Demo (~3 min)</span>
          </button>
        </div>

        {/* Theoretical Pillar Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          {frameworks.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-800/90 bg-dark-800/60 backdrop-blur-md hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${f.color}`} />
                  <span className="text-xs font-semibold text-slate-200">{f.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

