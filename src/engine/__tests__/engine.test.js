import { describe, it, expect } from 'vitest';
import { calculateRelativeMarketShare, getBCGQuadrant, computeBCGMetrics } from '../bcg.js';
import { calculateIndustryAttractiveness, computeStrategicHealthScore } from '../forces.js';
import { applyShocks } from '../shocks.js';
import { calculateFirmDemand, calculateFirmProfit, simulatePriceRound, checkNashEquilibrium } from '../priceWar.js';
import { calculateOrgMetrics, generateOrgTree } from '../org.js';
import { runMonteCarloSimulation, createSeededRandom } from '../monteCarlo.js';
import { mapMetricToForceScore, getAllForceRubrics } from '../rubric.js';
import {
  calculateArcDemandElasticity,
  calculatePointDemandElasticity,
  calculateSupplyElasticity
} from '../elasticity.js';
import { computeTornadoSensitivity } from '../sensitivity.js';
import { generateShockTimeline } from '../timeline.js';
import { getValidationEvents } from '../validation.js';
import { getCalibrationReport } from '../calibration.js';

describe('BCG Matrix Engine', () => {
  const mockFirms = [
    { id: 'blinkit', revenue: 4000, marketShare: 40, annualGrowthRate: 60 },
    { id: 'zepto', revenue: 2800, marketShare: 28, annualGrowthRate: 80 },
    { id: 'swiggy', revenue: 2000, marketShare: 20, annualGrowthRate: 40 }
  ];

  it('calculates relative market share against top competitor', () => {
    const rmsLeader = calculateRelativeMarketShare(mockFirms[0], mockFirms);
    expect(rmsLeader).toBeGreaterThan(1.0);
    expect(rmsLeader).toBeCloseTo(1.429, 2);

    const rmsFollower = calculateRelativeMarketShare(mockFirms[1], mockFirms);
    expect(rmsFollower).toBeLessThan(1.0);
    expect(rmsFollower).toBeCloseTo(0.7, 2);
  });

  it('correctly classifies BCG quadrants', () => {
    expect(getBCGQuadrant(1.4, 60, 20)).toBe('Stars');
    expect(getBCGQuadrant(1.2, 10, 20)).toBe('Cash Cows');
    expect(getBCGQuadrant(0.7, 50, 20)).toBe('Question Marks');
    expect(getBCGQuadrant(0.5, 8, 20)).toBe('Dogs');
  });

  it('computes full BCG metrics for all firms', () => {
    const enriched = computeBCGMetrics(mockFirms);
    expect(enriched).toHaveLength(3);
    expect(enriched[0].quadrant).toBe('Stars');
    expect(enriched[1].quadrant).toBe('Question Marks');
  });
});

describe('Porter\'s Five Forces & Scoring Rubric Engine', () => {
  const mockForces = [
    { id: 'rivalry', name: 'Rivalry', baseScore: 9.0, defaultWeight: 0.3 },
    { id: 'newEntrants', name: 'Entrants', baseScore: 5.0, defaultWeight: 0.2 },
    { id: 'substitutes', name: 'Substitutes', baseScore: 6.0, defaultWeight: 0.2 },
    { id: 'buyerPower', name: 'Buyers', baseScore: 8.0, defaultWeight: 0.15 },
    { id: 'supplierPower', name: 'Suppliers', baseScore: 7.0, defaultWeight: 0.15 }
  ];

  it('computes Industry Attractiveness Index as 10 - weighted average', () => {
    const result = calculateIndustryAttractiveness(mockForces);
    expect(result.weightedAverageScore).toBeCloseTo(7.15, 1);
    expect(result.attractivenessIndex).toBeCloseTo(2.85, 1);
    expect(result.tier).toBe('Hyper-Competitive Capital Burn');
  });

  it('computes strategic health score within [0, 100]', () => {
    const firm = { marketShare: 35, annualGrowthRate: 70, ebitdaMarginPercent: -4 };
    const health = computeStrategicHealthScore(firm, 3.5, 60);
    expect(health).toBeGreaterThanOrEqual(0);
    expect(health).toBeLessThanOrEqual(100);
  });

  it('maps empirical metrics to force scores via rubric', () => {
    const rivalryMap = mapMetricToForceScore('rivalry', 95);
    expect(rivalryMap.score).toBe(9.5);
    expect(rivalryMap.activeThreshold.label).toContain('Hyper-Rivalrous');

    const capexMap = mapMetricToForceScore('newEntrants', 35);
    expect(capexMap.score).toBe(4.5);
  });

  it('retrieves all force rubrics with 5 dimensions', () => {
    const rubrics = getAllForceRubrics();
    expect(Object.keys(rubrics)).toHaveLength(5);
    expect(rubrics.rivalry).toBeDefined();
    expect(rubrics.supplierPower).toBeDefined();
  });
});

