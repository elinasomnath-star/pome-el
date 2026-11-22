import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, AlertTriangle } from 'lucide-react';

export default function DataProvenanceBadge({
  type = 'estimate', // 'verified' | 'estimate' | 'placeholder'
  source = '',
  year = '2024',
  confidence = 'medium',
  className = ''
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const configs = {
    verified: {
      label: 'Verified',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dotClass: 'bg-emerald-400',
      icon: ShieldCheck,
      description: 'Audited statutory report, Q4 shareholder letter, or official regulatory disclosure.'
    },
    estimate: {
      label: 'Estimate',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      dotClass: 'bg-amber-400',
      icon: AlertTriangle,
      description: 'Calculated from prospectus carve-outs or consensus brokerage equity research.'
    },
    placeholder: {
      label: 'Placeholder',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      dotClass: 'bg-rose-400',
      icon: HelpCircle,
      description: 'Unaudited estimate or preliminary pitch deck leak. Requires statutory verification.'
    }
  };

  const config = configs[type] || configs.estimate;
  const Icon = config.icon;

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border cursor-help transition-all ${config.badgeClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
        <span>{config.label}</span>
      </span>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2.5 rounded-xl bg-dark-950 border border-slate-700 text-slate-200 text-xs shadow-2xl z-50 pointer-events-none">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 font-mono text-[10px]">
            <span className="font-bold text-white uppercase">{config.label} Data</span>
            <span className="text-cyan-400">{year} &bull; {confidence.toUpperCase()}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug mb-1">{config.description}</p>
          {source && (
            <div className="text-[10px] font-mono text-slate-400 truncate">
              Source: {source}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

