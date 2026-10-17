
const DECISION_KEYS = ['risk', 'suppression', 'feedback']

function toFiniteNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function average(values) {
  const valid = values.filter(
    (value) => value !== null && Number.isFinite(value)
  )

  if (valid.length === 0) return null

  return valid.reduce((sum, value) => sum + value, 0) /
    valid.length
}

function distribution(items, getValue) {
  return items.reduce((counts, item) => {
    const value = getValue(item)
    const key = String(value ?? 'Unknown')

    counts[key] = (counts[key] ?? 0) + 1
    return counts
  }, {})
}

export function calculatePerformanceAnalytics({
  batchResults = null,
  missionHistory = [],
  faultIds = [],
  lastValidationTime = null,
} = {}) {
  const scenarios = Array.isArray(batchResults?.results)
    ? batchResults.results
    : []

  const missions = Array.isArray(missionHistory)
    ? missionHistory
    : []

  const total = scenarios.length

  const passed = scenarios.filter((entry) =>
    DECISION_KEYS.every(
      (key) => entry.comparison?.[key] === true
    )
  ).length

  const mismatched = total - passed

  const matchRate = total > 0
    ? (passed / total) * 100
    : null

  const decisionMatches = Object.fromEntries(
    DECISION_KEYS.map((key) => [
      key,
      scenarios.filter(
        (entry) => entry.comparison?.[key] === true
      ).length,
    ])
  )

  const latencyValues = missions.map((entry) =>
    toFiniteNumber(entry.estimatedLatency)
  )

  const powerValues = missions
    .filter((entry) => entry.status !== 'Blocked')
    .map((entry) =>
      toFiniteNumber(entry.power?.totalWatts)
    )

  const estimatedAverageLatencyMs = average(latencyValues)
  const estimatedAveragePowerWatts = average(powerValues)

  const missionStatuses = distribution(
    missions,
    (entry) => entry.status
  )

  const riskDistribution = distribution(
    scenarios,
    (entry) => entry.actual?.risk
  )

  const suppressionDistribution = distribution(
    scenarios,
    (entry) => entry.actual?.suppression
  )

  const feedbackDistribution = distribution(
    scenarios,
    (entry) => entry.actual?.feedback
  )

  const scenarioResults = scenarios.map((entry) => ({
    id: entry.id,
    name: entry.name,
    status: entry.status,
    expected: entry.expected,
    actual: entry.actual,
    comparison: entry.comparison,
    matched: DECISION_KEYS.every(
      (key) => entry.comparison?.[key] === true
    ),
  }))

  return {
    validation: {
      total,
      passed,
      mismatched,
      matchRate,
      decisionMatches,
      lastValidationTime,
    },

    decisions: {
      riskDistribution,
      suppressionDistribution,
      feedbackDistribution,
    },

    missions: {
      total: missions.length,
      statuses: missionStatuses,
      estimatedAverageLatencyMs,
      estimatedAveragePowerWatts,
    },

    diagnostics: {
      activeFaultCount: faultIds.length,
      activeFaultIds: [...faultIds],
    },

    scenarioResults,
  }
}