describe('Shock Lab Engine', () => {
  const mockForces = [{ id: 'rivalry', baseScore: 8.0, defaultWeight: 0.5 }];
  const mockFirms = [
    { id: 'f1', marketShare: 60, revenue: 600, annualGrowthRate: 40 },
    { id: 'f2', marketShare: 40, revenue: 400, annualGrowthRate: 40 }
  ];
  const shock = {
    id: 'test_shock',
    forceDeltas: { rivalry: 1.5 },
    marketGrowthDelta: 10,
    costDelta: 5,
    firmShareDeltas: { f1: -5, f2: 5 }
  };

  it('applies shock deltas and re-normalizes market shares', () => {
    const result = applyShocks(mockForces, mockFirms, [shock]);
    expect(result.updatedScores.rivalry).toBe(9.5);
    expect(result.cumulativeGrowthDelta).toBe(10);
    const totalShare = result.updatedFirms.reduce((sum, f) => sum + f.marketShare, 0);
    expect(Math.round(totalShare)).toBe(100);
  });

  it('generates an 8-quarter timeline with scaled shock propagation', () => {
    const activeWithParams = [
      { shock, severity: 1.5, durationQuarters: 4, startQuarter: 1 }
    ];
    const timeline = generateShockTimeline(mockForces, mockFirms, activeWithParams, 8);
    expect(timeline).toHaveLength(8);
    expect(timeline[0].activeShockCount).toBe(1);
    expect(timeline[5].activeShockCount).toBe(0);
  });
});

describe('Price War & Bertrand Oligopoly Engine', () => {
  const firms = [
    {
      id: 'f1',
      basePrice: 30,
      unitCost: 20,
      fixedCost: 120000,
      baseDemandCoeff: 100000,
      ownElasticity: 1.5,
      crossElasticities: { f2: 0.5 }
    },
    {
      id: 'f2',
      basePrice: 30,
      unitCost: 20,
      fixedCost: 120000,
      baseDemandCoeff: 100000,
      ownElasticity: 1.5,
      crossElasticities: { f1: 0.5 }
    }
  ];

  it('calculates downward sloping demand with own price elasticity', () => {
    const priceMapLow = { f1: 25, f2: 30 };
    const priceMapHigh = { f1: 35, f2: 30 };

    const demandLow = calculateFirmDemand(firms[0], priceMapLow, firms);
    const demandHigh = calculateFirmDemand(firms[0], priceMapHigh, firms);

    expect(demandLow).toBeGreaterThan(demandHigh);
  });

  it('computes correct profit Pi = Q * (P - c) - F', () => {
    const demand = 1000;
    const price = 30;
    const unitCost = 20;
    const fixedCost = 5000;
    const profit = calculateFirmProfit(demand, price, unitCost, fixedCost);
    expect(profit).toBe(1000 * (30 - 20) - 5000); // 5000
  });

  it('simulates a price round returning demand, profit, and market share', () => {
    const round = simulatePriceRound(firms, { f1: 30, f2: 30 });
    expect(round.firms.f1.profit).toBeDefined();
    expect(round.firms.f1.marketSharePercent).toBeCloseTo(50.0, 1);
  });

  it('evaluates Nash equilibrium and deviations', () => {
    const nashCheck = checkNashEquilibrium(firms, { f1: 30, f2: 30 }, 'oligopoly', {});
    expect(nashCheck.deviations).toBeDefined();
    expect(nashCheck.statusText).toBeDefined();
  });
});

describe('Elasticity Numerical Engine (Unit IV)', () => {
  it('computes Arc (Midpoint) Price Elasticity of Demand', () => {
    const result = calculateArcDemandElasticity(25, 35, 50000, 44000);
    expect(result.arcValue).toBeCloseTo(-0.383, 2);
    expect(result.absoluteArc).toBeLessThan(1.0);
    expect(result.classification).toContain('Inelastic');
    expect(result.revenueDelta).toBeGreaterThan(0);
  });

  it('computes Point Elasticity of Demand', () => {
    const pointRes = calculatePointDemandElasticity(25, 35, 50000, 44000);
    expect(pointRes.pointValue).toBeCloseTo(-0.30, 2);
    expect(pointRes.absolutePoint).toBeCloseTo(0.30, 2);
  });

  it('computes Price Elasticity of Supply (PES)', () => {
    const supplyRes = calculateSupplyElasticity(40, 60, 1000, 1800);
    expect(supplyRes.arcPes).toBeGreaterThan(1.0);
    expect(supplyRes.classification).toContain('Elastic');
  });
});

