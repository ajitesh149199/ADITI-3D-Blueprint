
/* ============================================================
   ADITI — RESOURCE COMPARISON ENGINE
   Phase 10.5.7B

   Controlled baseline vs optimized sensor-input comparison.
   Conceptual simulation only.
   ============================================================ */

import {
  getAvailableScenarios,
  getScenario,
  getScenarioSensorData,
} from './ScenarioSimulationEngine'

import {
  processSensorData,
} from './AIProcessingEngine'

import {
  SENSOR_TYPES,
  calculateSensorCost,
  optimizeSensorData,
} from './ResourceOptimizationEngine'

// ============================================================
// DEFAULT SYNTHETIC SENSOR INPUTS
// ============================================================

const DEFAULT_SENSOR_DATA = {
  camera: {
    detectedObject: null,
    confidence: 0,
    distance: null,
  },

  imu: {
    movement: 'standing',
    acceleration: 0,
    angularVelocity: 0,
  },

  gps: {
    latitude: 30.3165,
    longitude: 78.0322,
    speed: 0,
  },

  microphone: {
    detectedSound: null,
    soundLevel: 0,
  },

  distance: {
    distance: null,
    proximity: 'unknown',
  },
}

// ============================================================
// BUILD A CONTROLLED FIVE-SENSOR BASELINE
// ============================================================

export function buildBaselineSensorData(scenarioId) {
  const scenarioData = getScenarioSensorData(scenarioId)

  if (!scenarioData) {
    return null
  }

  return Object.fromEntries(
    SENSOR_TYPES.map((sensor) => [
      sensor,
      {
        ...DEFAULT_SENSOR_DATA[sensor],
        ...(scenarioData[sensor] ?? {}),
      },
    ])
  )
}

// ============================================================
// EXTRACT COMPARABLE AI DECISIONS
// ============================================================

function extractDecision(result) {
  return {
    risk: result.risk.level,
    suppression: result.suppression.action,
    feedback: result.feedback,
  }
}

// ============================================================
// COMPARE ONE SCENARIO
// ============================================================

export function compareScenarioResources(scenarioId) {
  const scenario = getScenario(scenarioId)

  if (!scenario) {
    return {
      scenarioId,
      error: 'Scenario not found',
    }
  }

  const baselineData = buildBaselineSensorData(scenarioId)

  const optimization = optimizeSensorData(
    baselineData,
    scenario.objective
  )

  const baselineResult = processSensorData(
    baselineData,
    { objective: scenario.objective }
  )

  const optimizedResult = processSensorData(
    optimization.optimizedData,
    { objective: scenario.objective }
  )

  const baselineCost = calculateSensorCost(
    SENSOR_TYPES
  )

  const optimizedCost = calculateSensorCost(
    optimization.activeSensors
  )

  const savedCost = Math.max(
    0,
    baselineCost - optimizedCost
  )

  const workloadReduction =
    baselineCost > 0
      ? Number(
          ((savedCost / baselineCost) * 100).toFixed(1)
        )
      : 0

  const baselineDecision = extractDecision(
    baselineResult
  )

  const optimizedDecision = extractDecision(
    optimizedResult
  )

  const decisionsPreserved =
    baselineDecision.risk === optimizedDecision.risk &&
    baselineDecision.suppression ===
      optimizedDecision.suppression &&
    baselineDecision.feedback ===
      optimizedDecision.feedback

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    category: scenario.category,
    objective: scenario.objective,

    baselineSensors: [...SENSOR_TYPES],
    activeSensors: optimization.activeSensors,
    skippedSensors: optimization.skippedSensors,

    baselineCost,
    optimizedCost,
    savedCost,
    workloadReduction,

    baselineDecision,
    optimizedDecision,
    decisionsPreserved,
  }
}

// ============================================================
// COMPARE ALL SCENARIOS
// ============================================================

export function compareAllScenarioResources() {
  const scenarios = getAvailableScenarios()

  const results = scenarios.map((scenario) =>
    compareScenarioResources(scenario.id)
  )

  const validResults = results.filter(
    (result) => !result.error
  )

  const totalBaselineCost = validResults.reduce(
    (total, result) =>
      total + result.baselineCost,
    0
  )

  const totalOptimizedCost = validResults.reduce(
    (total, result) =>
      total + result.optimizedCost,
    0
  )

  const totalSavedCost =
    totalBaselineCost - totalOptimizedCost

  const preservedCount = validResults.filter(
    (result) => result.decisionsPreserved
  ).length

  const totalSkippedSensors = validResults.reduce(
    (total, result) =>
      total + result.skippedSensors.length,
    0
  )

  return {
    totalScenarios: scenarios.length,
    evaluatedScenarios: validResults.length,

    totalBaselineCost,
    totalOptimizedCost,
    totalSavedCost,

    overallWorkloadReduction:
      totalBaselineCost > 0
        ? Number(
            (
              (totalSavedCost / totalBaselineCost) *
              100
            ).toFixed(1)
          )
        : 0,

    totalSkippedSensors,
    decisionsPreserved: preservedCount,

    results,
    timestamp: Date.now(),
  }
}
