import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

function DockItem({ item, mouseX, active, onClick }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-100, 0, 100], [38, 50, 38]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 });

  const Icon = item.icon;

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      onClick={() => onClick(item.id)}
      className={`relative group flex items-center justify-center rounded-xl shrink-0 transition-colors duration-200 cursor-pointer ${
        active
          ? 'bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/30'
          : 'bg-dark-800/90 text-slate-400 hover:text-white hover:bg-dark-700'
      }`}
      aria-label={item.label}
    >
      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110" />

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-1 px-3 py-0.5 rounded-full bg-dark-900/90 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-cyan-300 hover:border-slate-700 shadow-md backdrop-blur-md flex items-center gap-1 cursor-pointer transition-all"
        title={isCollapsed ? "Expand Dock Navigation" : "Minimize Dock to free up screen"}
      >
        <span>{isCollapsed ? "Show Dock" : "Minimize Dock"}</span>
        {isCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.16 }}
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={`flex items-end gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-slate-800 bg-dark-900/90 backdrop-blur-2xl shadow-2xl shadow-black/80 max-w-[96vw] overflow-x-auto scrollbar-none ${className}`}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
