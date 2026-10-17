
/* ============================================================
   ADITI — FAILURE RECOVERY ENGINE
   Phase 10.5.10C-1

   Purpose:
   - Detect required sensor faults
   - Prevent unreliable normal outputs
   - Produce explicit degraded/unavailable states
   - Validate simulated fallback behavior

   This is a conceptual software prototype.
   ============================================================ */

import {
  getAvailableScenarios,
  getScenario,
} from './ScenarioSimulationEngine'

import {
  processSensorData,
} from './AIProcessingEngine'

import {
  SENSOR_TYPES,
  selectRequiredSensors,
} from './ResourceOptimizationEngine'

import {
  buildBaselineSensorData,
} from './ResourceComparisonEngine'

import {
  SENSOR_FAULT_TYPES,
  injectSensorFault,
  detectSensorFaults,
} from './SensorFailureEngine'

// ============================================================
// RECOVERY STATES
// ============================================================

export const RECOVERY_STATES = {
  normal: {
    label: 'Normal',
    description: 'All required sensors are healthy.',
  },

  degraded: {
    label: 'Degraded',
    description:
      'A required sensor has failed; full functionality is not available.',
  },

  unavailable: {
    label: 'Unavailable',
    description:
      'A required sensor has failed and the requested function cannot be verified.',
  },
}

// Objectives involving immediate environmental awareness
// receive the strictest fallback in this prototype.

const CRITICAL_OBJECTIVES = new Set([
  'obstacle_avoidance',
  'traffic_awareness',
  'emergency_alert',
])

// ============================================================
// DECISION HELPERS
// ============================================================

function extractDecision(result) {
  return {
    risk: result.risk?.level ?? 'unknown',
    suppression: result.suppression?.action ?? 'unknown',
    feedback: result.feedback ?? 'none',
  }
}

function getRecoveryState(objective, faults) {
  if (faults.length === 0) {
    return 'normal'
  }

  if (CRITICAL_OBJECTIVES.has(objective)) {
    return 'unavailable'
  }

  return 'degraded'
}

function buildFallback(objective, faults, state) {
  if (state === 'normal') {
    return null
  }

  const failedSensors = [
    ...new Set(faults.map((fault) => fault.sensor)),
  ]

  const sensorList = failedSensors.join(', ')

  if (state === 'unavailable') {
    return {
      type: 'function_unavailable',
      severity: 'critical',
      message:
        `Required sensor unavailable: ${sensorList}. ` +
        'Environmental assessment cannot be verified.',
      recommendedOutput: 'status_warning',
      safeToUseNormalDecision: false,
    }
  }

  return {
    type: 'degraded_operation',
    severity: 'warning',
    message:
      `Required sensor fault: ${sensorList}. ` +
      'Results may be incomplete or unreliable.',
    recommendedOutput: 'status_warning',
    safeToUseNormalDecision: false,
  }
}

// ============================================================
// EVALUATE RECOVERY FOR SENSOR INPUT
// ============================================================

export function evaluateFailureRecovery(
  scenarioId,
  sensorData
) {
  const scenario = getScenario(scenarioId)

  if (!scenario) {
    return {
      scenarioId,
      error: 'Scenario not found',
    }
  }

  const requiredSensors = selectRequiredSensors(
    scenario.objective
  )

  const detectedFaults = detectSensorFaults(
    sensorData,
    requiredSensors
  )

  const state = getRecoveryState(
    scenario.objective,
    detectedFaults
  )

  const fallback = buildFallback(
    scenario.objective,
    detectedFaults,
    state
  )

  // Do not treat a potentially unreliable AI result
  // as a normal decision when required inputs fail.

  if (state !== 'normal') {
    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      objective: scenario.objective,

      state,
      requiredSensors,
      detectedFaults,
      fallback,

      normalDecisionAllowed: false,
      decision: null,
      processingError: null,

      timestamp: Date.now(),
    }
  }

  try {
    const result = processSensorData(
      sensorData,
      { objective: scenario.objective }
    )

    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      objective: scenario.objective,

      state: 'normal',
      requiredSensors,
      detectedFaults: [],
      fallback: null,

      normalDecisionAllowed: true,
      decision: extractDecision(result),
      processingError: null,

      timestamp: Date.now(),
    }
  } catch (error) {
    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      objective: scenario.objective,

      state: 'unavailable',
      requiredSensors,
      detectedFaults: [],
      fallback: {
        type: 'processing_failure',
        severity: 'critical',
        message:
          'AI processing failed. Normal decision unavailable.',
        recommendedOutput: 'status_warning',
        safeToUseNormalDecision: false,
      },

      normalDecisionAllowed: false,
      decision: null,
      processingError: String(
        error?.message ?? error
      ),

      timestamp: Date.now(),
    }
  }
}

