import React, { useRef, useState } from 'react';

export default function Magnet({
  children,
  strength = 30,
  className = '',
  onClick
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    setPosition({
      x: (distanceX / (width / 2)) * (strength / 2),
      y: (distanceY / (height / 2)) * (strength / 2)
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.15s ease-out'
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
}

