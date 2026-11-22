import React, { useRef, useState } from 'react';

export default function TiltedCard({
  children,
  className = '',
  maxTilt = 12,
  perspective = 1000
}) {
  const ref = useRef(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    setRotX(tiltX);
    setRotY(tiltY);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
  };

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className="inline-block w-full"
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out'
        }}
        className={className}
      >
        {children}
      </div>
    </div>
  );
}

