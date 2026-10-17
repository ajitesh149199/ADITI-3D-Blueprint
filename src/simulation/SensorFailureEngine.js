
/* ============================================================
   ADITI — SENSOR FAILURE SIMULATION ENGINE
   Phase 10.5.10A

   Simulates sensor faults and evaluates AI processing.

   This is a conceptual software simulation.
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

// ============================================================
// FAULT TYPES
// ============================================================

export const SENSOR_FAULT_TYPES = {
  missing: {
    label: 'Missing Sensor',
    description: 'Sensor input is absent.',
  },

  disconnected: {
    label: 'Disconnected Sensor',
    description: 'Sensor reports a disconnected state.',
  },

  corrupted: {
    label: 'Corrupted Sensor',
    description: 'Sensor input contains invalid values.',
  },

  stale: {
    label: 'Stale Sensor',
    description: 'Sensor data has an expired timestamp.',
  },
}

// ============================================================
// CREATE A COPY OF SENSOR DATA
// ============================================================

function copyData(data) {
  return structuredClone(data)
}

// ============================================================
// INJECT A SENSOR FAULT
// ============================================================

export function injectSensorFault(
  sensorData,
  sensor,
  faultType
) {
  if (!SENSOR_TYPES.includes(sensor)) {
    throw new Error(`Unknown sensor: ${sensor}`)
  }

  if (!SENSOR_FAULT_TYPES[faultType]) {
    throw new Error(`Unknown fault type: ${faultType}`)
  }

  const data = copyData(sensorData)

  switch (faultType) {
    case 'missing':
      delete data[sensor]
      break

    case 'disconnected':
      data[sensor] = {
        status: 'disconnected',
        available: false,
      }
      break

    case 'corrupted':
      data[sensor] = {
        status: 'corrupted',
        value: NaN,
        confidence: -1,
      }
      break

    case 'stale':
      data[sensor] = {
        ...(data[sensor] ?? {}),
        status: 'stale',
        timestamp: Date.now() - 120000,
      }
      break

    default:
      break
  }

  return data
}

// ============================================================
// DETECT SENSOR FAULTS
// ============================================================

export function detectSensorFaults(
  sensorData,
  requiredSensors = SENSOR_TYPES
) {
  const faults = []

  for (const sensor of requiredSensors) {
    if (
      !Object.prototype.hasOwnProperty.call(
        sensorData,
        sensor
      )
    ) {
      faults.push({
        sensor,
        type: 'missing',
        detected: true,
      })

      continue
    }

    const reading = sensorData[sensor]

    if (
      reading === null ||
      typeof reading !== 'object' ||
      Array.isArray(reading)
    ) {
      faults.push({
        sensor,
        type: 'corrupted',
        detected: true,
      })

      continue
    }

    if (
      reading.status === 'disconnected' ||
      reading.available === false
    ) {
      faults.push({
        sensor,
        type: 'disconnected',
        detected: true,
      })

      continue
    }

    if (
      reading.status === 'corrupted' ||
      Number.isNaN(reading.value) ||
      (
        typeof reading.confidence === 'number' &&
        (
          reading.confidence < 0 ||
          reading.confidence > 1
        )
      )
    ) {
      faults.push({
        sensor,
        type: 'corrupted',
        detected: true,
      })

      continue
    }

    if (
      reading.status === 'stale' ||
      (
        typeof reading.timestamp === 'number' &&
        Date.now() - reading.timestamp > 60000
      )
    ) {
      faults.push({
        sensor,
        type: 'stale',
        detected: true,
      })
    }
  }

  return faults
}

// ============================================================
// EXTRACT COMPARABLE AI DECISION
// ============================================================

function extractDecision(result) {
  return {
    risk: result.risk?.level ?? 'unknown',
    suppression: result.suppression?.action ?? 'unknown',
    feedback: result.feedback ?? 'none',
  }
}

// ============================================================
// RUN ONE SENSOR FAILURE TEST
// ============================================================

export function simulateSensorFailure(
  scenarioId,
  sensor,
  faultType
) {
  const scenario = getScenario(scenarioId)

  if (!scenario) {
    return {
      error: 'Scenario not found',
      scenarioId,
    }
  }

  try {
    const baselineData = buildBaselineSensorData(
      scenarioId
    )

    if (!baselineData) {
      throw new Error('Baseline data unavailable')
    }

    const requiredSensors = selectRequiredSensors(
      scenario.objective
    )

    const baselineResult = processSensorData(
      baselineData,
      { objective: scenario.objective }
    )

    const faultyData = injectSensorFault(
      baselineData,
      sensor,
      faultType
    )

    const detectedFaults = detectSensorFaults(
      faultyData,
      requiredSensors
    )

    const faultDetected = detectedFaults.some(
      (fault) =>
        fault.sensor === sensor &&
        fault.type === faultType
    )

    // The existing AI engine is evaluated separately
    // from the new fault detector.
    let faultyDecision = null
    let processingError = null

    try {
      const result = processSensorData(
        faultyData,
        { objective: scenario.objective }
      )

      faultyDecision = extractDecision(result)
    } catch (error) {
      processingError = String(
        error?.message ?? error
      )
    }

    const baselineDecision = extractDecision(
      baselineResult
    )

    const decisionChanged =
      faultyDecision === null ||
      baselineDecision.risk !== faultyDecision.risk ||
      baselineDecision.suppression !==
        faultyDecision.suppression ||
      baselineDecision.feedback !==
        faultyDecision.feedback

    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      category: scenario.category,
      objective: scenario.objective,

      sensor,
      faultType,

      requiredSensor:
        requiredSensors.includes(sensor),

      faultDetected,
      detectedFaults,

      baselineDecision,
      faultyDecision,
      decisionChanged,
      processingError,

      passed: faultDetected && !processingError,

      timestamp: Date.now(),
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
// RUN ALL SENSOR FAILURE TESTS
// ============================================================

export function simulateAllSensorFailures() {
  const scenarios = getAvailableScenarios()
  const faultTypes = Object.keys(SENSOR_FAULT_TYPES)

  const results = []

  for (const scenario of scenarios) {
    const requiredSensors = selectRequiredSensors(
      scenario.objective
    )

    for (const sensor of requiredSensors) {
      for (const faultType of faultTypes) {
        results.push(
          simulateSensorFailure(
            scenario.id,
            sensor,
            faultType
          )
        )
      }
    }
  }

  const passedTests = results.filter(
    (result) => result.passed
  ).length

  const failedTests = results.length - passedTests

  const detectedFaults = results.filter(
    (result) => result.faultDetected
  ).length

  const processingErrors = results.filter(
    (result) => result.processingError
  ).length

  return {
    totalScenarios: scenarios.length,
    totalTests: results.length,
    passedTests,
    failedTests,
    detectedFaults,
    processingErrors,

    detectionRate:
      results.length > 0
        ? Number(
            (
              (detectedFaults / results.length) *
              100
            ).toFixed(1)
          )
        : 0,

    results,
    timestamp: Date.now(),
  }
}
