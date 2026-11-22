/**
 * Validation Engine
 * Replays real-world quick commerce market events against model logic
 * with Calibrate-vs-Test split, transparent directional metric counts,
 * and verifiable statutory source audits.
 */

import validationData from '../data/validationEvents.json';

/**
 * Retrieves all validation events with computed match counts,
 * calibrate-vs-test split, and verified source metrics.
 */
export function getValidationEvents() {
  const events = validationData.events || [];

  let totalMetrics = 0;
  let totalMatched = 0;
  let totalVerified = 0;
  let totalUnverified = 0;
  let calibrationMetrics = 0;
  let calibrationMatched = 0;
  let testMetrics = 0;
  let testMatched = 0;

  const enrichedEvents = events.map(event => {
    const matchedCount = event.trackedMetrics.filter(m => m.match).length;
    const verifiedCount = event.trackedMetrics.filter(m => m.isVerified).length;
    const totalCount = event.trackedMetrics.length;
    const isCalibration = event.split === 'in_sample_calibration';

    totalMetrics += totalCount;
    totalMatched += matchedCount;
    totalVerified += verifiedCount;
    totalUnverified += (totalCount - verifiedCount);

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
      metricsVerified: verifiedCount,
      matchPercentage: Math.round((matchedCount / totalCount) * 100),
      summaryBadge: matchedCount === totalCount ? "Full Directional Match" : "Partial Concordance"
    };
  });

  return {
    events: enrichedEvents,
    summary: {
      totalMetrics,
      totalMatched,
      totalVerified,
      totalUnverified,
      transparentCountText: `${totalMatched} of ${totalMetrics} tracked metrics matched direction across 3 events`,
      verificationText: `${totalVerified} of ${totalMetrics} metrics verified via statutory filings (${totalUnverified} secondary estimates, team to confirm)`,
      calibrationText: `In-Sample Calibration: ${calibrationMatched} of ${calibrationMetrics} matched (${Math.round((calibrationMatched / calibrationMetrics) * 100)}%)`,
      testText: `Out-of-Sample Test: ${testMatched} of ${testMetrics} matched (${Math.round((testMatched / testMetrics) * 100)}%)`,
      sampleSizeNote: "Limitations: N=3 historical events represents a small empirical sample. Plausibility check only, not asymptotic forecast accuracy."
    }
  };
}
