import React, { useEffect, useState } from 'react';

export default function CountUp({
  to,
  from = 0,
  duration = 1.2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}) {
  const [current, setCurrent] = useState(from);

  useEffect(() => {
    let startTime = null;
    const startVal = Number(from) || 0;
    const endVal = Number(to) || 0;
    let animFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = startVal + (endVal - startVal) * eased;
      setCurrent(val);

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      } else {
        setCurrent(endVal);
      }
    };

    animFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animFrame);
  }, [to, from, duration]);

  const formatted = decimals > 0
    ? current.toFixed(decimals)
    : Math.round(current).toLocaleString();

  return (
    <span className={`tabular-nums font-mono ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

