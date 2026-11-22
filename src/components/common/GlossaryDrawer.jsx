import React, { useState } from 'react';
import glossaryData from '../../data/glossary.json';
import { BookOpen, Search, X, Tag } from 'lucide-react';

export default function GlossaryDrawer({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', ...new Set(glossaryData.terms.map(t => t.category))];

  const filteredTerms = glossaryData.terms.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md h-full bg-dark-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-sans">
                POME & Strategy Glossary Drawer
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-dark-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search concepts, formulas, thinkers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-dark-800 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Term Cards */}
        <div className="flex-1 overflow-y-auto space-y-3 py-4 my-2 pr-1">
          {filteredTerms.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No matching terms found.
            </div>
          ) : (
            filteredTerms.map(t => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-sans">{t.term}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-900 border border-slate-700 text-cyan-400">
                    {t.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {t.definition}
                </p>
                {t.formula && (
                  <div className="p-2 rounded bg-dark-950 border border-slate-800 text-[10px] font-mono text-pink-300">
                    Formula: {t.formula}
                  </div>
                )}
                {t.prescription && (
                  <div className="text-[10px] font-mono text-emerald-400">
                    Action: {t.prescription}
                  </div>
                )}
                <div className="text-[9px] font-mono text-slate-500">
                  {t.pomeUnit}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 text-center text-[10px] font-mono text-slate-500">
          Showing {filteredTerms.length} of {glossaryData.terms.length} curated POME terms
        </div>

      </div>
    </div>
  );
}

