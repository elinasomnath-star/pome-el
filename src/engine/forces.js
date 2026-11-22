/**
 * Porter's Five Forces & Industry Attractiveness Engine
 * Computes weighted scores, Industry Attractiveness Index, and firm strategic health.
 */

/**
 * Calculates Industry Attractiveness Index
 * Formula: Index = 10 - [ Sum(Weight_i * Score_i) / Sum(Weight_i) ]
 * Range: [0, 10], where 10 = highly attractive (monopolistic/benign), 0 = hyper-competitive
 * @param {Array} forces - Array of force objects with { id, baseScore, defaultWeight }
 * @param {Object} currentScores - Map of force id to current score (1-10)
 * @param {Object} currentWeights - Map of force id to weight
 * @returns {Object} { attractivenessIndex, weightedAverageScore, forceBreakdown }
 */
export function calculateIndustryAttractiveness(forces, currentScores = {}, currentWeights = {}) {
  let weightedSum = 0;
  let totalWeight = 0;

  const breakdown = forces.map(f => {
    const score = currentScores[f.id] !== undefined ? currentScores[f.id] : f.baseScore;
    const weight = currentWeights[f.id] !== undefined ? currentWeights[f.id] : f.defaultWeight;
    
    weightedSum += score * weight;
    totalWeight += weight;

    return {
      id: f.id,
      name: f.name,
      score: Number(score.toFixed(2)),
      weight: Number(weight.toFixed(3)),
      weightedContribution: Number((score * weight).toFixed(3))
    };
  });

  const normalizedTotalWeight = totalWeight > 0 ? totalWeight : 1.0;
  const weightedAverageScore = weightedSum / normalizedTotalWeight;
  const attractivenessIndex = Math.max(0, Math.min(10, 10 - weightedAverageScore));

  let tier = 'Neutral';
  let badgeColor = 'amber';
  if (attractivenessIndex >= 6.5) {
    tier = 'Highly Favorable';
    badgeColor = 'lime';
  } else if (attractivenessIndex >= 4.5) {
    tier = 'Moderate Margin Pressures';
    badgeColor = 'cyan';
  } else if (attractivenessIndex >= 3.0) {
    tier = 'Intense Competitive Squeeze';
    badgeColor = 'amber';
  } else {
    tier = 'Hyper-Competitive Capital Burn';
    badgeColor = 'rose';
  }

  return {
    attractivenessIndex: Number(attractivenessIndex.toFixed(2)),
    weightedAverageScore: Number(weightedAverageScore.toFixed(2)),
    tier,
    badgeColor,
    breakdown
  };
}

/**
 * Computes Strategic Health Score for an individual firm (0-100)
 * Combines market share strength, growth relative to market, profitability, and industry buffer
 * @param {Object} firm 
 * @param {number} industryAttractivenessIndex 
 * @param {number} totalMarketGrowth 
 * @returns {number} Strategic Health Score [0 - 100]
 */
export function computeStrategicHealthScore(firm, industryAttractivenessIndex = 3.5, totalMarketGrowth = 58) {
  // 1. Market Share component (0-35 pts)
  const shareScore = Math.min(35, (firm.marketShare / 40) * 35);

  // 2. Growth outperformance component (0-25 pts)
  const growthRatio = totalMarketGrowth > 0 ? firm.annualGrowthRate / totalMarketGrowth : 1;
  const growthScore = Math.min(25, Math.max(0, growthRatio * 20));

  // 3. Contribution Margin / EBITDA health (0-20 pts)
  // Quick commerce ranges from -15% to 0% EBITDA currently
  const marginOffset = (firm.ebitdaMarginPercent + 15) / 15; // 0 at -15%, 1 at 0%
  const marginScore = Math.min(20, Math.max(0, marginOffset * 20));

  // 4. Industry Attractiveness insulation (0-20 pts)
  const industryBufferScore = (industryAttractivenessIndex / 10) * 20;

  const total = shareScore + growthScore + marginScore + industryBufferScore;
  return Math.round(Math.min(100, Math.max(10, total)));
}

