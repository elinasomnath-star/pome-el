import React, { useState, useEffect } from 'react';
import { useSimStore } from '../../store/useSimStore';
import CompanyBrandIcon from './CompanyBrandIcon';
import {
  getSavedScenarios,
  saveScenario,
  deleteScenario,
  encodeStateToHash,
  decodeStateFromHash
} from '../../engine/scenarioManager';
import {
  Save,
  Trash2,
  Copy,
  Download,
  Upload,
  Share2,
  Layers,
  X,
  Check,
  Columns,
  Play,
  Sparkles
} from 'lucide-react';

export default function ScenarioManagerModal({ isOpen, onClose }) {
  const store = useSimStore();
  const [scenarios, setScenarios] = useState([]);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [compareScenarioId, setCompareScenarioId] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setScenarios(getSavedScenarios());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCurrent = () => {
    const snapshot = {
      selectedCompanyId: store.selectedCompanyId,
      activeShocks: store.activeShocks.map(s => s.id),
      currentForceScores: store.currentForceScores,
      currentForceWeights: store.currentForceWeights,
      marketStructure: store.marketStructure,
      industryAttractiveness: store.industryAttractiveness.attractivenessIndex
    };
    const updated = saveScenario(newScenarioName, snapshot);
    setScenarios(updated);
    setNewScenarioName('');
  };

  const handleApplyScenario = (scenario) => {
    if (scenario.snapshot.selectedCompanyId) {
      store.setSelectedCompanyId(scenario.snapshot.selectedCompanyId);
    }
    store.resetShocks();
    if (Array.isArray(scenario.snapshot.activeShocks)) {
      scenario.snapshot.activeShocks.forEach(sId => store.toggleShock(sId));
    }
    if (scenario.snapshot.marketStructure) {
      store.setMarketStructure(scenario.snapshot.marketStructure);
    }
    onClose();
  };

  const handleDelete = (id) => {
    const updated = deleteScenario(id);
    setScenarios(updated);
    if (compareScenarioId === id) setCompareScenarioId(null);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scenarios, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `stratsim_scenarios_${Date.now()}.json`);
    dlAnchor.click();
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          localStorage.setItem('stratsim_saved_scenarios', JSON.stringify(imported));
          setScenarios(imported);
        }
      } catch (err) {
        alert("Invalid JSON scenario file.");
      }
    };
    reader.readAsText(file);
  };

  const handleCopyShareableHash = () => {
    const hash = encodeStateToHash(store);
    const fullUrl = `${window.location.origin}${window.location.pathname}${hash}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const compareTarget = scenarios.find(s => s.id === compareScenarioId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 rounded-2xl border border-slate-700 bg-dark-900/95 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-sans">
              Scenario Manager & Side-by-Side Comparator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-dark-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar: Save Current & Share */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-dark-950 border border-slate-800">
          {/* Save Current */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Name current scenario (e.g. Funding Winter + Squeeze)"
              value={newScenarioName}
              onChange={(e) => setNewScenarioName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-500"
            />
            <button
              onClick={handleSaveCurrent}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>

          {/* Share & Import/Export */}
          <div className="flex items-center justify-end gap-2 text-xs font-mono">
            <button
              onClick={handleCopyShareableHash}
              className="px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 hover:border-slate-600 text-slate-300 flex items-center gap-1.5"
            >
              {copiedHash ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
              <span>{copiedHash ? 'URL Copied!' : 'Copy Share URL'}</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 hover:border-slate-600 text-slate-300 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <label className="px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 hover:border-slate-600 text-slate-300 flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </div>

        {/* Side-by-Side Comparison if selected */}
        {compareTarget && (
          <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/30">
              <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <Columns className="w-4 h-4" />
                Side-by-Side Comparison: Current State vs. [{compareTarget.name}]
              </span>
              <button
                onClick={() => setCompareScenarioId(null)}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                Close Comparison
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-dark-900 border border-slate-800 space-y-1.5">
                <strong className="text-white block">Current Live State</strong>
                <div className="flex items-center gap-1.5">
                  <span>Firm:</span>
                  <CompanyBrandIcon id={store.selectedCompanyId} className="w-4 h-4" showBg={true} />
                  <span className="text-cyan-300 uppercase font-bold">{store.selectedCompanyId}</span>
                </div>
                <div>Attractiveness: <span className="text-cyan-300">{store.industryAttractiveness.attractivenessIndex.toFixed(1)}/10</span></div>
                <div>Active Shocks: <span className="text-cyan-300">{store.activeShocks.length}</span></div>
              </div>

              <div className="p-3 rounded-lg bg-dark-900 border border-slate-800 space-y-1.5">
                <strong className="text-white block">Saved: {compareTarget.name}</strong>
                <div className="flex items-center gap-1.5">
                  <span>Firm:</span>
                  <CompanyBrandIcon id={compareTarget.snapshot.selectedCompanyId} className="w-4 h-4" showBg={true} />
                  <span className="text-pink-300 uppercase font-bold">{compareTarget.snapshot.selectedCompanyId}</span>
                </div>
                <div>Attractiveness: <span className="text-pink-300">{compareTarget.snapshot.industryAttractiveness?.toFixed(1) || 'N/A'}/10</span></div>
                <div>Active Shocks: <span className="text-pink-300">{compareTarget.snapshot.activeShocks?.length || 0}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Scenarios List */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase text-slate-400">Saved Scenario Profiles ({scenarios.length})</h4>

          {scenarios.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
              No saved scenarios yet. Configure any shocks/sliders and click "Save" above!
            </div>
          ) : (
            <div className="space-y-2">
              {scenarios.map(sc => (
                <div
                  key={sc.id}
                  className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <strong className="text-white font-sans text-sm">{sc.name}</strong>
                      {sc.isPreset && (
                        <span className="px-2 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[9px] font-mono uppercase font-bold">
                          Preset
                        </span>
                      )}
                    </div>
                    {sc.description && (
                      <p className="text-[11px] text-slate-300 font-sans">{sc.description}</p>
                    )}
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 flex-wrap">
                      <span>{sc.createdAt}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        Firm:
                        <CompanyBrandIcon id={sc.snapshot.selectedCompanyId} className="w-3.5 h-3.5" showBg={true} />
                        <span className="text-cyan-300 uppercase font-bold">{sc.snapshot.selectedCompanyId}</span>
                      </span>
                      <span>&bull;</span>
                      <span>Shocks: {sc.snapshot.activeShocks?.length || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApplyScenario(sc)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Apply this scenario configuration to the live simulator"
                    >
                      <Play className="w-3.5 h-3.5 fill-emerald-300" />
                      <span>Apply</span>
                    </button>
                    <button
                      onClick={() => setCompareScenarioId(sc.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-dark-900 border border-slate-700 text-cyan-400 hover:text-cyan-300 font-mono text-[11px] cursor-pointer"
                    >
                      Compare
                    </button>
                    {!sc.isPreset && (
                      <button
                        onClick={() => handleDelete(sc.id)}
                        className="p-1.5 rounded-lg bg-dark-900 border border-slate-700 text-rose-400 hover:text-rose-300 cursor-pointer"
                        title="Delete scenario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

