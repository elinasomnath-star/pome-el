/**
 * Porter's Five Forces Scoring Rubric Engine
 * Maps empirical market metrics (CR4, capex per node, Kirana density, multi-homing %, FMCG concentration)
 * into deterministic 1.0 - 10.0 force hostility scores based on explicit thresholds.
 */

import rubricData from '../data/rubric.json';

/**
 * Maps an input metric value to a force score using rubric threshold steps
 * @param {string} forceId - 'rivalry' | 'newEntrants' | 'substitutes' | 'buyerPower' | 'supplierPower'
 * @param {number} numericValue - Quantitative metric (e.g., CR4 = 95, Capex = 35)
 * @returns {Object} { score, activeThreshold, forceName, metricName }
 */
export function mapMetricToForceScore(forceId, numericValue) {
  const rubric = rubricData.rubrics[forceId];
  if (!rubric) {
    return { score: 5.0, activeThreshold: null };
  }

  const val = Number(numericValue);
  let matchedThreshold = rubric.thresholds[rubric.thresholds.length - 1];

  for (let i = 0; i < rubric.thresholds.length; i++) {
    const t = rubric.thresholds[i];
    if (val >= t.min && val <= t.max) {
      matchedThreshold = t;
      break;
    }
  }

  return {
    forceId,
    forceName: rubric.forceName,
    metricName: rubric.metricName,
    inputMetricValue: val,
    score: matchedThreshold.score,
    activeThreshold: matchedThreshold,
    allThresholds: rubric.thresholds
  };
}

/**
 * Returns complete rubric definitions with active threshold highlights
 */
export function getAllForceRubrics() {
  return rubricData.rubrics;
}
