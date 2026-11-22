/**
 * Elasticity Calculator Engine (POME Syllabus Unit IV)
 * Computes Arc (Midpoint) and Point Price Elasticity of Demand (PED) and Supply (PES),
 * provides full step-by-step mathematical solutions, classifications, and revenue impact analysis.
 */

/**
 * Computes Arc Elasticity of Demand using Midpoint Formula:
 * E_d = [ (Q2 - Q1) / ((Q1 + Q2) / 2) ] / [ (P2 - P1) / ((P1 + P2) / 2) ]
 */
export function calculateArcDemandElasticity(p1, p2, q1, q2) {
  const P1 = Number(p1);
  const P2 = Number(p2);
  const Q1 = Number(q1);
  const Q2 = Number(q2);

  const deltaQ = Q2 - Q1;
  const deltaP = P2 - P1;
  const avgQ = (Q1 + Q2) / 2;
  const avgP = (P1 + P2) / 2;

  if (deltaP === 0 || avgQ === 0 || avgP === 0) {
    return { error: "Price change or average quantity cannot be zero." };
  }

  const percentChangeQ = (deltaQ / avgQ) * 100;
  const percentChangeP = (deltaP / avgP) * 100;
  const arcValue = (deltaQ / avgQ) / (deltaP / avgP);
  const absoluteArc = Math.abs(arcValue);

  // Classification
  let classification = "Unitary Elastic";
  let badgeColor = "cyan";
  if (absoluteArc > 1.05) {
    classification = "Price Elastic (|Ed| > 1)";
    badgeColor = "pink";
  } else if (absoluteArc < 0.95) {
    classification = "Price Inelastic (|Ed| < 1)";
    badgeColor = "amber";
  }

  // Revenue Impact
  const revenue1 = P1 * Q1;
  const revenue2 = P2 * Q2;
  const revenueDelta = revenue2 - revenue1;
  let revenueInterpretation = "";

  if (revenueDelta > 0) {
    revenueInterpretation = deltaP > 0
      ? "Total Revenue increased because demand is inelastic (|Ed| < 1); higher price more than compensated for quantity drop."
      : "Total Revenue increased because price cut stimulated a proportionally larger volume increase (|Ed| > 1).";
  } else if (revenueDelta < 0) {
    revenueInterpretation = deltaP > 0
      ? "Total Revenue fell because price hike triggered a severe quantity contraction (|Ed| > 1)."
      : "Total Revenue fell because price discount was not offset by sufficient quantity growth (|Ed| < 1).";
  } else {
    revenueInterpretation = "Total Revenue unchanged (Unitary elasticity |Ed| = 1).";
  }

  return {
    P1, P2, Q1, Q2,
    deltaQ, deltaP, avgQ, avgP,
    percentChangeQ: Number(percentChangeQ.toFixed(2)),
    percentChangeP: Number(percentChangeP.toFixed(2)),
    arcValue: Number(arcValue.toFixed(3)),
    absoluteArc: Number(absoluteArc.toFixed(3)),
    classification,
    badgeColor,
    revenue1,
    revenue2,
    revenueDelta,
    revenueInterpretation,
    steps: [
      `Step 1: Calculate changes: ΔQ = Q₂ - Q₁ = ${Q2} - ${Q1} = ${deltaQ}, ΔP = P₂ - P₁ = ${P2} - ${P1} = ${deltaP}`,
      `Step 2: Calculate midpoints: Q̄ = (${Q1} + ${Q2}) / 2 = ${avgQ}, P̄ = (${P1} + ${P2}) / 2 = ${avgP}`,
      `Step 3: Calculate % changes: %ΔQ = (${deltaQ} / ${avgQ}) = ${(deltaQ / avgQ).toFixed(4)}, %ΔP = (${deltaP} / ${avgP}) = ${(deltaP / avgP).toFixed(4)}`,
      `Step 4: Arc Elasticity Ed = (%ΔQ / %ΔP) = ${arcValue.toFixed(4)} (|Ed| = ${absoluteArc.toFixed(3)})`,
      `Step 5: Revenue effect: TR₁ = ₹${revenue1.toLocaleString()} → TR₂ = ₹${revenue2.toLocaleString()} (ΔTR = ₹${revenueDelta.toLocaleString()})`
    ]
  };
}

