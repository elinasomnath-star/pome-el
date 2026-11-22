/**
 * BCG Growth-Share Matrix Engine
 * Computes Relative Market Share (RMS), Market Growth, Quadrant classification,
 * and strategic prescriptions based on Henderson (1970).
 */

/**
 * Calculates Relative Market Share for a firm against its leading competitor
 * @param {Object} firm - Target firm object with revenue or marketShare
 * @param {Array} allFirms - Array of all competing firms
 * @returns {number} Relative market share (ratio, e.g. 1.41 or 0.71)
 */
export function calculateRelativeMarketShare(firm, allFirms) {
  if (!allFirms || allFirms.length <= 1) return 1.0;
  
  const competitors = allFirms.filter(f => f.id !== firm.id);
  const topCompetitorRevenue = Math.max(...competitors.map(f => f.revenue || f.marketShare));
  
  const firmMetric = firm.revenue || firm.marketShare;
  if (!topCompetitorRevenue || topCompetitorRevenue <= 0) return 1.0;
  
  const rms = firmMetric / topCompetitorRevenue;
  return Number(rms.toFixed(3));
}

/**
 * Classifies a business unit into one of the four BCG quadrants
 * @param {number} relativeMarketShare 
 * @param {number} growthRatePercent 
 * @param {number} growthThresholdPercent - Default 20%
 * @returns {'Stars' | 'Cash Cows' | 'Question Marks' | 'Dogs'}
 */
export function getBCGQuadrant(relativeMarketShare, growthRatePercent, growthThresholdPercent = 20) {
  const isHighShare = relativeMarketShare >= 1.0;
  const isHighGrowth = growthRatePercent >= growthThresholdPercent;
  
  if (isHighShare && isHighGrowth) return 'Stars';
  if (isHighShare && !isHighGrowth) return 'Cash Cows';
  if (!isHighShare && isHighGrowth) return 'Question Marks';
  return 'Dogs';
}

/**
 * Returns BCG Strategic Prescriptions & Cash Flow Dynamics
 * @param {'Stars' | 'Cash Cows' | 'Question Marks' | 'Dogs'} quadrant 
 * @returns {Object}
 */
export function getBCGPrescription(quadrant) {
  switch (quadrant) {
    case 'Stars':
      return {
        action: 'Build & Defend',
        cashFlow: 'Cash Neutral / High Reinvestment',
        recommendation: 'Aggressively reinvest gross profit into dark-store density, automated micro-fulfillment, and delivery speed to maintain scale leadership.',
        posdcorbPriority: 'Organizing & Budgeting'
      };
    case 'Cash Cows':
      return {
        action: 'Hold & Harvest',
        cashFlow: 'High Net Cash Inflow',
        recommendation: 'Defend market leadership with disciplined spending. Harvest surplus margins to cross-subsidize high-potential bets (e.g. Zepto Cafe, private label).',
        posdcorbPriority: 'Coordinating & Reporting'
      };
    case 'Question Marks':
      return {
        action: 'Build or Divest Dilemma',
        cashFlow: 'Heavy Cash Burn / Negative Cash Flow',
        recommendation: 'Decisive strategic crossroads: Either commit massive capital to challenge the leader for #1 position, or selectively niche down / exit.',
        posdcorbPriority: 'Planning & Directing'
      };
    case 'Dogs':
    default:
      return {
        action: 'Harvest or Divest',
        cashFlow: 'Low or Negative Cash Flow',
        recommendation: 'Minimize cash bleeding. Restructure towards high-margin specialty niches (e.g. organic fresh produce) or consolidate with a larger ecosystem.',
        posdcorbPriority: 'Budgeting & Staffing'
      };
  }
}

/**
 * Calculates complete BCG position metrics for all firms
 * @param {Array} firms 
 * @param {number} marketGrowthRate 
 * @returns {Array} Enhanced firms with rms, quadrant, and prescriptions
 */
export function computeBCGMetrics(firms, marketGrowthRate = 58.0) {
  return firms.map(firm => {
    const rms = calculateRelativeMarketShare(firm, firms);
    const growth = firm.annualGrowthRate !== undefined ? firm.annualGrowthRate : marketGrowthRate;
    const quadrant = getBCGQuadrant(rms, growth);
    const prescription = getBCGPrescription(quadrant);
    
    return {
      ...firm,
      relativeMarketShare: rms,
      effectiveGrowthRate: growth,
      quadrant,
      prescription
    };
  });
}

