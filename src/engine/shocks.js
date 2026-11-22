/**
 * Shock Lab Engine
 * Applies external shocks, computes cumulative deltas across forces, market growth, and firm market shares.
 */

/**
 * Applies a single shock or a chain of shocks to baseline forces and firms
 * @param {Array} baselineForces 
 * @param {Array} baselineFirms 
 * @param {Array} activeShocks - Array of shock objects from shocks.json
 * @returns {Object} Updated forces, firms, marketGrowth, costMultiplier, and delta timeline
 */
export function applyShocks(baselineForces, baselineFirms, activeShocks = []) {
  // Deep clone
  const updatedScores = {};
  baselineForces.forEach(f => {
    updatedScores[f.id] = f.baseScore;
  });

  let cumulativeGrowthDelta = 0;
  let cumulativeCostDelta = 0;
  const firmShareDeltas = {};
  baselineFirms.forEach(f => {
    firmShareDeltas[f.id] = 0;
  });

  activeShocks.forEach(shock => {
    // 1. Force deltas
    if (shock.forceDeltas) {
      Object.entries(shock.forceDeltas).forEach(([forceId, delta]) => {
        if (updatedScores[forceId] !== undefined) {
          updatedScores[forceId] = Math.max(1, Math.min(10, updatedScores[forceId] + delta));
        }
      });
    }

    // 2. Market growth delta
    if (shock.marketGrowthDelta) {
      cumulativeGrowthDelta += shock.marketGrowthDelta;
    }

    // 3. Operational cost delta (%)
    if (shock.costDelta) {
      cumulativeCostDelta += shock.costDelta;
    }

    // 4. Firm share deltas
    if (shock.firmShareDeltas) {
      Object.entries(shock.firmShareDeltas).forEach(([firmId, delta]) => {
        if (firmShareDeltas[firmId] !== undefined) {
          firmShareDeltas[firmId] += delta;
        }
      });
    }
  });

  // Calculate adjusted firms with normalized shares
  let rawShares = baselineFirms.map(f => {
    const adjustedShare = Math.max(1.0, f.marketShare + (firmShareDeltas[f.id] || 0));
    return { id: f.id, rawShare: adjustedShare };
  });

  const sumRawShares = rawShares.reduce((acc, curr) => acc + curr.rawShare, 0);
  const normalizedFirms = baselineFirms.map(firm => {
    const raw = rawShares.find(r => r.id === firm.id)?.rawShare || firm.marketShare;
    const finalShare = Number(((raw / sumRawShares) * 100).toFixed(1));
    const effectiveGrowth = Math.max(0, firm.annualGrowthRate + cumulativeGrowthDelta);
    
    // Revenue adjusted by market share changes and total market expansion
    const marketExpansionFactor = 1 + (cumulativeGrowthDelta / 100);
    const adjustedRevenue = Math.round(firm.revenue * (finalShare / firm.marketShare) * marketExpansionFactor);

    return {
      ...firm,
      marketShare: finalShare,
      annualGrowthRate: effectiveGrowth,
      revenue: adjustedRevenue,
      costMultiplier: 1 + (cumulativeCostDelta / 100)
    };
  });

  return {
    updatedScores,
    cumulativeGrowthDelta,
    cumulativeCostDelta,
    updatedFirms: normalizedFirms
  };
}

