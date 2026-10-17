
/* =====================================================
   ADITI — SIMULATION ANALYTICS ENGINE
   Tracks simulated AI processing decisions
   ===================================================== */

const MAX_HISTORY = 300

// Create a clean analytics state.
export function createAnalyticsState() {
  return {
    totalCycles: 0,

    suppressionCounts: {
      keep: 0,
      delay: 0,
      suppress: 0,
    },

    feedbackCounts: {
      audio: 0,
      haptic: 0,
      visual: 0,
      none: 0,
    },

    riskCounts: {
      low: 0,
      medium: 0,
      high: 0,
    },

    relevanceTotal: 0,
    riskTotal: 0,

    history: [],
  }
}

// Record one completed processing cycle.
export function recordProcessingCycle(state, result) {
  if (!result) {
    return state
  }

  const suppression = result.suppression?.action
  const feedback = result.feedback
  const risk = result.risk?.level

  const relevanceScore = Number(
    result.relevance?.score ?? 0
  )

  const riskScore = Number(
    result.risk?.score ?? 0
  )

  const timestamp = result.timestamp ?? Date.now()

  const entry = {
    cycle: state.totalCycles + 1,
    timestamp,

    relevance: relevanceScore,
    riskScore,

    riskLevel: risk ?? 'unknown',
    suppression: suppression ?? 'unknown',
    feedback: feedback ?? 'none',
  }

  const suppressionCounts = {
    ...state.suppressionCounts,
  }

  const feedbackCounts = {
    ...state.feedbackCounts,
  }

  const riskCounts = {
    ...state.riskCounts,
  }

  // Count only recognized decisions.
  if (suppression in suppressionCounts) {
    suppressionCounts[suppression] += 1
  }

  if (feedback in feedbackCounts) {
    feedbackCounts[feedback] += 1
  }

  if (risk in riskCounts) {
    riskCounts[risk] += 1
  }

  return {
    ...state,

    totalCycles: state.totalCycles + 1,

    suppressionCounts,
    feedbackCounts,
    riskCounts,

    relevanceTotal:
      state.relevanceTotal + relevanceScore,

    riskTotal:
      state.riskTotal + riskScore,

    // Keep the most recent 300 cycles.
    history: [
      ...state.history,
      entry,
    ].slice(-MAX_HISTORY),
  }
}

// Calculate analytics summary values.
export function getAnalyticsSummary(state) {
  const total = state.totalCycles

  const kept = state.suppressionCounts.keep
  const delayed = state.suppressionCounts.delay
  const suppressed = state.suppressionCounts.suppress

  const percent = (value) =>
    total > 0
      ? Number(((value / total) * 100).toFixed(1))
      : 0

  return {
    totalCycles: total,

    kept,
    delayed,
    suppressed,

    keepRate: percent(kept),
    delayRate: percent(delayed),
    suppressionRate: percent(suppressed),

    averageRelevance:
      total > 0
        ? Number(
            (state.relevanceTotal / total).toFixed(3)
          )
        : 0,

    averageRisk:
      total > 0
        ? Number(
            (state.riskTotal / total).toFixed(3)
          )
        : 0,

    feedbackCounts: {
      ...state.feedbackCounts,
    },

    riskCounts: {
      ...state.riskCounts,
    },

    history: state.history,
  }
}
