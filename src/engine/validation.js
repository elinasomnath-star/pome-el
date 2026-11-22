/**
 * Validation Engine
 * Replays real-world quick commerce market events against model logic
 * with Calibrate-vs-Test split and transparent directional metric counts.
 */

import validationData from '../data/validationEvents.json';

/**
 * Retrieves all validation events with computed match counts and calibrate-vs-test split
 */
export function getValidationEvents() {
  const events = validationData.events || [];

  let totalMetrics = 0;
  let totalMatched = 0;
  let calibrationMetrics = 0;
  let calibrationMatched = 0;
  let testMetrics = 0;
  let testMatched = 0;

  const enrichedEvents = events.map(event => {
    const matchedCount = event.trackedMetrics.filter(m => m.match).length;
    const totalCount = event.trackedMetrics.length;
    const isCalibration = event.split === 'in_sample_calibration';

    totalMetrics += totalCount;
    totalMatched += matchedCount;

    if (isCalibration) {
      calibrationMetrics += totalCount;
      calibrationMatched += matchedCount;
    } else {
      testMetrics += totalCount;
      testMatched += matchedCount;
    }

    return {
      ...event,
      metricsMatched: matchedCount,
      metricsTotal: totalCount,
      matchPercentage: Math.round((matchedCount / totalCount) * 100),
      summaryBadge: matchedCount === totalCount ? "Full Directional Match" : "Partial Concordance"
    };
  });

  return {
    events: enrichedEvents,
    summary: {
      totalMetrics,
      totalMatched,
      transparentCountText: `${totalMatched} of ${totalMetrics} tracked metrics matched direction across 3 events`,
      calibrationText: `In-Sample Calibration: ${calibrationMatched} of ${calibrationMetrics} matched (${Math.round((calibrationMatched / calibrationMetrics) * 100)}%)`,
      testText: `Out-of-Sample Test: ${testMatched} of ${testMetrics} matched (${Math.round((testMatched / testMetrics) * 100)}%)`,
      sampleSizeNote: "Limitations: N=3 historical events represents a small empirical sample. Plausibility check only, not asymptotic forecast accuracy."
    }
  };
}
