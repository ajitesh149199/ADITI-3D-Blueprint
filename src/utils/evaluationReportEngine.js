
const DECISION_KEYS = ['risk', 'suppression', 'feedback']

function percentage(value) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Number(value.toFixed(2))
    : null
}

export function buildEvaluationReport({
  analytics,
  batchResults,
  missionHistory = [],
  telemetryEvents = [],
  faultIds = [],
} = {}) {
  const validation = analytics?.validation ?? {}
  const missions = analytics?.missions ?? {}
  const decisions = analytics?.decisions ?? {}

  const scenarios = analytics?.scenarioResults ?? []

  const scenarioRows = scenarios.map((scenario) => ({
    id: scenario.id,
    name: scenario.name,
    status: scenario.status,
    expectedRisk: scenario.expected?.risk ?? null,
    actualRisk: scenario.actual?.risk ?? null,
    riskMatch: scenario.comparison?.risk === true,
    expectedSuppression: scenario.expected?.suppression ?? null,
    actualSuppression: scenario.actual?.suppression ?? null,
    suppressionMatch:
      scenario.comparison?.suppression === true,
    expectedFeedback: scenario.expected?.feedback ?? null,
    actualFeedback: scenario.actual?.feedback ?? null,
    feedbackMatch:
      scenario.comparison?.feedback === true,
    overallMatch: scenario.matched === true,
  }))

  const total = Number(validation.total ?? 0)
  const passed = Number(validation.passed ?? 0)
  const mismatched = Number(validation.mismatched ?? 0)

  const decisionMatchRates = Object.fromEntries(
    DECISION_KEYS.map((key) => [
      key,
      total > 0
        ? percentage(
            ((validation.decisionMatches?.[key] ?? 0) /
              total) *
              100
          )
        : null,
    ])
  )

  const recordedMissions = Array.isArray(missionHistory)
    ? missionHistory
    : []

  const recordedEvents = Array.isArray(telemetryEvents)
    ? telemetryEvents
    : []

  return {
    metadata: {
      project: 'ADITI 3D Blueprint',
      reportType: 'Software Simulation Evaluation',
      generatedAt: new Date().toISOString(),
      validationExecutedAt:
        validation.lastValidationTime ?? null,
      source: 'ADITI Unified Simulation System',
      hardwareMeasurements: false,
    },

    summary: {
      scenariosTested: total,
      scenariosMatched: passed,
      scenariosMismatched: mismatched,
      overallDecisionMatchRate:
        percentage(validation.matchRate),
      decisionMatchRates,
      validationAvailable: Boolean(batchResults),
    },

    decisionDistributions: {
      risk: decisions.riskDistribution ?? {},
      suppression:
        decisions.suppressionDistribution ?? {},
      feedback: decisions.feedbackDistribution ?? {},
    },

    missionPerformance: {
      totalRecordedMissions: missions.total ?? 0,
      statusDistribution: missions.statuses ?? {},
      estimatedAverageLatencyMs:
        missions.estimatedAverageLatencyMs ?? null,
      estimatedAveragePowerWatts:
        missions.estimatedAveragePowerWatts ?? null,
      recentMissions: recordedMissions
        .slice(0, 20)
        .map((mission) => ({
          scenarioId: mission.scenarioId ?? null,
          status: mission.status ?? 'Unknown',
          estimatedLatencyMs:
            mission.estimatedLatency ?? null,
          estimatedPowerWatts:
            mission.power?.totalWatts ?? null,
        })),
    },

    diagnostics: {
      activeSimulatedFaults: [...faultIds],
      activeFaultCount: faultIds.length,
      recentEvents: recordedEvents
        .slice(0, 20)
        .map((event) => ({
          type: event.type,
          message: event.message,
          timestamp: event.timestamp,
        })),
    },

    scenarioResults: scenarioRows,

    limitations: [
      'All results originate from software simulations.',
      'Decision match rate measures agreement with predefined scenario expectations, not real-world AI accuracy.',
      'Power and latency values are estimates, not physical measurements.',
      'Simulated fault detection does not establish physical hardware reliability.',
      'The report does not certify the system for safety-critical navigation.',
    ],
  }
}

function csvCell(value) {
  const text =
    value === null || value === undefined
      ? ''
      : String(value)

  return `"${text.replace(/"/g, '""')}"`
}

export function evaluationReportToCSV(report) {
  const headers = [
    'Scenario ID',
    'Scenario',
    'Status',
    'Expected Risk',
    'Actual Risk',
    'Risk Match',
    'Expected Suppression',
    'Actual Suppression',
    'Suppression Match',
    'Expected Feedback',
    'Actual Feedback',
    'Feedback Match',
    'Overall Match',
  ]

  const fields = [
    'id',
    'name',
    'status',
    'expectedRisk',
    'actualRisk',
    'riskMatch',
    'expectedSuppression',
    'actualSuppression',
    'suppressionMatch',
    'expectedFeedback',
    'actualFeedback',
    'feedbackMatch',
    'overallMatch',
  ]

  const rows = report.scenarioResults.map((row) =>
    fields.map((field) => csvCell(row[field])).join(',')
  )

  return [
    headers.map(csvCell).join(','),
    ...rows,
  ].join('\r\n')
}

export function downloadEvaluationFile(
  content,
  filename,
  mimeType
) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
