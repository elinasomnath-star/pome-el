/**
 * Price War & Oligopoly Simulation Engine
 * Implements constant-elasticity demand system: Q_i = A_i * P_i^(-e_ii) * Prod(P_j^(e_ij))
 * Profit: Pi_i = Q_i * (P_i - c_i) - F_i
 * Includes Nash equilibrium detection, AI rule execution, and 12-round game dynamics.
 */

/**
 * Calculates demand for a single firm given all current prices
 * @param {Object} firm - Target firm config
 * @param {Object} priceMap - Map of firmId -> price
 * @param {Array} allFirms - All active firms
 * @param {string} marketStructure - 'oligopoly' | 'monopolistic'
 * @param {Object} structureConfigs - Multipliers from config
 * @returns {number} Demand quantity Q_i
 */
export function calculateFirmDemand(firm, priceMap, allFirms, marketStructure = 'oligopoly', structureConfigs = {}) {
  const currentPrice = Math.max(1.0, priceMap[firm.id] || firm.basePrice);
  const struct = structureConfigs[marketStructure] || { ownElasticityMultiplier: 1.0, crossElasticityMultiplier: 1.0 };
  
  const ownElasticity = firm.ownElasticity * (struct.ownElasticityMultiplier || 1.0);
  const crossMultiplier = struct.crossElasticityMultiplier || 1.0;

  // Base term: A_i * P_i^(-ownElasticity)
  let demand = firm.baseDemandCoeff * Math.pow(currentPrice, -ownElasticity);

  // Cross-price terms: Prod(P_j^(e_ij * crossMultiplier))
  allFirms.forEach(competitor => {
    if (competitor.id !== firm.id) {
      const compPrice = Math.max(1.0, priceMap[competitor.id] || competitor.basePrice);
      const crossElasticity = (firm.crossElasticities?.[competitor.id] || 0.3) * crossMultiplier;
      
      // Standardize cross term around baseline price ratio
      const priceRatio = compPrice / (competitor.basePrice || 30.0);
      demand *= Math.pow(Math.max(0.2, priceRatio), crossElasticity);
    }
  });

  return Math.max(100, Math.round(demand));
}

/**
 * Computes profit for a given demand, price, unit cost, and fixed cost
 * @param {number} demand 
 * @param {number} price 
 * @param {number} unitCost 
 * @param {number} fixedCostPerRound 
 * @returns {number} Profit (in INR)
 */
export function calculateFirmProfit(demand, price, unitCost, fixedCostPerRound) {
  const contributionMargin = price - unitCost;
  const totalContribution = demand * contributionMargin;
  return Math.round(totalContribution - fixedCostPerRound);
}

/**
 * Executes a round of price war simulation across active firms
 * @param {Array} activeFirms 
 * @param {Object} priceMap - Map of firmId -> chosen price for this round
 * @param {string} marketStructure 
 * @param {Object} structureConfigs 
 * @returns {Object} Round result with demand, profit, marketShare, and margins
 */
export function simulatePriceRound(activeFirms, priceMap, marketStructure = 'oligopoly', structureConfigs = {}) {
  const firmResults = {};
  let totalMarketDemand = 0;

  activeFirms.forEach(firm => {
    const price = priceMap[firm.id] || firm.basePrice;
    const demand = calculateFirmDemand(firm, priceMap, activeFirms, marketStructure, structureConfigs);
    const fixedCostPerRound = firm.fixedCost / 12; // Monthly fixed cost amortized per round
    const profit = calculateFirmProfit(demand, price, firm.unitCost, fixedCostPerRound);
    const revenue = Math.round(demand * price);

    totalMarketDemand += demand;
    firmResults[firm.id] = {
      price,
      demand,
      revenue,
      profit,
      unitMargin: Number((price - firm.unitCost).toFixed(2)),
      marginPercent: Number((((price - firm.unitCost) / price) * 100).toFixed(1))
    };
  });

  // Calculate market shares for this round
  activeFirms.forEach(firm => {
    const d = firmResults[firm.id].demand;
    firmResults[firm.id].marketSharePercent = totalMarketDemand > 0
      ? Number(((d / totalMarketDemand) * 100).toFixed(1))
      : 0;
  });

  return {
    totalMarketDemand,
    firms: firmResults
  };
}

/**
 * Calculates the Best Response price for a firm given rivals' fixed prices
 * Scans candidate prices between minPrice and maxPrice
 */
