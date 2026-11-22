import { describe, it, expect } from 'vitest';
import { calculateRelativeMarketShare, getBCGQuadrant, computeBCGMetrics } from '../bcg.js';
import { calculateIndustryAttractiveness, computeStrategicHealthScore } from '../forces.js';
import { applyShocks } from '../shocks.js';
import { calculateFirmDemand, calculateFirmProfit, simulatePriceRound, checkNashEquilibrium } from '../priceWar.js';
import { calculateOrgMetrics, generateOrgTree } from '../org.js';
import { runMonteCarloSimulation } from '../monteCarlo.js';
import { mapMetricToForceScore, getAllForceRubrics } from '../rubric.js';
import {
  calculateArcDemandElasticity,
  calculatePointDemandElasticity,
  calculateSupplyElasticity
} from '../elasticity.js';
import { computeTornadoSensitivity } from '../sensitivity.js';
import { generateShockTimeline } from '../timeline.js';
import { getValidationEvents } from '../validation.js';

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

describe('Elasticity Numerical Engine (Unit IV)', () => {
  it('computes Arc (Midpoint) Price Elasticity of Demand', () => {
    // P1=25, P2=35, Q1=50000, Q2=44000
    // dQ = -6000, avgQ = 47000, %dQ = -0.127659
    // dP = 10, avgP = 30, %dP = 0.333333
    // Ed = -0.127659 / 0.333333 = -0.383 (Inelastic)
    const result = calculateArcDemandElasticity(25, 35, 50000, 44000);
    expect(result.arcValue).toBeCloseTo(-0.383, 2);
    expect(result.absoluteArc).toBeLessThan(1.0);
    expect(result.classification).toContain('Inelastic');
    expect(result.revenueDelta).toBeGreaterThan(0); // Price hike in inelastic zone increases revenue
  });

  it('computes Point Elasticity of Demand', () => {
    const pointRes = calculatePointDemandElasticity(25, 35, 50000, 44000);
    // ( -6000 / 50000 ) / ( 10 / 25 ) = -0.12 / 0.40 = -0.30
    expect(pointRes.pointValue).toBeCloseTo(-0.30, 2);
    expect(pointRes.absolutePoint).toBeCloseTo(0.30, 2);
  });

  it('computes Price Elasticity of Supply (PES)', () => {
    // Rider incentive increases from 40 to 60, fleet expands from 1000 to 1800
    // dQ = 800, avgQ = 1400 -> 0.5714
    // dP = 20, avgP = 50 -> 0.4000
    // Es = 0.5714 / 0.4 = 1.428 (Elastic supply)
    const supplyRes = calculateSupplyElasticity(40, 60, 1000, 1800);
    expect(supplyRes.arcPes).toBeGreaterThan(1.0);
    expect(supplyRes.classification).toContain('Elastic');
  });
});

describe('Shock Severity & Multi-Quarter Timeline Engine', () => {
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

  it('generates an 8-quarter timeline with scaled shock propagation', () => {
    const activeWithParams = [
      { shock, severity: 1.5, durationQuarters: 4, startQuarter: 1 }
    ];
    const timeline = generateShockTimeline(mockForces, mockFirms, activeWithParams, 8);
    expect(timeline).toHaveLength(8);
    // Q1 should have 1 active shock
    expect(timeline[0].activeShockCount).toBe(1);
    // Q6 (after 4 quarters duration) should return to baseline 0 active shocks
    expect(timeline[5].activeShockCount).toBe(0);
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
    // Check descending order of swing
    for (let i = 0; i < sensitivity.length - 1; i++) {
      expect(sensitivity[i].swing).toBeGreaterThanOrEqual(sensitivity[i + 1].swing);
    }
  });
});

describe('Empirical Validation & Calibrate-vs-Test Split Engine', () => {
  it('evaluates calibrate-vs-test split and transparent metric counts', () => {
    const { events, summary } = getValidationEvents();
    expect(events.length).toBe(3);
    expect(summary.totalMetrics).toBe(12);
    expect(summary.totalMatched).toBe(11); // 11 of 12 metrics matched
    expect(summary.transparentCountText).toContain('11 of 12 tracked metrics matched direction');
    expect(summary.calibrationText).toContain('In-Sample Calibration: 4 of 4');
    expect(summary.testText).toContain('Out-of-Sample Test: 7 of 8');
  });
});
