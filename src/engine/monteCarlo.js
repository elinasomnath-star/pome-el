/**
 * Monte Carlo Simulation Engine
 * Runs 1,000 stochastic iterations adding noise to Five Forces scores and price elasticity,
 * computing empirical probability distributions, histograms, and 5th-95th percentile confidence intervals.
 */

import { calculateIndustryAttractiveness } from './forces.js';
import { calculateFirmDemand, calculateFirmProfit } from './priceWar.js';

/**
 * Standard Box-Muller transform for normal distribution sampling
 */
function randomNormal(mean = 0, stdev = 1) {
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * stdev;
}

/**
 * Executes 1,000 Monte Carlo runs
 * @param {Array} baselineForces 
 * @param {Object} currentScores 
 * @param {Object} currentWeights 
 * @param {Object} targetFirm 
 * @param {Object} priceWarConfig 
 * @param {number} iterations - Default 1000
 * @returns {Object} Monte Carlo results with confidence bounds, summary stats, and histogram bins
 */
export function runMonteCarloSimulation(
  baselineForces,
  currentScores = {},
  currentWeights = {},
  targetFirm,
  priceWarConfig,
  iterations = 1000
) {
  const attractivenessResults = [];
  const profitResults = [];

  const basePrice = targetFirm?.basePrice || 32.0;
  const unitCost = targetFirm?.unitCost || 23.5;
  const fixedCostPerRound = (targetFirm?.fixedCost || 3800000) / 12;
  const baseElasticity = targetFirm?.ownElasticity || 1.75;
  const baseDemandCoeff = targetFirm?.baseDemandCoeff || 350000;

  for (let i = 0; i < iterations; i++) {
    // 1. Add noise to Five Forces scores (sigma = 0.6, bounded [1, 10])
    const noisyScores = {};
    baselineForces.forEach(f => {
      const base = currentScores[f.id] !== undefined ? currentScores[f.id] : f.baseScore;
      const noise = randomNormal(0, 0.6);
      noisyScores[f.id] = Math.max(1, Math.min(10, base + noise));
    });

    const forceMetrics = calculateIndustryAttractiveness(baselineForces, noisyScores, currentWeights);
    attractivenessResults.push(forceMetrics.attractivenessIndex);

    // 2. Add noise to own-price elasticity (sigma = 0.15) and cost noise (sigma = 1.2)
    const noisyElasticity = Math.max(0.8, baseElasticity + randomNormal(0, 0.15));
    const noisyUnitCost = Math.max(12, unitCost + randomNormal(0, 1.2));
    
    // Compute demand with stochastic elasticity
    const noisyDemand = Math.max(500, Math.round(baseDemandCoeff * Math.pow(basePrice, -noisyElasticity)));
    const noisyProfit = calculateFirmProfit(noisyDemand, basePrice, noisyUnitCost, fixedCostPerRound);
    profitResults.push(noisyProfit);
  }

  // Sort results for percentile extraction
  attractivenessResults.sort((a, b) => a - b);
  profitResults.sort((a, b) => a - b);

  function getPercentile(arr, p) {
    const idx = Math.floor((p / 100) * (arr.length - 1));
    return arr[idx];
  }

  function getMean(arr) {
    return arr.reduce((acc, v) => acc + v, 0) / arr.length;
  }

  function getStdev(arr, mean) {
    const variance = arr.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  }

  const meanAttr = getMean(attractivenessResults);
  const stdevAttr = getStdev(attractivenessResults, meanAttr);
  const p5Attr = getPercentile(attractivenessResults, 5);
  const p50Attr = getPercentile(attractivenessResults, 50);
  const p95Attr = getPercentile(attractivenessResults, 95);

  const meanProfit = getMean(profitResults);
  const stdevProfit = getStdev(profitResults, meanProfit);
  const p5Profit = getPercentile(profitResults, 5);
  const p50Profit = getPercentile(profitResults, 50);
  const p95Profit = getPercentile(profitResults, 95);

  // Generate histogram bins (12 bins each)
  function createHistogram(arr, binCount = 12, isCurrency = false) {
    const min = arr[0];
    const max = arr[arr.length - 1];
    const step = (max - min) / binCount;
    const bins = [];

    for (let b = 0; b < binCount; b++) {
      const lower = min + b * step;
      const upper = lower + step;
      const count = arr.filter(v => v >= lower && (b === binCount - 1 ? v <= upper : v < upper)).length;
      
      const label = isCurrency
        ? `₹${Math.round(lower / 1000)}k`
        : lower.toFixed(1);

      bins.push({
        label,
        lower: Number(lower.toFixed(2)),
        upper: Number(upper.toFixed(2)),
        count,
        density: Number(((count / arr.length) * 100).toFixed(1))
      });
    }

    return bins;
  }

  return {
    iterations,
    attractiveness: {
      mean: Number(meanAttr.toFixed(2)),
      stdev: Number(stdevAttr.toFixed(2)),
      p5: Number(p5Attr.toFixed(2)),
      p50: Number(p50Attr.toFixed(2)),
      p95: Number(p95Attr.toFixed(2)),
      confidenceInterval: `[${p5Attr.toFixed(2)} - ${p95Attr.toFixed(2)}]`,
      histogram: createHistogram(attractivenessResults, 12, false)
    },
    profit: {
      mean: Math.round(meanProfit),
      stdev: Math.round(stdevProfit),
      p5: Math.round(p5Profit),
      p50: Math.round(p50Profit),
      p95: Math.round(p95Profit),
      confidenceInterval: `₹${Math.round(p5Profit).toLocaleString()} - ₹${Math.round(p95Profit).toLocaleString()}`,
      histogram: createHistogram(profitResults, 12, true)
    }
  };
}

