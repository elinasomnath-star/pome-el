import React from 'react';

export default function GradientText({
  children,
  className = '',
  colors = ['#8b5cf6', '#06b6d4', '#ec4899'],
  animationSpeed = 6
}) {
  const gradient = `linear-gradient(to right, ${colors.join(', ')})`;

  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient font-bold ${className}`}
      style={{
        backgroundImage: gradient,
        animationDuration: `${animationSpeed}s`
      }}
    >
      {children}
    </span>
  );
}