describe('Org Design Engine', () => {
  it('calculates management layers using log_span(headcount)', () => {
    const metrics = calculateOrgMetrics(1000, 10, 50, 5);
    expect(metrics.managementLayers).toBe(3);
    expect(metrics.coordinationCostIndex).toBeGreaterThan(0);
  });

  it('generates an organizational tree hierarchy', () => {
    const tree = generateOrgTree(3, 4, "Zepto");
    expect(tree.level).toBe(1);
    expect(tree.children.length).toBeGreaterThan(0);
    expect(tree.children[0].level).toBe(2);
  });
});

describe('Monte Carlo Simulation Engine & Reproducible PRNG', () => {
  const mockForces = [{ id: 'rivalry', baseScore: 8.0, defaultWeight: 1.0 }];
  const mockFirm = {
    basePrice: 30,
    unitCost: 20,
    fixedCost: 240000,
    ownElasticity: 1.5,
    baseDemandCoeff: 50000
  };

  it('runs stochastic iterations and returns empirical percentiles and histograms', () => {
    const result = runMonteCarloSimulation(mockForces, {}, {}, mockFirm, {}, 100, 42);
    expect(result.iterations).toBe(100);
    expect(result.seed).toBe(42);
    expect(result.attractiveness.p5).toBeLessThanOrEqual(result.attractiveness.p95);
    expect(result.profit.histogram.length).toBeGreaterThan(0);
  });

  it('produces 100% identical reproducible results when given the same seed', () => {
    const runA = runMonteCarloSimulation(mockForces, {}, {}, mockFirm, {}, 100, 42);
    const runB = runMonteCarloSimulation(mockForces, {}, {}, mockFirm, {}, 100, 42);
    expect(runA.attractiveness.mean).toBe(runB.attractiveness.mean);
    expect(runA.profit.mean).toBe(runB.profit.mean);
    expect(runA.profit.p50).toBe(runB.profit.p50);
  });
});

describe('Sensitivity Tornado Engine', () => {
  const mockForces = [
    { id: 'rivalry', baseScore: 9.0, defaultWeight: 0.3 },
    { id: 'buyerPower', baseScore: 7.8, defaultWeight: 0.2 },
    { id: 'newEntrants', baseScore: 4.5, defaultWeight: 0.15 }
  ];
  const mockTargetFirm = {
    id: 'zepto',
    basePrice: 32,
    unitCost: 23.5,
    fixedCost: 3800000,
    baseDemandCoeff: 350000,
    ownElasticity: 1.75,
    crossElasticities: { blinkit: 0.75 }
  };
  const mockFirms = [
    mockTargetFirm,
    { id: 'blinkit', basePrice: 35, unitCost: 22, fixedCost: 4500000, baseDemandCoeff: 420000, ownElasticity: 1.6 }
  ];

  it('computes sensitivity items sorted in descending order of output swing', () => {
    const sensitivity = computeTornadoSensitivity(mockForces, {}, {}, mockTargetFirm, mockFirms);
    expect(sensitivity.length).toBeGreaterThan(0);
    for (let i = 0; i < sensitivity.length - 1; i++) {
      expect(sensitivity[i].swing).toBeGreaterThanOrEqual(sensitivity[i + 1].swing);
    }
  });
});

describe('Empirical Validation & Calibration Split Engine', () => {
  it('evaluates calibrate-vs-test split and transparent metric counts', () => {
    const { events, summary } = getValidationEvents();
    expect(events.length).toBe(3);
    expect(summary.totalMetrics).toBe(12);
    expect(summary.totalMatched).toBe(11);
    expect(summary.totalVerified).toBe(10);
    expect(summary.totalUnverified).toBe(2);
    expect(summary.transparentCountText).toContain('11 of 12 tracked metrics matched direction');
    expect(summary.calibrationText).toContain('In-Sample Calibration: 4 of 4');
    expect(summary.testText).toContain('Out-of-Sample Test: 7 of 8');
  });

  it('provides full Event 1 parameter calibration specifications with frozen parameters', () => {
    const report = getCalibrationReport();
    expect(report.calibratedParameters.baselineFulfillmentCost.status).toBe('FROZEN');
    expect(report.calibratedParameters.baselineFulfillmentCost.calibratedValue).toBe(48.0);
    expect(report.calibratedParameters.storeDensityDecayAlpha.calibratedValue).toBe(0.32);
    expect(report.honestLimitations.length).toBeGreaterThanOrEqual(3);
  });
});
