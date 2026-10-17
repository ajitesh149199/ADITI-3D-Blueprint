
/* ============================================================
   ADITI — RESOURCE OPTIMIZATION ENGINE
   Phase 10.5.7A

   Conceptual resource-management simulation.

   This engine estimates avoided sensor-processing work.
   It does not measure physical battery consumption.
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
// SENSOR DEFINITIONS
// ============================================================

export const SENSOR_TYPES = [
  'camera',
  'imu',
  'gps',
  'microphone',
  'distance',
]

// Relative processing cost units.
// These are illustrative weights, not measured power usage.

export const SENSOR_COSTS = {
  camera: 5,
  imu: 1,
  gps: 2,
  microphone: 2,
  distance: 2,
}

// ============================================================
// OBJECTIVE-BASED SENSOR PRIORITIES
// ============================================================

export const OBJECTIVE_SENSOR_MAP = {
  obstacle_avoidance: [
    'camera',
    'imu',
    'distance',
  ],

  read_text: [
    'camera',
  ],

  general_assistance: [
    'camera',
    'imu',
    'gps',
    'microphone',
    'distance',
  ],

  identify_object: [
    'camera',
  ],

  identify_person: [
    'camera',
    'distance',
  ],

  navigation: [
    'gps',
    'imu',
    'camera',
  ],

  indoor_navigation: [
    'camera',
    'imu',
    'distance',
  ],

  traffic_awareness: [
    'camera',
    'imu',
    'distance',
    'microphone',
  ],

  emergency_alert: [
    'camera',
    'microphone',
    'distance',
  ],

  power_saving: [
    'imu',
  ],
}

// ============================================================
// SELECT REQUIRED SENSOR INPUTS
// ============================================================

export function selectRequiredSensors(
  objective = 'general_assistance'
) {
  return [
    ...(
      OBJECTIVE_SENSOR_MAP[objective] ??
      SENSOR_TYPES
    ),
  ]
}

// ============================================================
// FILTER SENSOR DATA
// ============================================================

export function optimizeSensorData(
  sensorData = {},
  objective = 'general_assistance'
) {
  const requiredSensors = selectRequiredSensors(objective)

  const optimizedData = {}
  const activeSensors = []
  const skippedSensors = []

  const availableSensors = SENSOR_TYPES.filter(
    (sensor) =>
      Object.prototype.hasOwnProperty.call(
        sensorData,
        sensor
      )
  )

  for (const sensor of availableSensors) {
    if (requiredSensors.includes(sensor)) {
      optimizedData[sensor] = sensorData[sensor]
      activeSensors.push(sensor)
    } else {
      skippedSensors.push(sensor)
    }
  }

  return {
    optimizedData,
    activeSensors,
    skippedSensors,
    availableSensors,
  }
}

// ============================================================
// CALCULATE ILLUSTRATIVE WORKLOAD COST
// ============================================================

export function calculateSensorCost(sensorNames = []) {
  return sensorNames.reduce(
    (total, sensor) =>
      total + (SENSOR_COSTS[sensor] ?? 0),
    0
  )
}

// ============================================================
// EVALUATE ONE OPTIMIZED SCENARIO
// ============================================================

export function evaluateResourceOptimization(
  scenarioId
) {
  const scenario = getScenario(scenarioId)

  if (!scenario) {
    return {
      scenarioId,
      error: 'Scenario not found',
    }
  }

  const sensorData = getScenarioSensorData(scenarioId)

  const baselineSensors = SENSOR_TYPES.filter(
    (sensor) =>
      Object.prototype.hasOwnProperty.call(
        sensorData,
        sensor
      )
  )

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

  const baselineCost = calculateSensorCost(
    baselineSensors
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

  const decisionsPreserved =
    baselineResult.risk.level ===
      optimizedResult.risk.level &&
    baselineResult.suppression.action ===
      optimizedResult.suppression.action &&
    baselineResult.feedback ===
      optimizedResult.feedback

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    category: scenario.category,
    objective: scenario.objective,

    baselineSensors,
    activeSensors: optimization.activeSensors,
    skippedSensors: optimization.skippedSensors,

    baselineCost,
    optimizedCost,
    savedCost,
    workloadReduction,

    decisionsPreserved,

    baselineDecision: {
      risk: baselineResult.risk.level,
      suppression: baselineResult.suppression.action,
      feedback: baselineResult.feedback,
    },

    optimizedDecision: {
      risk: optimizedResult.risk.level,
      suppression: optimizedResult.suppression.action,
      feedback: optimizedResult.feedback,
    },
  }
}

// ============================================================
// EVALUATE ALL 12 SCENARIOS
// ============================================================

export function evaluateAllResourceOptimizations() {
  const scenarios = getAvailableScenarios()

  const results = scenarios.map((scenario) =>
    evaluateResourceOptimization(scenario.id)
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

  const totalSavedCost = Math.max(
    0,
    totalBaselineCost - totalOptimizedCost
  )

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
