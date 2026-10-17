
const MAX_EVENTS = 100

function validNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const number = Number(value)

  return Number.isFinite(number) ? number : null
}

export function createTelemetrySnapshot({
  latestResult = null,
  faultIds = [],
  performanceAnalytics = null,
  timestamp = new Date().toISOString(),
} = {}) {
  const actual = latestResult?.actual ?? {}

  const power = validNumber(
    latestResult?.power?.totalWatts
  )

  const latency = validNumber(
    latestResult?.estimatedLatency
  )

  return {
    timestamp,
    scenarioId: latestResult?.scenarioId ?? null,
    missionStatus: latestResult?.status ?? 'Idle',

    ai: {
      risk: actual.risk ?? 'N/A',
      suppression: actual.suppression ?? 'N/A',
      feedback: actual.feedback ?? 'N/A',
    },

    performance: {
      estimatedPowerWatts: power,
      estimatedLatencyMs: latency,
      validationMatchRate:
        performanceAnalytics?.validation?.matchRate ?? null,
    },

    diagnostics: {
      activeFaultCount: faultIds.length,
      activeFaultIds: [...faultIds],
    },

    source: 'ADITI software simulation',
  }
}

export function createTelemetryEvent({
  type,
  message,
  timestamp = new Date().toISOString(),
  details = null,
}) {
  return {
    id: `${Date.now()}-${Math.random()}`,
    type,
    message,
    timestamp,
    details,
  }
}

export function appendTelemetryEvent(
  history,
  event,
  limit = MAX_EVENTS
) {
  return [event, ...history].slice(0, limit)
}

export function appendTelemetrySnapshot(
  history,
  snapshot,
  limit = 60
) {
  return [snapshot, ...history].slice(0, limit)
}