export function findBestResponsePrice(targetFirm, priceMap, allFirms, marketStructure, structureConfigs) {
  const minP = Math.max(targetFirm.unitCost + 0.5, targetFirm.minPrice || 10);
  const maxP = targetFirm.maxPrice || 70;
  const steps = 60;
  const stepSize = (maxP - minP) / steps;

  let bestPrice = minP;
  let maxProfit = -Infinity;

  const tempPriceMap = { ...priceMap };

  for (let p = minP; p <= maxP; p += stepSize) {
    tempPriceMap[targetFirm.id] = p;
    const demand = calculateFirmDemand(targetFirm, tempPriceMap, allFirms, marketStructure, structureConfigs);
    const fixedCostPerRound = targetFirm.fixedCost / 12;
    const profit = calculateFirmProfit(demand, p, targetFirm.unitCost, fixedCostPerRound);

    if (profit > maxProfit) {
      maxProfit = profit;
      bestPrice = p;
    }
  }

  return {
    bestPrice: Number(bestPrice.toFixed(1)),
    maxProfit
  };
}

/**
 * Checks whether current price vector is at or near Nash Equilibrium
 * @returns {Object} { isNash, deviationGains, explanation }
 */
export function checkNashEquilibrium(activeFirms, currentPriceMap, marketStructure, structureConfigs) {
  let isNash = true;
  const deviations = {};
  let totalPotentialGain = 0;

  activeFirms.forEach(firm => {
    const currentPrice = currentPriceMap[firm.id] || firm.basePrice;
    const currentDemand = calculateFirmDemand(firm, currentPriceMap, activeFirms, marketStructure, structureConfigs);
    const currentProfit = calculateFirmProfit(currentDemand, currentPrice, firm.unitCost, firm.fixedCost / 12);

    const { bestPrice, maxProfit } = findBestResponsePrice(firm, currentPriceMap, activeFirms, marketStructure, structureConfigs);
    const potentialGain = Math.max(0, maxProfit - currentProfit);

    const priceGapPercent = Math.abs((currentPrice - bestPrice) / bestPrice) * 100;
    const isAtOptimal = priceGapPercent <= 4.0; // Within 4% is considered Nash equilibrium tolerance

    if (!isAtOptimal) {
      isNash = false;
    }

    totalPotentialGain += potentialGain;
    deviations[firm.id] = {
      currentPrice,
      bestPrice,
      currentProfit,
      maxProfit,
      potentialGain,
      isAtOptimal
    };
  });

  return {
    isNash,
    totalPotentialGain,
    deviations,
    statusText: isNash
      ? "Market is in Nash Equilibrium (no firm can profitably deviate unilaterally)"
      : "Unstable: At least one firm can increase profits by altering price"
  };
}

/**
 * Computes AI price choice for a given strategy and history
 * @param {Object} firm 
 * @param {Array} history - Array of previous round results
 * @param {Object} currentRivals - Array of all firms
 * @returns {number} Chosen AI price for next round
 */
export function getAIPriceChoice(firm, history, allFirms) {
  const strategy = firm.aiStrategy || 'hold';
  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  if (!lastRound) {
    return firm.basePrice;
  }

  const competitorPrices = allFirms
    .filter(f => f.id !== firm.id)
    .map(f => lastRound.prices?.[f.id] || f.basePrice);

  const minCompetitorPrice = Math.min(...competitorPrices);
  const userPrice = lastRound.prices?.['zepto'] || minCompetitorPrice;

  switch (strategy) {
    case 'match':
      // Match lowest competitor price, bounded by unit cost
      return Math.max(firm.unitCost + 1.0, Number(minCompetitorPrice.toFixed(1)));

    case 'undercut':
      // Undercut lowest price by 5-8%
      const undercutTarget = minCompetitorPrice * 0.94;
      return Math.max(firm.unitCost + 0.5, Number(undercutTarget.toFixed(1)));

    case 'hold':
      // Stick to baseline price
      return firm.basePrice;

    case 'tit_for_tat':
      // If user or any rival undercut below base, match their price; otherwise hold
      if (minCompetitorPrice < firm.basePrice * 0.92) {
        return Math.max(firm.unitCost + 1.0, Number(minCompetitorPrice.toFixed(1)));
      }
      return firm.basePrice;

    default:
      return firm.basePrice;
  }
}