// ============================================================
// TEST ONE FAILURE RECOVERY SCENARIO
// ============================================================

export function validateFailureRecovery(
  scenarioId,
  sensor,
  faultType
) {
  try {
    const scenario = getScenario(scenarioId)

    if (!scenario) {
      throw new Error('Scenario not found')
    }

    const baselineData = buildBaselineSensorData(
      scenarioId
    )

    if (!baselineData) {
      throw new Error('Baseline data unavailable')
    }

    const baseline = evaluateFailureRecovery(
      scenarioId,
      baselineData
    )

    const faultyData = injectSensorFault(
      baselineData,
      sensor,
      faultType
    )

    const recovery = evaluateFailureRecovery(
      scenarioId,
      faultyData
    )

    const requiredSensors = selectRequiredSensors(
      scenario.objective
    )

    const sensorIsRequired = requiredSensors.includes(
      sensor
    )

    const faultDetected = recovery.detectedFaults.some(
      (fault) =>
        fault.sensor === sensor &&
        fault.type === faultType
    )

    const expectedState = sensorIsRequired
      ? (
          CRITICAL_OBJECTIVES.has(scenario.objective)
            ? 'unavailable'
            : 'degraded'
        )
      : 'normal'

    const stateMatches =
      recovery.state === expectedState

    const normalOutputBlocked = sensorIsRequired
      ? (
          recovery.normalDecisionAllowed === false &&
          recovery.decision === null &&
          recovery.fallback?.safeToUseNormalDecision === false
        )
      : recovery.normalDecisionAllowed === true

    const baselineHealthy =
      baseline.state === 'normal' &&
      baseline.normalDecisionAllowed === true &&
      baseline.processingError === null

    const passed =
      baselineHealthy &&
      stateMatches &&
      normalOutputBlocked &&
      (
        sensorIsRequired
          ? faultDetected
          : !faultDetected
      )

    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      category: scenario.category,
      objective: scenario.objective,

      sensor,
      faultType,
      sensorIsRequired,

      baselineState: baseline.state,
      recoveryState: recovery.state,
      expectedState,

      faultDetected,
      stateMatches,
      normalOutputBlocked,
      baselineHealthy,

      fallback: recovery.fallback,
      processingError: recovery.processingError,

      passed,
    }
  } catch (error) {
    return {
      scenarioId,
      sensor,
      faultType,
      passed: false,
      error: String(error?.message ?? error),
    }
  }
}

// ============================================================
// RUN ALL RECOVERY VALIDATION TESTS
// ============================================================

export function validateAllFailureRecoveries() {
  const scenarios = getAvailableScenarios()

  const faultTypes = Object.keys(
    SENSOR_FAULT_TYPES
  )

  const results = []

  for (const scenario of scenarios) {
    const requiredSensors = selectRequiredSensors(
      scenario.objective
    )

    // Test all required sensors.
    for (const sensor of requiredSensors) {
      for (const faultType of faultTypes) {
        results.push(
          validateFailureRecovery(
            scenario.id,
            sensor,
            faultType
          )
        )
      }
    }

    // Also test one sensor that is not required,
    // if the objective has an optional sensor.
    const optionalSensor = SENSOR_TYPES.find(
      (sensor) => !requiredSensors.includes(sensor)
    )

    if (optionalSensor) {
      results.push(
        validateFailureRecovery(
          scenario.id,
          optionalSensor,
          'missing'
        )
      )
    }
  }

  const passedTests = results.filter(
    (result) => result.passed
  ).length

  const failedTests = results.length - passedTests

  const normalFallbacks = results.filter(
    (result) => result.recoveryState === 'normal'
  ).length

  const degradedFallbacks = results.filter(
    (result) => result.recoveryState === 'degraded'
  ).length

  const unavailableFallbacks = results.filter(
    (result) => result.recoveryState === 'unavailable'
  ).length

  return {
    totalScenarios: scenarios.length,
    totalTests: results.length,
    passedTests,
    failedTests,

    normalFallbacks,
    degradedFallbacks,
    unavailableFallbacks,

    passRate:
      results.length > 0
        ? Number(
            (
              (passedTests / results.length) *
              100
            ).toFixed(1)
          )
        : 0,

    results,
    timestamp: Date.now(),
  }
}
