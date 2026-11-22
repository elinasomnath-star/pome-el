import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

function DockItem({ item, mouseX, active, onClick }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-100, 0, 100], [40, 54, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 });

  const Icon = item.icon;

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      onClick={() => onClick(item.id)}
      className={`relative group flex items-center justify-center rounded-xl sm:rounded-2xl shrink-0 transition-colors duration-200 cursor-pointer ${
        active
          ? 'bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/30'
          : 'bg-dark-800/90 text-slate-400 hover:text-white hover:bg-dark-700'
      }`}
      aria-label={item.label}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />

      {/* Tooltip */}
      <div className="pointer-events-none absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2.5 py-1 rounded-md bg-dark-950 border border-slate-700 text-[11px] font-mono text-slate-200 whitespace-nowrap shadow-xl z-50">
        {item.label}
      </div>

      {/* Active Dot */}
      {active && (
        <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
      )}
    </motion.button>
  );
}

export default function Dock({ items, activeTab, onSelectTab, className = '' }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`flex items-end gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl border border-slate-800 bg-dark-900/90 backdrop-blur-2xl shadow-2xl shadow-black/80 max-w-[96vw] overflow-x-auto scrollbar-none ${className}`}
    >
      {items.map((item) => (
        <DockItem
          key={item.id}
          item={item}
          mouseX={mouseX}
          active={activeTab === item.id}
          onClick={onSelectTab}
        />
      ))}
    </div>
  );
}
