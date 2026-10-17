
/* ============================================================
   ADITI — RESOURCE EFFICIENCY ANALYTICS ENGINE
   Phase 10.5.12A

   Evaluates modeled sensor workload savings across
   predefined ADITI simulation scenarios.

   Cost units are conceptual weights, not watts,
   CPU percentages, or measured battery consumption.
   ============================================================ */

import {
  getAvailableScenarios,
} from './ScenarioSimulationEngine'

import {
  SENSOR_TYPES,
  SENSOR_COSTS,
  selectRequiredSensors,
  calculateSensorCost,
} from './ResourceOptimizationEngine'

import {
  compareScenarioResources,
} from './ResourceComparisonEngine'

// ============================================================
// HELPERS
// ============================================================

function round(value, digits = 2) {
  return Number(value.toFixed(digits))
}

function percent(part, total) {
  return total > 0
    ? round((part / total) * 100)
    : 0
}

function getSensorCounts() {
  const counts = {}

  for (const sensor of SENSOR_TYPES) {
    counts[sensor] = 0
  }

  return counts
}

// ============================================================
// ANALYZE ONE SCENARIO
// ============================================================

export function analyzeScenarioEfficiency(scenarioId) {
  const comparison = compareScenarioResources(
    scenarioId
  )

  if (!comparison || comparison.error) {
    return {
      scenarioId,
      error:
        comparison?.error ??
        'Resource comparison unavailable',
    }
  }

  const scenarios = getAvailableScenarios()

  const scenario = scenarios.find(
    (item) => item.id === scenarioId
  )

  if (!scenario) {
    return {
      scenarioId,
      error: 'Scenario not found',
    }
  }

  const requiredSensors = selectRequiredSensors(
    scenario.objective
  )

  const skippedSensors = SENSOR_TYPES.filter(
    (sensor) => !requiredSensors.includes(sensor)
  )

  const baselineCost = calculateSensorCost(
    SENSOR_TYPES
  )

  const optimizedCost = calculateSensorCost(
    requiredSensors
  )

  const savedCost = Math.max(
    0,
    baselineCost - optimizedCost
  )

  const savingsPercent = percent(
    savedCost,
    baselineCost
  )

  const activeSensorPercent = percent(
    requiredSensors.length,
    SENSOR_TYPES.length
  )

  // The comparison engine determines whether the
  // baseline and optimized categorical decisions match.
  // Its decision-preservation property may differ
  // between project versions, so check the report
  // before assuming preservation.

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    category: scenario.category,
    objective: scenario.objective,

    baselineCost,
    optimizedCost,
    savedCost,
    savingsPercent,

    totalSensors: SENSOR_TYPES.length,
    activeSensors: requiredSensors,
    skippedSensors,
    activeSensorPercent,

    comparison,
  }
}

// ============================================================
// ANALYZE ALL SCENARIOS
// ============================================================

export function analyzeAllResourceEfficiency() {
  const scenarios = getAvailableScenarios()

  const results = scenarios.map(
    (scenario) =>
      analyzeScenarioEfficiency(scenario.id)
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

  const totalSavedCost = validResults.reduce(
    (total, result) =>
      total + result.savedCost,
    0
  )

  const sensorUsage = getSensorCounts()

  for (const result of validResults) {
    for (const sensor of result.activeSensors) {
      sensorUsage[sensor]++
    }
  }

  const sensorUtilization = SENSOR_TYPES.map(
    (sensor) => ({
      sensor,
      modeledCost: SENSOR_COSTS[sensor] ?? 0,
      activeScenarios: sensorUsage[sensor],
      inactiveScenarios:
        validResults.length - sensorUsage[sensor],
      utilizationPercent: percent(
        sensorUsage[sensor],
        validResults.length
      ),
    })
  )

  const sortedBySavings = [...validResults].sort(
    (a, b) =>
      b.savingsPercent - a.savingsPercent
  )

  return {
    totalScenarios: scenarios.length,
    analyzedScenarios: validResults.length,
    failedScenarios:
      scenarios.length - validResults.length,

    totalBaselineCost,
    totalOptimizedCost,
    totalSavedCost,

    overallSavingsPercent: percent(
      totalSavedCost,
      totalBaselineCost
    ),

    averageSavingsPercent:
      validResults.length > 0
        ? round(
            validResults.reduce(
              (total, result) =>
                total + result.savingsPercent,
              0
            ) / validResults.length
          )
        : 0,

    sensorUtilization,
    sortedBySavings,
    results,
    timestamp: Date.now(),
  }
}
