/**
 * Scenario Manager Engine
 * Handles saving named scenarios to localStorage, side-by-side comparison,
 * JSON export/import, and URL hash state encoding/decoding.
 */

const STORAGE_KEY = 'stratsim_saved_scenarios';

export function getSavedScenarios() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
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

