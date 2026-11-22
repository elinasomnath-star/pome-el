/**
 * Scenario Manager Engine
 * Handles saving named scenarios to localStorage, side-by-side comparison,
 * JSON export/import, and URL hash state encoding/decoding.
 */

const STORAGE_KEY = 'stratsim_saved_scenarios';

export const DEFAULT_PRESET_SCENARIOS = [
  {
    id: 'preset_mature_profit',
    isPreset: true,
    name: '★ Q4 Turnaround (Positive EBITDA Benchmark)',
    createdAt: 'Curated Evaluator Preset',
    description: 'Blinkit scale leadership with positive contribution margin (+3.9%) and +₹19 Cr Adjusted EBITDA.',
    snapshot: {
      selectedCompanyId: 'blinkit',
      activeShocks: [],
      marketStructure: 'oligopoly',
      industryAttractiveness: 3.2
    }
  },
  {
    id: 'preset_funding_winter',
    isPreset: true,
    name: 'Macro Shock: Funding Winter & Retaliatory Price War',
    createdAt: 'Curated Evaluator Preset',
    description: 'Dual macroeconomic stress test: Funding drought cuts expansion while aggressive price wars depress margins.',
    snapshot: {
      selectedCompanyId: 'zepto',
      activeShocks: ['funding_drought', 'price_war'],
      marketStructure: 'oligopoly',
      industryAttractiveness: 2.1
    }
  },
  {
    id: 'preset_mega_entrant',
    isPreset: true,
    name: 'Conglomerate Shock: New Funded Mega-Entrant',
    createdAt: 'Curated Evaluator Preset',
    description: 'Flipkart Minutes / Reliance 500-store rollout triggers intense threat of entrants and market share dilution.',
    snapshot: {
      selectedCompanyId: 'swiggy_instamart',
      activeShocks: ['new_funded_entrant'],
      marketStructure: 'oligopoly',
      industryAttractiveness: 2.5
    }
  }
];

export function getSavedScenarios() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_PRESET_SCENARIOS;
}

export function saveScenario(name, stateSnapshot) {
  const existing = getSavedScenarios();
  const newScenario = {
    id: `scenario_${Date.now()}`,
    name: name || `Scenario ${existing.length + 1}`,
    createdAt: new Date().toLocaleString(),
    snapshot: stateSnapshot
  };
  const updated = [newScenario, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
  return updated;
}

export function deleteScenario(id) {
  const existing = getSavedScenarios();
  const updated = existing.filter(s => s.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
  return updated;
}

/**
 * Encodes key state into a shareable URL hash string
 */
export function encodeStateToHash(state) {
  try {
    const compact = {
      c: state.selectedCompanyId,
      s: state.activeShocks?.map(s => s.id),
      f: state.currentForceScores,
      t: state.activeTab
    };
    const jsonStr = JSON.stringify(compact);
    const b64 = btoa(jsonStr);
    return `#state=${b64}`;
  } catch (e) {
    return '';
  }
}

/**
 * Decodes state from URL hash string
 */
export function decodeStateFromHash(hash) {
  try {
    if (!hash || !hash.includes('#state=')) return null;
    const b64 = hash.replace('#state=', '');
    const jsonStr = atob(b64);
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

