import { create } from 'zustand';
import companiesData from '../data/companies.json';
import forcesData from '../data/forces.json';
import shocksData from '../data/shocks.json';
import priceWarConfigData from '../data/priceWarConfig.json';
import orgBaselineData from '../data/orgBaseline.json';

import { computeBCGMetrics } from '../engine/bcg.js';
import { calculateIndustryAttractiveness, computeStrategicHealthScore } from '../engine/forces.js';
import { applyShocks } from '../engine/shocks.js';
import { simulatePriceRound, checkNashEquilibrium, getAIPriceChoice } from '../engine/priceWar.js';
import { calculateOrgMetrics, generateOrgTree } from '../engine/org.js';
import { recommendCompetitiveStrategy } from '../engine/recommender.js';
import { runMonteCarloSimulation } from '../engine/monteCarlo.js';
import { generateShockTimeline } from '../engine/timeline.js';

export const useSimStore = create((set, get) => {
  // Initial baseline computations
  const initialFirms = companiesData;
  const initialForces = forcesData.forces;
  const initialScores = {};
  const initialWeights = {};
  initialForces.forEach(f => {
    initialScores[f.id] = f.baseScore;
    initialWeights[f.id] = f.defaultWeight;
  });

  const initialAttractiveness = calculateIndustryAttractiveness(initialForces, initialScores, initialWeights);
  const initialBCG = computeBCGMetrics(initialFirms, 58.0);

  // Price war initial state
  const initialPriceWarFirms = priceWarConfigData.firms;
  const initialPrices = {};
  initialPriceWarFirms.forEach(f => {
    initialPrices[f.id] = f.basePrice;
  });

  const firstRoundSim = simulatePriceRound(
    initialPriceWarFirms,
    initialPrices,
    'oligopoly',
    priceWarConfigData.marketConfig.structures
  );

  const firstRoundNash = checkNashEquilibrium(
    initialPriceWarFirms,
    initialPrices,
    'oligopoly',
    priceWarConfigData.marketConfig.structures
  );

  // Org initial state
  const initialOrg = orgBaselineData.defaultConfig;
  const initialOrgMetrics = calculateOrgMetrics(
    initialOrg.headcount,
    initialOrg.spanOfControl,
    initialOrg.centralizationPercent,
    initialOrg.formalizationLevel
  );
  const initialOrgTree = generateOrgTree(initialOrgMetrics.managementLayers, initialOrg.spanOfControl, "Zepto");

  return {
    // Navigation & View
    activeTab: 'overview',
    setActiveTab: (tab) => set({ activeTab: tab }),

    // Selected Firm
    selectedCompanyId: 'zepto',
    setSelectedCompanyId: (id) => set({ selectedCompanyId: id }),

    // Companies & Baseline
    baselineCompanies: companiesData,
    currentCompanies: initialFirms,

    // Forces
    baselineForces: initialForces,
    currentForceScores: initialScores,
    currentForceWeights: initialWeights,
    industryAttractiveness: initialAttractiveness,

    // BCG
    bcgMetrics: initialBCG,

    // Shocks
    allShocks: shocksData,
    activeShocks: [],
    shockHistory: [],
    shockParams: {
      new_funded_entrant: { severity: 1.0, durationQuarters: 4 },
      price_war: { severity: 1.0, durationQuarters: 4 },
      gst_regulation_spike: { severity: 1.0, durationQuarters: 4 },
      supplier_cost_spike: { severity: 1.0, durationQuarters: 4 },
      funding_drought: { severity: 1.0, durationQuarters: 4 }
    },

    // Price War State
    priceWarFirms: initialPriceWarFirms,
    priceWarPrices: initialPrices,
    marketStructure: 'oligopoly',
    currentRound: 1,
    maxRounds: 12,
    priceHistory: [
      {
        round: 1,
        prices: { ...initialPrices },
        results: firstRoundSim,
        nash: firstRoundNash
      }
    ],
    cumulativeProfits: {
      zepto: firstRoundSim.firms.zepto?.profit || 0,
      blinkit: firstRoundSim.firms.blinkit?.profit || 0,
      swiggy_instamart: firstRoundSim.firms.swiggy_instamart?.profit || 0,
      bigbasket_now: firstRoundSim.firms.bigbasket_now?.profit || 0
    },
    gameModeActive: false,
    gameCompleted: false,
    finalScore: 0,
    nashStatus: firstRoundNash,

    // Org Design State
    orgConfig: initialOrg,
    orgMetrics: initialOrgMetrics,
    orgTree: initialOrgTree,

    // Monte Carlo Results Cache
    monteCarloResults: null,
    isMonteCarloRunning: false,
    monteCarloSeed: 42,
    setMonteCarloSeed: (seed) => set({ monteCarloSeed: Number(seed) }),

    // ================= ACTIONS ================= //

    // Update individual force score slider
    setForceScore: (forceId, score) => {
      const { baselineForces, currentForceScores, currentForceWeights, currentCompanies, selectedCompanyId } = get();
      const updatedScores = { ...currentForceScores, [forceId]: score };
      const newAttr = calculateIndustryAttractiveness(baselineForces, updatedScores, currentForceWeights);
      
      set({
        currentForceScores: updatedScores,
        industryAttractiveness: newAttr
      });
    },

    // Update force weight
    setForceWeight: (forceId, weight) => {
      const { baselineForces, currentForceScores, currentForceWeights } = get();
      const updatedWeights = { ...currentForceWeights, [forceId]: Math.max(0.01, Number(weight)) };
      const newAttr = calculateIndustryAttractiveness(baselineForces, currentForceScores, updatedWeights);

      set({
        currentForceWeights: updatedWeights,
        industryAttractiveness: newAttr
      });
    },

    // Update Shock Severity
    setShockSeverity: (shockId, severity) => {
      const { shockParams, baselineForces, baselineCompanies, activeShocks, currentForceWeights } = get();
      const updatedParams = {
        ...shockParams,
        [shockId]: { ...(shockParams[shockId] || { durationQuarters: 4 }), severity: Number(severity) }
      };

      // Reapply with new severity
      const scaledShocks = activeShocks.map(s => {
        const sev = updatedParams[s.id]?.severity || 1.0;
        const scaledForceDeltas = {};
        if (s.forceDeltas) {
          Object.entries(s.forceDeltas).forEach(([k, v]) => { scaledForceDeltas[k] = v * sev; });
        }
        return {
          ...s,
          forceDeltas: scaledForceDeltas,
          marketGrowthDelta: (s.marketGrowthDelta || 0) * sev,
          costDelta: (s.costDelta || 0) * sev
        };
      });

      const { updatedScores, cumulativeGrowthDelta, updatedFirms } = applyShocks(
        baselineForces,
        baselineCompanies,
        scaledShocks
      );
      const newAttr = calculateIndustryAttractiveness(baselineForces, updatedScores, currentForceWeights);
      const newBCG = computeBCGMetrics(updatedFirms, 58.0 + cumulativeGrowthDelta);

      set({
        shockParams: updatedParams,
        currentForceScores: updatedScores,
        currentCompanies: updatedFirms,
        industryAttractiveness: newAttr,
        bcgMetrics: newBCG
      });
    },

    // Update Shock Duration
    setShockDuration: (shockId, duration) => {
      const { shockParams } = get();
      const updatedParams = {
        ...shockParams,
        [shockId]: { ...(shockParams[shockId] || { severity: 1.0 }), durationQuarters: Number(duration) }
      };
      set({ shockParams: updatedParams });
    },

    // Toggle Shock on / off
    toggleShock: (shockId) => {
      const { baselineForces, baselineCompanies, allShocks, activeShocks, shockHistory, currentForceWeights } = get();
      const shockObj = allShocks.find(s => s.id === shockId);
      if (!shockObj) return;

      const isAlreadyActive = activeShocks.some(s => s.id === shockId);
      const newActiveShocks = isAlreadyActive
        ? activeShocks.filter(s => s.id !== shockId)
        : [...activeShocks, shockObj];

      // Recompute shock transformations
      const { updatedScores, cumulativeGrowthDelta, updatedFirms } = applyShocks(
        baselineForces,
        baselineCompanies,
        newActiveShocks
      );

      const newAttr = calculateIndustryAttractiveness(baselineForces, updatedScores, currentForceWeights);
      const newBCG = computeBCGMetrics(updatedFirms, 58.0 + cumulativeGrowthDelta);

      // Add to event timeline log if turning on
      let newHistory = [...shockHistory];
      if (!isAlreadyActive) {
        newHistory.push({
          timestamp: new Date().toLocaleTimeString(),
          shock: shockObj,
          impactSummary: `Growth: ${shockObj.marketGrowthDelta > 0 ? '+' : ''}${shockObj.marketGrowthDelta}% | Cost: +${shockObj.costDelta}%`
        });
      }

      set({
        activeShocks: newActiveShocks,
        currentForceScores: updatedScores,
        currentCompanies: updatedFirms,
        industryAttractiveness: newAttr,
        bcgMetrics: newBCG,
        shockHistory: newHistory
      });
    },

    // Reset all shocks to baseline
    resetShocks: () => {
      const { baselineForces, baselineCompanies, currentForceWeights } = get();
      const resetScores = {};
      baselineForces.forEach(f => {
        resetScores[f.id] = f.baseScore;
      });

      const newAttr = calculateIndustryAttractiveness(baselineForces, resetScores, currentForceWeights);
      const newBCG = computeBCGMetrics(baselineCompanies, 58.0);

      set({
        activeShocks: [],
        currentForceScores: resetScores,
        currentCompanies: baselineCompanies,
        industryAttractiveness: newAttr,
        bcgMetrics: newBCG
      });
    },

    // Price War Actions
    setFirmPrice: (firmId, price) => {
      const { priceWarPrices, priceWarFirms, marketStructure } = get();
      const updated = { ...priceWarPrices, [firmId]: Number(price) };
      const nash = checkNashEquilibrium(priceWarFirms, updated, marketStructure, priceWarConfigData.marketConfig.structures);

      set({
        priceWarPrices: updated,
        nashStatus: nash
      });
    },

    setAIStrategy: (firmId, strategy) => {
      const { priceWarFirms } = get();
      const updatedFirms = priceWarFirms.map(f => f.id === firmId ? { ...f, aiStrategy: strategy } : f);
      set({ priceWarFirms: updatedFirms });
    },

    setMarketStructure: (struct) => {
      const { priceWarFirms, priceWarPrices } = get();
      const nash = checkNashEquilibrium(priceWarFirms, priceWarPrices, struct, priceWarConfigData.marketConfig.structures);
      set({
        marketStructure: struct,
        nashStatus: nash
      });
    },

    nextPriceRound: () => {
      const {
        priceWarFirms,
        priceWarPrices,
        marketStructure,
        currentRound,
        maxRounds,
        priceHistory,
        cumulativeProfits
      } = get();

      if (currentRound >= maxRounds) {
        set({ gameCompleted: true });
        return;
      }

      // Compute current round results
      const sim = simulatePriceRound(priceWarFirms, priceWarPrices, marketStructure, priceWarConfigData.marketConfig.structures);
      const nash = checkNashEquilibrium(priceWarFirms, priceWarPrices, marketStructure, priceWarConfigData.marketConfig.structures);

      // Accumulate profits
      const newCumulative = { ...cumulativeProfits };
      Object.keys(sim.firms).forEach(fid => {
        newCumulative[fid] = (newCumulative[fid] || 0) + sim.firms[fid].profit;
      });

      const updatedHistory = [
        ...priceHistory,
        {
          round: currentRound + 1,
          prices: { ...priceWarPrices },
          results: sim,
          nash
        }
      ];

      // Next round AI price choices based on AI rules
      const nextPrices = { ...priceWarPrices };
      priceWarFirms.forEach(firm => {
        if (!firm.isUser) {
          nextPrices[firm.id] = getAIPriceChoice(firm, updatedHistory, priceWarFirms);
        }
      });

      const nextRoundNum = currentRound + 1;
      const isComplete = nextRoundNum >= maxRounds;

      // Score calculation (Profits in Lakhs + market share bonus)
      const userProfitTotal = newCumulative['zepto'] || 0;
      const score = Math.max(0, Math.round(userProfitTotal / 10000));

      set({
        currentRound: nextRoundNum,
        priceWarPrices: nextPrices,
        priceHistory: updatedHistory,
        cumulativeProfits: newCumulative,
        nashStatus: nash,
        gameCompleted: isComplete,
        finalScore: score
      });
    },

    resetPriceWar: () => {
      const { priceWarFirms, marketStructure } = get();
      const resetPrices = {};
      priceWarFirms.forEach(f => {
        resetPrices[f.id] = f.basePrice;
      });

      const firstSim = simulatePriceRound(priceWarFirms, resetPrices, marketStructure, priceWarConfigData.marketConfig.structures);
      const firstNash = checkNashEquilibrium(priceWarFirms, resetPrices, marketStructure, priceWarConfigData.marketConfig.structures);

      set({
        currentRound: 1,
        priceWarPrices: resetPrices,
        priceHistory: [
          {
            round: 1,
            prices: { ...resetPrices },
            results: firstSim,
            nash: firstNash
          }
        ],
        cumulativeProfits: {
          zepto: firstSim.firms.zepto?.profit || 0,
          blinkit: firstSim.firms.blinkit?.profit || 0,
          swiggy_instamart: firstSim.firms.swiggy_instamart?.profit || 0,
          bigbasket_now: firstSim.firms.bigbasket_now?.profit || 0
        },
        gameModeActive: false,
        gameCompleted: false,
        finalScore: 0,
        nashStatus: firstNash
      });
    },

    // Org Design Actions
    setOrgConfig: (key, value) => {
      const { orgConfig, selectedCompanyId, baselineCompanies } = get();
      const updated = { ...orgConfig, [key]: Number(value) };
      const metrics = calculateOrgMetrics(
        updated.headcount,
        updated.spanOfControl,
        updated.centralizationPercent,
        updated.formalizationLevel
      );
      const companyName = baselineCompanies.find(c => c.id === selectedCompanyId)?.name || "Zepto";
      const tree = generateOrgTree(metrics.managementLayers, updated.spanOfControl, companyName);

      set({
        orgConfig: updated,
        orgMetrics: metrics,
        orgTree: tree
      });
    },

    // Monte Carlo Runner with Seeded PRNG
    runMonteCarlo: (customSeed) => {
      const { baselineForces, currentForceScores, currentForceWeights, priceWarFirms, selectedCompanyId, monteCarloSeed } = get();
      const seedToUse = customSeed !== undefined ? Number(customSeed) : (monteCarloSeed || 42);
      set({ isMonteCarloRunning: true, monteCarloSeed: seedToUse });

      const targetFirm = priceWarFirms.find(f => f.id === selectedCompanyId) || priceWarFirms[0];
      
      // Run with slight delay so UI shows loading animation
      setTimeout(() => {
        const results = runMonteCarloSimulation(
          baselineForces,
          currentForceScores,
          currentForceWeights,
          targetFirm,
          priceWarConfigData,
          1000,
          seedToUse
        );

        set({
          monteCarloResults: results,
          isMonteCarloRunning: false
        });
      }, 50);
    }
  };
});

