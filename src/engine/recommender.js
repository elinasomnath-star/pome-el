/**
 * Strategic Recommender Engine
 * Implements Michael Porter's Generic Competitive Strategies (Cost Leadership, Differentiation, Focus)
 * combined with BCG prescriptions and explicit rule-firing trace.
 */

/**
 * Recommends a strategic positioning for a given firm based on operational parameters and industry conditions
 * @param {Object} firm - Target firm object
 * @param {Object} forcesMetrics - Current Five Forces attractiveness breakdown
 * @param {Object} bcgMetrics - Firm's BCG quadrant & metrics
 * @returns {Object} Strategy recommendation with fired rules and explanation
 */
export function recommendCompetitiveStrategy(firm, forcesMetrics, bcgMetrics) {
  const firedRules = [];
  let strategy = 'Differentiation';
  let badgeColor = 'violet';
  let rationale = '';
  let strategicPriorities = [];

  const marketShare = firm.marketShare || 25;
  const deliveryTime = firm.avgDeliveryTimeMin || 12;
  const darkStoreCount = firm.darkStoreCount || 400;
  const aov = firm.avgOrderValueINR || 550;
  const ebitdaMargin = firm.ebitdaMarginPercent || -8;
  const quadrant = bcgMetrics?.quadrant || 'Question Marks';

  // Rule 1: High Market Share + Dense Dark Stores -> Cost Leadership via Economies of Scale
  if (marketShare >= 35 && darkStoreCount >= 500) {
    firedRules.push({
      ruleId: 'RULE_SCALE_DENSITY',
      description: 'Market share >= 35% AND dark stores >= 500: Achieves minimum efficient scale in rider density and warehouse fixed cost absorption.'
    });
    strategy = 'Cost Leadership';
    badgeColor = 'cyan';
    rationale = `${firm.name} holds dominant market share (${marketShare}%) and dark store density (${darkStoreCount} stores). Its strategic imperative is Cost Leadership: driving order density to lower per-drop rider transit costs, squeezing supplier margins via volume procurement, and establishing a low-cost delivery moat.`;
    strategicPriorities = [
      'Maximize order density per dark store cluster (target >1,500 orders/day)',
      'Automate picking with micro-fulfillment routing algorithms',
      'Leverage bulk procurement discounts with top-tier FMCG brands'
    ];
  }
  // Rule 1b: Very low share (<15%) irrespective of AOV — cannot sustain broad Differentiation war
  else if (marketShare < 15) {
    firedRules.push({
      ruleId: 'RULE_NICHE_FOCUS',
      description: 'Market share < 15%: Cannot sustain direct price war against top 2 leaders. Must focus on defined customer niche or geography.'
    });
    strategy = 'Focused Differentiation';
    badgeColor = 'lime';
    rationale = `${firm.name} holds ${marketShare}% share. Fighting an unconstrained broad-market price war would rapidly deplete capital. It must pursue Focus: dominating scheduled fresh produce, organic staples, and integrated corporate loyalty ecosystems.`;
    strategicPriorities = [
      'Dominate fresh fruits, vegetables, and farm-to-table traceability',
      'Integrate deeply with parent ecosystem loyalty (e.g. Tata Neu coins)',
      'Selectively exit low-density Tier-2 pincodes to stem EBITDA bleed'
    ];
  }
  // Rule 2: Sub-10 min delivery OR High-margin specialty niches (Zepto Cafe, gourmet) -> Differentiation
  else if (deliveryTime <= 10.5 || aov >= 650) {
    firedRules.push({
      ruleId: 'RULE_SPEED_DIFFERENTIATION',
      description: 'Delivery time <= 10.5 min OR Average Order Value >= ₹650: Positions on superior speed premium and high-margin product curation.'
    });
    strategy = 'Differentiation';
    badgeColor = 'pink';
    rationale = `${firm.name} excels in ultra-fast delivery (${deliveryTime} mins) and high customer affinity. Its strategic imperative is Differentiation: rather than entering a destructive price war with the scale leader, it should build loyalty through Zepto Cafe / hot food, high-velocity fresh items, and private-label margins.`;
    strategicPriorities = [
      'Expand proprietary high-margin categories (Cafe, ready-to-eat, fresh bakery)',
      'Protect sub-10 minute delivery SLA as a premium brand differentiator',
      'Monetize retail media network (brand ads inside search and checkout)'
    ];
  }
  // Rule 4: Moderate share with integrated cross-sell -> Platform Cost & Service Focus
  else {
    firedRules.push({
      ruleId: 'RULE_HYBRID_ECOSYSTEM',
      description: 'Moderate share (15-35%) with parent multi-service platform: Cross-sell synergy strategy.'
    });
    strategy = 'Ecosystem Differentiation';
    badgeColor = 'amber';
    rationale = `${firm.name} leverages cross-app synergies. It should utilize bundled subscriptions (e.g., Swiggy One) to lower customer acquisition costs while maintaining selective geographic parity.`;
    strategicPriorities = [
      'Increase multi-service subscriber penetration to depress churn',
      'Optimize delivery fleet sharing between food delivery and quick grocery',
      'Grow non-grocery high-margin categories (electronics, cosmetics, toys)'
    ];
  }

  // BCG Alignment
  let bcgAction = 'Build';
  if (quadrant === 'Stars') bcgAction = 'Build & Defend';
  else if (quadrant === 'Cash Cows') bcgAction = 'Hold & Harvest';
  else if (quadrant === 'Question Marks') bcgAction = 'Build aggressively or Pivot';
  else bcgAction = 'Harvest or Divest';

  return {
    strategy,
    badgeColor,
    rationale,
    bcgQuadrant: quadrant,
    bcgAction,
    strategicPriorities,
    firedRules
  };
}

