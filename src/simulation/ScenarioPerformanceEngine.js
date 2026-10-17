
/* ============================================================
   ADITI — SCENARIO PERFORMANCE ANALYTICS ENGINE
   Phase 10.5.6A

   Measures conceptual simulation processing performance.
   ============================================================ */

import {
  getAvailableScenarios,
  getScenario,
  getScenarioSensorData,
} from './ScenarioSimulationEngine'

import {
  processSensorData,
} from './AIProcessingEngine'

// ============================================================
// PERFORMANCE TIMER
// ============================================================

function measureProcessing(sensorData, objective) {
  const start = performance.now()

  const result = processSensorData(sensorData, {
    objective,
  })

  const end = performance.now()

  return {
    result,
    processingTimeMs: end - start,
  }
}

// ============================================================
// MEASURE ONE SCENARIO
// ============================================================

export function measureScenarioPerformance(
  scenarioId,
  iterations = 100
) {
  const scenario = getScenario(scenarioId)

  if (!scenario) {
    return {
      scenarioId,
      error: 'Scenario not found',
    }
  }

  const count = Number.isFinite(iterations)
    ? Math.max(1, Math.min(1000, Math.floor(iterations)))
    : 100

  const sensorData = getScenarioSensorData(scenarioId)

  const timings = []
  let lastResult = null

  // Warm up the JavaScript execution path.
  for (let i = 0; i < 10; i += 1) {
    processSensorData(sensorData, {
      objective: scenario.objective,
    })
  }

  for (let i = 0; i < count; i += 1) {
    const measurement = measureProcessing(
      sensorData,
      scenario.objective
    )

    timings.push(measurement.processingTimeMs)
    lastResult = measurement.result
  }

  const totalTime = timings.reduce(
    (sum, time) => sum + time,
    0
  )

  const averageTime = totalTime / count

  const sortedTimings = [...timings].sort(
    (a, b) => a - b
  )

  const p95Index = Math.min(
    sortedTimings.length - 1,
    Math.ceil(sortedTimings.length * 0.95) - 1
  )

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    category: scenario.category,
    objective: scenario.objective,

    iterations: count,

    averageTimeMs: Number(averageTime.toFixed(4)),
    minimumTimeMs: Number(
      sortedTimings[0].toFixed(4)
    ),
    maximumTimeMs: Number(
      sortedTimings[sortedTimings.length - 1].toFixed(4)
    ),
    p95TimeMs: Number(
      sortedTimings[p95Index].toFixed(4)
    ),

    relevanceScore: lastResult.relevance.score,
    riskScore: lastResult.risk.score,
    riskLevel: lastResult.risk.level,

    suppression: lastResult.suppression.action,
    feedback: lastResult.feedback,

    sensorCount: scenario.requiredSensors.length,
  }
}

// ============================================================
// MEASURE ALL SCENARIOS
// ============================================================

export function measureAllScenarioPerformance(
  iterations = 100
) {
  const scenarios = getAvailableScenarios()

  const results = scenarios.map((scenario) =>
    measureScenarioPerformance(
      scenario.id,
      iterations
    )
  )

  const successful = results.filter(
    (result) => !result.error
  )

  const totalAverageTime = successful.reduce(
    (sum, result) => sum + result.averageTimeMs,
    0
  )

  const suppressedCount = successful.filter(
    (result) => result.suppression === 'suppress'
  ).length

  const delayedCount = successful.filter(
    (result) => result.suppression === 'delay'
  ).length

  const keptCount = successful.filter(
    (result) => result.suppression === 'keep'
  ).length

  const total = successful.length

  return {
    totalScenarios: scenarios.length,
    measuredScenarios: total,

    iterationsPerScenario: iterations,

    averageProcessingTimeMs:
      total > 0
        ? Number(
            (totalAverageTime / total).toFixed(4)
          )
        : 0,

    suppressionCounts: {
      keep: keptCount,
      delay: delayedCount,
      suppress: suppressedCount,
    },

    suppressionRate:
      total > 0
        ? Number(
            ((suppressedCount / total) * 100).toFixed(1)
          )
        : 0,

    results,
    timestamp: Date.now(),
  }
}
