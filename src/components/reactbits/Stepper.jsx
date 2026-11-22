import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

export default function Stepper({
  steps = [],
  currentStep = 0,
  onSelectStep,
  className = ''
}) {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto py-2 ${className}`}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;

        return (
          <React.Fragment key={idx}>
            <button
              onClick={() => onSelectStep && onSelectStep(idx)}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                isCurrent
                  ? 'border-violet-500 bg-violet-600/20 text-violet-300 shadow-md shadow-violet-500/20'
                  : isCompleted
                  ? 'border-emerald-600/40 bg-emerald-950/20 text-emerald-400'
                  : 'border-slate-800 bg-dark-800/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                  isCurrent
                    ? 'bg-violet-500 text-white'
                    : isCompleted
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-dark-700 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
              </span>
              <span className="whitespace-nowrap">{step.title}</span>
            </button>
            {idx < steps.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

