
/* ============================================================
   ADITI — STRESS TESTING ENGINE
   Phase 10.5.9A

   Repeatedly executes the simulated AI decision pipeline.

   Measures:
   - Processing latency
   - Throughput
   - Execution errors
   - Decision stability

   Does not measure hardware inference or battery usage.
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
// CONFIGURATION
// ============================================================

export const STRESS_TEST_LEVELS = {
  light: {
    label: 'Light',
    iterations: 100,
  },

  medium: {
    label: 'Medium',
    iterations: 500,
  },

  heavy: {
    label: 'Heavy',
    iterations: 2000,
  },
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function round(value, digits = 4) {
  return Number(value.toFixed(digits))
}

function extractDecision(result) {
  return {
    risk: result.risk?.level ?? 'unknown',
    suppression: result.suppression?.action ?? 'unknown',
    feedback: result.feedback ?? 'none',
  }
}

function sameDecision(a, b) {
  return (
    a.risk === b.risk &&
    a.suppression === b.suppression &&
    a.feedback === b.feedback
  )
}

function calculatePercentile(values, percentile) {
  if (values.length === 0) {
    return 0
  }

  const sorted = [...values].sort(
    (a, b) => a - b
  )

  const index = Math.max(
    0,
    Math.min(
      sorted.length - 1,
      Math.ceil(
        (percentile / 100) * sorted.length
      ) - 1
    )
  )

  return sorted[index]
}

// ============================================================
// RUN STRESS TEST FOR ONE SCENARIO
// ============================================================

export function stressTestScenario(
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
    ? Math.max(
        1,
        Math.min(5000, Math.floor(iterations))
      )
    : 100

  const sensorData = getScenarioSensorData(
    scenarioId
  )

  if (!sensorData) {
    return {
      scenarioId,
      error: 'Sensor data unavailable',
    }
  }

  const timings = []

  let successfulCycles = 0
  let failedCycles = 0
  let unstableDecisions = 0
  let referenceDecision = null
  let firstError = null

  // Warm up JavaScript execution.

  for (let i = 0; i < 10; i++) {
    try {
      processSensorData(
        sensorData,
        { objective: scenario.objective }
      )
    } catch {
      // Actual test errors are counted below.
    }
  }

  const testStart = performance.now()

  for (let i = 0; i < count; i++) {
    const cycleStart = performance.now()

    try {
      const result = processSensorData(
        sensorData,
        { objective: scenario.objective }
      )

      const cycleEnd = performance.now()

      timings.push(cycleEnd - cycleStart)

      successfulCycles++

      const decision = extractDecision(result)

      if (referenceDecision === null) {
        referenceDecision = decision
      } else if (
        !sameDecision(
          referenceDecision,
          decision
        )
      ) {
        unstableDecisions++
      }
    } catch (error) {
      failedCycles++

      if (!firstError) {
        firstError = String(
          error?.message ?? error
        )
      }
    }
  }

  const testEnd = performance.now()

  const totalDurationMs = testEnd - testStart

  const totalProcessingTimeMs = timings.reduce(
    (total, time) => total + time,
    0
  )

  const averageTimeMs =
    successfulCycles > 0
      ? totalProcessingTimeMs / successfulCycles
      : 0

  const minimumTimeMs =
    timings.length > 0
      ? Math.min(...timings)
      : 0

  const maximumTimeMs =
    timings.length > 0
      ? Math.max(...timings)
      : 0

  const p95TimeMs = calculatePercentile(
    timings,
    95
  )

  const throughput =
    totalDurationMs > 0
      ? (successfulCycles * 1000) /
        totalDurationMs
      : 0

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    category: scenario.category,
    objective: scenario.objective,

    requestedCycles: count,
    successfulCycles,
    failedCycles,
    unstableDecisions,

    totalDurationMs: round(
      totalDurationMs
    ),

    averageTimeMs: round(
      averageTimeMs
    ),

    minimumTimeMs: round(
      minimumTimeMs
    ),

    maximumTimeMs: round(
      maximumTimeMs
    ),

    p95TimeMs: round(
      p95TimeMs
    ),

    throughputPerSecond: round(
      throughput,
      2
    ),

    errorRate: round(
      (failedCycles / count) * 100,
      2
    ),

    decisionStable:
      failedCycles === 0 &&
      unstableDecisions === 0 &&
      successfulCycles === count,

    referenceDecision,
    firstError,
  }
}

// ============================================================
// RUN STRESS TEST FOR ALL SCENARIOS
// ============================================================

export function stressTestAllScenarios(
  iterations = 100
) {
  const scenarios = getAvailableScenarios()

  const results = scenarios.map(
    (scenario) =>
      stressTestScenario(
        scenario.id,
        iterations
      )
  )

  const validResults = results.filter(
    (result) => !result.error
  )

  const totalCycles = validResults.reduce(
    (total, result) =>
      total + result.requestedCycles,
    0
  )

  const successfulCycles = validResults.reduce(
    (total, result) =>
      total + result.successfulCycles,
    0
  )

  const failedCycles = validResults.reduce(
    (total, result) =>
      total + result.failedCycles,
    0
  )

  const unstableDecisions = validResults.reduce(
    (total, result) =>
      total + result.unstableDecisions,
    0
  )

  const stableScenarios = validResults.filter(
    (result) => result.decisionStable
  ).length

  const totalDurationMs = validResults.reduce(
    (total, result) =>
      total + result.totalDurationMs,
    0
  )

  return {
    totalScenarios: scenarios.length,
    testedScenarios: validResults.length,

    iterationsPerScenario: iterations,

    totalCycles,
    successfulCycles,
    failedCycles,
    unstableDecisions,
    stableScenarios,

    totalDurationMs: round(
      totalDurationMs
    ),

    averageThroughputPerSecond:
      totalDurationMs > 0
        ? round(
            (successfulCycles * 1000) /
              totalDurationMs,
            2
          )
        : 0,

    overallErrorRate:
      totalCycles > 0
        ? round(
            (failedCycles / totalCycles) *
              100,
            2
          )
        : 0,

    results,
    timestamp: Date.now(),
  }
}
