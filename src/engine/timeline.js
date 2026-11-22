/**
 * Multi-Quarter Shock Timeline Engine
 * Models quarter-by-quarter propagation of multiple stacked shocks
 * with configurable severity multipliers (0.25x - 2.0x) and durations (1 - 8 quarters).
 */

import { calculateIndustryAttractiveness } from './forces.js';
import { applyShocks } from './shocks.js';

/**
 * Computes 8-quarter trajectory of Attractiveness Index and Company Market Shares
 * @param {Array} baselineForces 
 * @param {Array} baselineFirms 
 * @param {Array} activeShocksWithParams - Array of { shock, severity = 1.0, durationQuarters = 4, startQuarter = 1 }
 * @param {number} totalQuarters - Default 8 quarters (Q1 to Q8)
 * @returns {Array} Array of quarter objects { quarter: 'Q1', attractivenessIndex, firms: { blinkit: 40, zepto: 29... } }
 */
export function generateShockTimeline(
  baselineForces,
  baselineFirms,
  activeShocksWithParams = [],
  totalQuarters = 8
) {
  const trajectory = [];

  for (let q = 1; q <= totalQuarters; q++) {
    // Find all shocks that are active in this specific quarter
    const currentActiveShocks = activeShocksWithParams
      .filter(item => {
        const start = item.startQuarter || 1;
        const end = start + (item.durationQuarters || 4) - 1;
        return q >= start && q <= end;
      })
      .map(item => {
        const severity = item.severity !== undefined ? item.severity : 1.0;
        const baseShock = item.shock;

        // Scale deltas by severity
        const scaledForceDeltas = {};
        if (baseShock.forceDeltas) {
          Object.entries(baseShock.forceDeltas).forEach(([k, v]) => {
            scaledForceDeltas[k] = v * severity;
          });
        }

        const scaledShareDeltas = {};
        if (baseShock.firmShareDeltas) {
          Object.entries(baseShock.firmShareDeltas).forEach(([k, v]) => {
            scaledShareDeltas[k] = v * severity;
          });
        }

        return {
          ...baseShock,
          forceDeltas: scaledForceDeltas,
          marketGrowthDelta: (baseShock.marketGrowthDelta || 0) * severity,
          costDelta: (baseShock.costDelta || 0) * severity,
          firmShareDeltas: scaledShareDeltas
        };
      });

    // Apply active shocks for this quarter
    const applied = applyShocks(baselineForces, baselineFirms, currentActiveShocks);
    const attr = calculateIndustryAttractiveness(baselineForces, applied.updatedScores, {}).attractivenessIndex;

    const firmShares = {};
    applied.updatedFirms.forEach(f => {
      firmShares[f.id] = f.marketShare;
    });

    trajectory.push({
      quarter: `Q${q}`,
      quarterNum: q,
      activeShockCount: currentActiveShocks.length,
      attractivenessIndex: attr,
      growthRate: Math.max(0, 58.0 + applied.cumulativeGrowthDelta),
      firms: firmShares
    });
  }

  return trajectory;
}

