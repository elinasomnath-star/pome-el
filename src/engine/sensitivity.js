/**
 * Sensitivity Analysis Engine (Tornado Chart)
 * Perturbs baseline parameters (force weights, own & cross elasticities, shock deltas, unit cost)
 * by ±delta to measure their impact on Industry Attractiveness Index and Firm Profit.
 */

import { calculateIndustryAttractiveness } from './forces.js';
import { calculateFirmDemand, calculateFirmProfit } from './priceWar.js';

/**
 * Computes sorted sensitivity items (tornado bars)
 * @param {Array} baselineForces 
 * @param {Object} currentScores 
 * @param {Object} currentWeights 
 * @param {Object} targetFirm 
 * @param {Array} activeFirms 
 * @returns {Array} Sorted array of sensitivity objects for tornado chart
 */
export function computeTornadoSensitivity(
  baselineForces,
  currentScores = {},
  currentWeights = {},
  targetFirm,
  activeFirms
) {
  const baseAttr = calculateIndustryAttractiveness(baselineForces, currentScores, currentWeights).attractivenessIndex;

  const basePrice = targetFirm?.basePrice || 32.0;
  const unitCost = targetFirm?.unitCost || 23.5;
  const fixedCost = (targetFirm?.fixedCost || 3800000) / 12;
  const priceMap = {};
  activeFirms.forEach(f => { priceMap[f.id] = f.basePrice; });

  const baseDemand = calculateFirmDemand(targetFirm, priceMap, activeFirms);
  const baseProfit = calculateFirmProfit(baseDemand, basePrice, unitCost, fixedCost);

  const parameters = [
    {
      id: "param_rivalry_weight",
      name: "Rivalry Weight (w_rivalry)",
      category: "Five Forces",
      type: "attractiveness",
      lowVal: 0.15,
      highVal: 0.45,
      evalLow: () => {
        const w = { ...currentWeights, rivalry: 0.15 };
        return calculateIndustryAttractiveness(baselineForces, currentScores, w).attractivenessIndex;
      },
      evalHigh: () => {
        const w = { ...currentWeights, rivalry: 0.45 };
        return calculateIndustryAttractiveness(baselineForces, currentScores, w).attractivenessIndex;
      }
    },
    {
      id: "param_new_entrants_score",
      name: "Threat of Entrants Score (S_entrants)",
      category: "Five Forces",
      type: "attractiveness",
      lowVal: 2.5,
      highVal: 7.0,
      evalLow: () => {
        const s = { ...currentScores, newEntrants: 2.5 };
        return calculateIndustryAttractiveness(baselineForces, s, currentWeights).attractivenessIndex;
      },
      evalHigh: () => {
        const s = { ...currentScores, newEntrants: 7.0 };
        return calculateIndustryAttractiveness(baselineForces, s, currentWeights).attractivenessIndex;
      }
    },
    {
      id: "param_buyer_power_weight",
      name: "Buyer Power Weight (w_buyers)",
      category: "Five Forces",
      type: "attractiveness",
      lowVal: 0.10,
      highVal: 0.35,
      evalLow: () => {
        const w = { ...currentWeights, buyerPower: 0.10 };
        return calculateIndustryAttractiveness(baselineForces, currentScores, w).attractivenessIndex;
      },
      evalHigh: () => {
        const w = { ...currentWeights, buyerPower: 0.35 };
        return calculateIndustryAttractiveness(baselineForces, currentScores, w).attractivenessIndex;
      }
    },
    {
      id: "param_own_elasticity",
      name: "Own-Price Elasticity (ε_ii)",
      category: "Pricing & Demand",
      type: "profit",
      lowVal: 1.35,
      highVal: 2.15,
      evalLow: () => {
        const tempFirm = { ...targetFirm, ownElasticity: 1.35 };
        const d = calculateFirmDemand(tempFirm, priceMap, activeFirms);
        return calculateFirmProfit(d, basePrice, unitCost, fixedCost);
      },
      evalHigh: () => {
        const tempFirm = { ...targetFirm, ownElasticity: 2.15 };
        const d = calculateFirmDemand(tempFirm, priceMap, activeFirms);
        return calculateFirmProfit(d, basePrice, unitCost, fixedCost);
      }
    },
    {
      id: "param_unit_delivery_cost",
      name: "Unit Rider Payout / Cost (c_i)",
      category: "Operations",
      type: "profit",
      lowVal: 19.0,
      highVal: 28.0,
      evalLow: () => {
        return calculateFirmProfit(baseDemand, basePrice, 19.0, fixedCost);
      },
      evalHigh: () => {
        return calculateFirmProfit(baseDemand, basePrice, 28.0, fixedCost);
      }
    },
    {
      id: "param_cross_elasticity",
      name: "Cross-Price Elasticity vs Blinkit (ε_ij)",
      category: "Pricing & Demand",
      type: "profit",
      lowVal: 0.35,
      highVal: 1.05,
      evalLow: () => {
        const tempFirm = {
          ...targetFirm,
          crossElasticities: { ...targetFirm.crossElasticities, blinkit: 0.35 }
        };
        const d = calculateFirmDemand(tempFirm, priceMap, activeFirms);
        return calculateFirmProfit(d, basePrice, unitCost, fixedCost);
      },
      evalHigh: () => {
        const tempFirm = {
          ...targetFirm,
          crossElasticities: { ...targetFirm.crossElasticities, blinkit: 1.05 }
        };
        const d = calculateFirmDemand(tempFirm, priceMap, activeFirms);
        return calculateFirmProfit(d, basePrice, unitCost, fixedCost);
      }
    }
  ];

  return parameters.map(p => {
    const lowOutput = p.evalLow();
    const highOutput = p.evalHigh();
    const baseline = p.type === 'attractiveness' ? baseAttr : baseProfit;
    const swing = Math.abs(highOutput - lowOutput);

    return {
      id: p.id,
      name: p.name,
      category: p.category,
      type: p.type,
      baseline: Number(baseline.toFixed(2)),
      lowVal: p.lowVal,
      highVal: p.highVal,
      lowOutput: Number(lowOutput.toFixed(2)),
      highOutput: Number(highOutput.toFixed(2)),
      swing: Number(swing.toFixed(2)),
      deltaLow: Number((lowOutput - baseline).toFixed(2)),
      deltaHigh: Number((highOutput - baseline).toFixed(2))
    };
  }).sort((a, b) => b.swing - a.swing);
}
