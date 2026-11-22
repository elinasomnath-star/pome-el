import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  Compass,
  BarChart2,
  Shield,
  Zap,
  Swords,
  Dices
} from 'lucide-react';

export default function GuidedDemoModal({ isOpen, onClose }) {
  const {
    setActiveTab,
    setSelectedCompanyId,
    toggleShock,
    nextPriceRound,
    runMonteCarlo,
    allShocks,
    activeShocks
  } = useSimStore();

  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      title: "Step 1: Select Active Firm (Zepto)",
      tab: "overview",
      icon: Compass,
      caption: "In quick commerce, market share determines rider density. We select Zepto (29% market share, challenger) to stress-test its unit economics.",
      actionLabel: "Select Zepto & View Dashboard",
      onEnter: () => {
        setSelectedCompanyId('zepto');
        setActiveTab('overview');
      }
    },
    {
      title: "Step 2: BCG Growth-Share Matrix",
      tab: "bcg",
      icon: BarChart2,
      caption: "Henderson's BCG Matrix plots Relative Market Share (log scale) vs Annual Growth Rate. Blinkit is the dominant Star, while Zepto is a high-growth Question Mark challenger.",
      actionLabel: "Inspect BCG Matrix",
      onEnter: () => {
        setActiveTab('bcg');
      }
    },
    {
      title: "Step 3: Porter's Five Forces",
      tab: "forces",
      icon: Shield,
      caption: "Five Forces determine long-run profitability. High rivalry (9.2) and buyer power (7.8) compress the Industry Attractiveness Index to ~2.8/10 (Hyper-Competitive Squeeze).",
      actionLabel: "Inspect Five Forces Radar",
      onEnter: () => {
        setActiveTab('forces');
      }
    },
    {
      title: "Step 4: Deploy External Macro Shock",
      tab: "shocks",
      icon: Zap,
      caption: "We deploy the 'New Funded Mega-Entrant' shock (Flipkart/Reliance 500 dark store surge). Watch the threat of entrants jump and incumbent shares compress.",
      actionLabel: "Apply Mega-Entrant Shock",
      onEnter: () => {
        setActiveTab('shocks');
        if (!activeShocks.some(s => s.id === 'new_funded_entrant')) {
          toggleShock('new_funded_entrant');
        }
      }
    },
    {
      title: "Step 5: Bertrand Price War Simulation",
      tab: "pricewar",
      icon: Swords,
      caption: "We simulate 3 consecutive rounds of oligopolistic pricing. Watch how AI opponents (Blinkit, Instamart) retaliate via Match and Undercut rules.",
      actionLabel: "Simulate 3 Rounds",
      onEnter: () => {
        setActiveTab('pricewar');
        setTimeout(() => nextPriceRound(), 300);
        setTimeout(() => nextPriceRound(), 600);
        setTimeout(() => nextPriceRound(), 900);
      }
    },
    {
      title: "Step 6: Strategy Recommender & Rules",
      tab: "recommender",
      icon: Sparkles,
      caption: "The rule-based inference engine evaluates Zepto's sub-10 minute delivery SLA and recommends Differentiation (Zepto Cafe / speed premium) rather than a self-destructive price war.",
      actionLabel: "Review Strategy Recommendation",
      onEnter: () => {
        setActiveTab('recommender');
      }
    },
    {
      title: "Step 7: Monte Carlo Uncertainty Bounds",
      tab: "montecarlo",
      icon: Dices,
      caption: "Under Knightian Uncertainty, point estimates mislead. We sample 1,000 stochastic trials to compute 90% confidence intervals (P5 to P95) for Attractiveness and Profit.",
      actionLabel: "Run Monte Carlo Analysis",
      onEnter: () => {
        setActiveTab('montecarlo');
        runMonteCarlo();
      }
    }
  ];

  const step = demoSteps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      demoSteps[nextIdx].onEnter();
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      demoSteps[prevIdx].onEnter();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl p-6 rounded-2xl border-2 border-violet-500/60 bg-dark-900/95 shadow-2xl shadow-violet-950/50 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-300">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">
                Guided Interactive Demo (Step {currentStep + 1} of {demoSteps.length})
              </span>
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <StepIcon className="w-4 h-4 text-violet-400" />
                <span>{step.title}</span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-dark-800 text-slate-400 hover:text-white"
            title="Exit Demo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Caption */}
        <p className="text-xs text-slate-200 leading-relaxed font-sans bg-dark-950 p-3.5 rounded-xl border border-slate-800">
          {step.caption}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-dark-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-violet-500 via-cyan-400 to-pink-500 h-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-3.5 py-2 rounded-xl bg-dark-800 border border-slate-700 text-xs font-mono text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
            >
              Exit Demo
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 cursor-pointer"
            >
              <span>{currentStep === demoSteps.length - 1 ? 'Finish Demo' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
