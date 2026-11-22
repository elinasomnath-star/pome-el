import React, { useEffect, useRef } from 'react';

export default function Aurora({ colorStops = ['#8b5cf6', '#06b6d4', '#ec4899'], speed = 0.5, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion (Requirement 11)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      t += 0.005 * speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Draw subtle luminous wave gradients
      const grad1 = ctx.createRadialGradient(
        w * 0.3 + Math.sin(t) * 120,
        h * 0.3 + Math.cos(t * 0.8) * 80,
        10,
        w * 0.3,
        h * 0.3,
        w * 0.6
      );
      grad1.addColorStop(0, 'rgba(139, 92, 246, 0.22)');
      grad1.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
      grad1.addColorStop(1, 'rgba(11, 14, 23, 0)');

      const grad2 = ctx.createRadialGradient(
        w * 0.7 + Math.cos(t * 0.7) * 100,
        h * 0.6 + Math.sin(t * 0.9) * 90,
        20,
        w * 0.7,
        h * 0.6,
        w * 0.7
      );
      grad2.addColorStop(0, 'rgba(236, 72, 153, 0.20)');
      grad2.addColorStop(0.5, 'rgba(16, 185, 129, 0.08)');
      grad2.addColorStop(1, 'rgba(11, 14, 23, 0)');

      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
}

