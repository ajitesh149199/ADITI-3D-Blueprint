
/* ============================================================
   ADITI — SCENARIO EVALUATION ENGINE
   Phase 10.5.5C

   Compares simulated AI decisions against expected test cases.
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
// EVALUATE ONE SCENARIO
// ============================================================

export function evaluateScenario(scenarioId) {
  const scenario = getScenario(scenarioId)

  if (!scenario) {
    return {
      scenarioId,
      passed: false,
      error: 'Scenario not found',
    }
  }

  try {
    const sensorData = getScenarioSensorData(scenarioId)

    const actual = processSensorData(sensorData, {
      objective: scenario.objective,
    })

    const expected = scenario.expected

    const checks = {
      risk: {
        expected: expected.risk,
        actual: actual.risk.level,
        passed: actual.risk.level === expected.risk,
      },

      suppression: {
        expected: expected.suppression,
        actual: actual.suppression.action,
        passed:
          actual.suppression.action === expected.suppression,
      },

      feedback: {
        expected: expected.feedback,
        actual: actual.feedback,
        passed: actual.feedback === expected.feedback,
      },
    }

    const passed = Object.values(checks).every(
      (check) => check.passed
    )

    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      category: scenario.category,
      objective: scenario.objective,
      passed,
      checks,
      actual,
    }
  } catch (error) {
    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      category: scenario.category,
      passed: false,
      error: error.message,
    }
  }
}

// ============================================================
// EVALUATE ALL SCENARIOS
// ============================================================

export function evaluateAllScenarios() {
  const scenarios = getAvailableScenarios()

  const results = scenarios.map((scenario) =>
    evaluateScenario(scenario.id)
  )

  const passed = results.filter(
    (result) => result.passed
  ).length

  const failed = results.length - passed

  return {
    total: results.length,
    passed,
    failed,
    passRate:
      results.length > 0
        ? Number(
            ((passed / results.length) * 100).toFixed(1)
          )
        : 0,
    results,
    timestamp: Date.now(),
  }
}
