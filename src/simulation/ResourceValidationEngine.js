
/* ============================================================
   ADITI — RESOURCE VALIDATION ENGINE
   Phase 10.5.8A

   Validates simulated baseline and optimized decisions
   under different sensor-input conditions.

   This is software simulation, not physical safety testing.
   ============================================================ */

import {
  getAvailableScenarios,
  getScenarioSensorData,
} from './ScenarioSimulationEngine'

import {
  processSensorData,
} from './AIProcessingEngine'

import {
  optimizeSensorData,
} from './ResourceOptimizationEngine'

import {
  buildBaselineSensorData,
} from './ResourceComparisonEngine'

// ============================================================
// SAFETY-PRIORITY SCENARIOS
// ============================================================

const SAFETY_OBJECTIVES = [
  'obstacle_avoidance',
  'traffic_awareness',
  'emergency_alert',
]

// ============================================================
// COPY DATA WITHOUT MUTATING SCENARIOS
// ============================================================

function copySensorData(data) {
  return structuredClone(data)
}

// ============================================================
// EXTRACT AI DECISIONS
// ============================================================

function extractDecision(result) {
  return {
    risk: result.risk?.level ?? 'unknown',
    suppression: result.suppression?.action ?? 'unknown',
    feedback: result.feedback ?? 'none',
  }
}

// ============================================================
// COMPARE TWO DECISIONS
// ============================================================

function compareDecisions(baseline, optimized) {
  const baselineDecision = extractDecision(baseline)
  const optimizedDecision = extractDecision(optimized)

  const riskMatch =
    baselineDecision.risk === optimizedDecision.risk

  const suppressionMatch =
    baselineDecision.suppression ===
    optimizedDecision.suppression

  const feedbackMatch =
    baselineDecision.feedback ===
    optimizedDecision.feedback

  return {
    passed:
      riskMatch &&
      suppressionMatch &&
      feedbackMatch,

    riskMatch,
    suppressionMatch,
    feedbackMatch,

    baselineDecision,
    optimizedDecision,
  }
}

// ============================================================
// CREATE A NOISY SENSOR DATASET
// ============================================================

function createNoisySensorData(sensorData) {
  const noisyData = copySensorData(sensorData)

  // Introduce irrelevant metadata without changing
  // the underlying scenario sensor readings.

  for (const sensor of Object.keys(noisyData)) {
    if (
      noisyData[sensor] &&
      typeof noisyData[sensor] === 'object' &&
      !Array.isArray(noisyData[sensor])
    ) {
      noisyData[sensor].noiseMarker = true
      noisyData[sensor].backgroundSignal = 0.01
    }
  }

  return noisyData
}

// ============================================================
// REMOVE ONE REQUIRED SENSOR
// ============================================================

function createMissingSensorData(
  sensorData,
  objective
) {
  const data = copySensorData(sensorData)

  const required = optimizeSensorData(
    data,
    objective
  ).activeSensors

  const removedSensor = required[0] ?? null

  if (removedSensor) {
    delete data[removedSensor]
  }

  return {
    data,
    removedSensor,
  }
}

// ============================================================
// RUN ONE VALIDATION CASE
// ============================================================

function runValidationCase(
  scenario,
  testName,
  sensorData,
  metadata = {}
) {
  try {
    const baselineResult = processSensorData(
      sensorData,
      { objective: scenario.objective }
    )

    const optimization = optimizeSensorData(
      sensorData,
      scenario.objective
    )

    const optimizedResult = processSensorData(
      optimization.optimizedData,
      { objective: scenario.objective }
    )

    const comparison = compareDecisions(
      baselineResult,
      optimizedResult
    )

    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      category: scenario.category,
      objective: scenario.objective,
      testName,

      passed: comparison.passed,

      ...comparison,

      activeSensors: optimization.activeSensors,
      skippedSensors: optimization.skippedSensors,

      ...metadata,
    }
  } catch (error) {
    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      testName,
      passed: false,
      error: error.message,
      ...metadata,
    }
  }
}

// ============================================================
// VALIDATE ONE SCENARIO
// ============================================================

export function validateResourceScenario(scenarioId) {
  const scenario = getAvailableScenarios().find(
    (item) => item.id === scenarioId
  )

  if (!scenario) {
    return {
      scenarioId,
      error: 'Scenario not found',
      tests: [],
    }
  }

  const baselineData = buildBaselineSensorData(
    scenario.id
  )

  if (!baselineData) {
    return {
      scenarioId,
      error: 'Baseline data unavailable',
      tests: [],
    }
  }

  const tests = []

  // TEST 1 — ORIGINAL INPUTS

  tests.push(
    runValidationCase(
      scenario,
      'Original Inputs',
      baselineData
    )
  )

  // TEST 2 — NOISY INPUTS

  tests.push(
    runValidationCase(
      scenario,
      'Noisy Inputs',
      createNoisySensorData(baselineData)
    )
  )

  // TEST 3 — MISSING REQUIRED SENSOR

  const missing = createMissingSensorData(
    baselineData,
    scenario.objective
  )

  tests.push(
    runValidationCase(
      scenario,
      'Missing Sensor',
      missing.data,
      {
        removedSensor: missing.removedSensor,
      }
    )
  )

  // TEST 4 — SAFETY-PRIORITY CHECK

  if (SAFETY_OBJECTIVES.includes(scenario.objective)) {
    const originalData = getScenarioSensorData(
      scenario.id
    )

    tests.push(
      runValidationCase(
        scenario,
        'Safety Priority',
        originalData
      )
    )
  }

  const passedTests = tests.filter(
    (test) => test.passed
  ).length

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    category: scenario.category,
    objective: scenario.objective,

    totalTests: tests.length,
    passedTests,
    failedTests: tests.length - passedTests,

    passed: passedTests === tests.length,

    tests,
  }
}

// ============================================================
// VALIDATE ALL SCENARIOS
// ============================================================

export function validateAllResourceScenarios() {
  const scenarios = getAvailableScenarios()

  const results = scenarios.map((scenario) =>
    validateResourceScenario(scenario.id)
  )

  const totalTests = results.reduce(
    (total, result) =>
      total + (result.totalTests ?? 0),
    0
  )

  const passedTests = results.reduce(
    (total, result) =>
      total + (result.passedTests ?? 0),
    0
  )

  const failedTests = totalTests - passedTests

  const passedScenarios = results.filter(
    (result) => result.passed
  ).length

  return {
    totalScenarios: scenarios.length,
    passedScenarios,
    failedScenarios:
      scenarios.length - passedScenarios,

    totalTests,
    passedTests,
    failedTests,

    passRate:
      totalTests > 0
        ? Number(
            ((passedTests / totalTests) * 100).toFixed(1)
          )
        : 0,

    results,
    timestamp: Date.now(),
  }
}
