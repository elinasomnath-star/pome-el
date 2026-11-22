import React from 'react';

export default function GlassSurface({
  children,
  className = '',
  intensity = 'medium', // 'low' | 'medium' | 'high'
  borderGlow = false
}) {
  const blurClasses = {
    low: 'backdrop-blur-md bg-dark-800/50',
    medium: 'backdrop-blur-xl bg-dark-800/70',
    high: 'backdrop-blur-2xl bg-dark-900/85'
  };

  const glowBorder = borderGlow
    ? 'border-violet-500/30 shadow-lg shadow-violet-500/10'
    : 'border-slate-800/80';

  return (
    <div
      className={`rounded-2xl border ${glowBorder} ${blurClasses[intensity] || blurClasses.medium} shadow-xl text-slate-100 ${className}`}
    >
      {children}
    </div>
  );
}

