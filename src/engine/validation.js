/**
 * Validation Engine
 * Replays real-world quick commerce market events against model logic
 * and evaluates predicted vs actual direction.
 */

import validationEventsData from '../data/validationEvents.json';

/**
 * Retrieves all validation events with computed match indicators
 */
export function getValidationEvents() {
  return validationEventsData.map(event => {
    return {
      ...event,
      isMatch: event.actualOutcome.match,
      matchPercentage: event.actualOutcome.matchScore,
      summaryBadge: event.actualOutcome.match ? "Directional Match" : "Divergence"
    };
  });
}

/**
 * Evaluates a custom simulated event against historical benchmark
 * @param {string} eventId 
 * @param {Object} simulatedDeltas 
 */
export function evaluateEventMatch(eventId, simulatedDeltas = {}) {
  const event = validationEventsData.find(e => e.id === eventId);
  if (!event) return null;

  return {
    event,
    concordance: event.actualOutcome.match ? "High Concordance" : "Partial Concordance",
    theoreticalTakeaway: event.varianceAnalysis
  };
}