/**
 * Computes Point Elasticity of Demand:
 * E_d = (ΔQ / Q1) / (ΔP / P1)
 */
export function calculatePointDemandElasticity(p1, p2, q1, q2) {
  const P1 = Number(p1);
  const P2 = Number(p2);
  const Q1 = Number(q1);
  const Q2 = Number(q2);

  const deltaQ = Q2 - Q1;
  const deltaP = P2 - P1;

  if (deltaP === 0 || Q1 === 0 || P1 === 0) {
    return { error: "Price change or initial values cannot be zero." };
  }

  const pointValue = (deltaQ / Q1) / (deltaP / P1);
  const absolutePoint = Math.abs(pointValue);

  return {
    pointValue: Number(pointValue.toFixed(3)),
    absolutePoint: Number(absolutePoint.toFixed(3)),
    formula: "Point Ed = (ΔQ / Q₁) / (ΔP / P₁)",
    step: `Point Ed = (${deltaQ} / ${Q1}) / (${deltaP} / ${P1}) = ${pointValue.toFixed(4)} (|Ed| = ${absolutePoint.toFixed(3)})`
  };
}

/**
 * Computes Price Elasticity of Supply (PES)
 */
export function calculateSupplyElasticity(p1, p2, q1, q2) {
  const P1 = Number(p1);
  const P2 = Number(p2);
  const Q1 = Number(q1);
  const Q2 = Number(q2);

  const deltaQ = Q2 - Q1;
  const deltaP = P2 - P1;
  const avgQ = (Q1 + Q2) / 2;
  const avgP = (P1 + P2) / 2;

  if (deltaP === 0 || avgQ === 0 || avgP === 0) {
    return { error: "Invalid price or quantity input." };
  }

  const arcPes = (deltaQ / avgQ) / (deltaP / avgP);
  let classification = "Unitary Elastic Supply (Es = 1)";
  if (arcPes > 1.05) classification = "Elastic Supply (Es > 1)";
  else if (arcPes < 0.95) classification = "Inelastic Supply (Es < 1)";

  return {
    P1, P2, Q1, Q2,
    arcPes: Number(arcPes.toFixed(3)),
    classification,
    formula: "Es = (%ΔQs) / (%ΔP)",
    explanation: `When price moved from ₹${P1} to ₹${P2}, quantity supplied moved from ${Q1} to ${Q2}, giving Es = ${arcPes.toFixed(3)}.`
  };
}

/**
 * Preloaded Syllabus Practice Problems
 */
export const PRACTICE_PROBLEMS = [
  {
    id: "prob_1",
    title: "Practice Problem 1: Delivery Fee Hike & Inelastic Demand",
    context: "Blinkit tests increasing delivery fee from ₹25 to ₹35 in Bangalore central. Daily orders dip slightly from 45,000 to 42,000.",
    p1: 25,
    p2: 35,
    q1: 45000,
    q2: 42000,
    type: "demand",
    solutionSummary: "Arc Ed = -0.207 (|Ed| = 0.21). Highly inelastic demand. Total revenue increases from ₹11,25,000 to ₹14,70,000 (+₹3,45,000/day)."
  },
  {
    id: "prob_2",
    title: "Practice Problem 2: Late-Night Monsoon Surge Pricing",
    context: "Zepto initiates late-night rain surge, raising delivery fee from ₹30 to ₹50. Order volume drops sharply from 30,000 to 18,000.",
    p1: 30,
    p2: 50,
    q1: 30000,
    q2: 18000,
    type: "demand",
    solutionSummary: "Arc Ed = -1.000 (|Ed| = 1.00). Unitary elasticity. Total revenue remains exactly ₹9,00,000. Customer volume dropped by 40%."
  },
  {
    id: "prob_3",
    title: "Practice Problem 3: Gig Rider Fleet Payout & Labor Supply",
    context: "Quick commerce platform increases rider incentive from ₹40 to ₹60 per order. Available delivery riders on duty expand from 1,200 to 2,100.",
    p1: 40,
    p2: 60,
    q1: 1200,
    q2: 2100,
    type: "supply",
    solutionSummary: "Arc Es = +1.364 (Es > 1). Elastic rider labor supply. Flexible gig riders swiftly log on when incentive rates increase by 50%."
  }
];

