
/* ============================================================
   ADITI — AI DECISION RELIABILITY ENGINE
   Phase 10.5.11A

   Tests:
   - Repeatability
   - Input variation
   - Metadata noise
   - Sensor fault awareness

   This is a software simulation, not hardware validation.
   ============================================================ */

import {
  getAvailableScenarios,
  getScenario,
} from './ScenarioSimulationEngine'

import {
  processSensorData,
} from './AIProcessingEngine'

import {
  buildBaselineSensorData,
} from './ResourceComparisonEngine'

import {
  selectRequiredSensors,
} from './ResourceOptimizationEngine'

import {
  injectSensorFault,
} from './SensorFailureEngine'

import {
  evaluateFailureRecovery,
} from './FailureRecoveryEngine'

// ============================================================
// TEST CONFIGURATION
// ============================================================

export const RELIABILITY_TEST_TYPES = {
  repeatability: {
    label: 'Repeatability',
    description: 'Same input should produce the same decision.',
  },

  metadata_noise: {
    label: 'Metadata Noise',
    description:
      'Irrelevant metadata should not change the decision.',
  },

  input_variation: {
    label: 'Input Variation',
    description:
      'A small input change is evaluated for decision stability.',
  },

  sensor_failure: {
    label: 'Sensor Failure Awareness',
    description:
      'Required sensor failure should block normal decisions.',
  },
}

// ============================================================
// HELPERS
// ============================================================

function cloneData(data) {
  return structuredClone(data)
}

function extractDecision(result) {
  return {
    risk: result.risk?.level ?? 'unknown',
    suppression: result.suppression?.action ?? 'unknown',
    feedback: result.feedback ?? 'none',
  }
}

function decisionsMatch(a, b) {
  return (
    a.risk === b.risk &&
    a.suppression === b.suppression &&
    a.feedback === b.feedback
  )
}

function makeMetadataNoise(data) {
  const copy = cloneData(data)

  copy._reliabilityTestMetadata = {
    source: 'ADITI reliability simulator',
    irrelevantFlag: true,
    randomLabel: 'metadata-only',
  }

  return copy
}

// Apply a small, deterministic variation to one numeric
// field in the first required sensor containing one.

function makeInputVariation(data, requiredSensors) {
  const copy = cloneData(data)

  for (const sensor of requiredSensors) {
    const reading = copy[sensor]

    if (
      !reading ||
      typeof reading !== 'object' ||
      Array.isArray(reading)
    ) {
      continue
    }

    for (const key of Object.keys(reading)) {
      const value = reading[key]

      if (
        typeof value === 'number' &&
        Number.isFinite(value) &&
        key !== 'timestamp'
      ) {
        const delta =
          value === 0
            ? 0.01
            : Math.abs(value) * 0.01

        reading[key] = value + delta

        return {
          data: copy,
          modified: true,
          sensor,
          field: key,
          originalValue: value,
          modifiedValue: reading[key],
        }
      }
    }
  }

  return {
    data: copy,
    modified: false,
    sensor: null,
    field: null,
    originalValue: null,
    modifiedValue: null,
  }
}

// ============================================================
// RUN ONE RELIABILITY TEST
// ============================================================

export function testDecisionReliability(
  scenarioId,
  testType
) {
  const scenario = getScenario(scenarioId)

  if (!scenario) {
    return {
      scenarioId,
      testType,
      passed: false,
      error: 'Scenario not found',
    }
  }

  if (!RELIABILITY_TEST_TYPES[testType]) {
    return {
      scenarioId,
      testType,
      passed: false,
      error: 'Unknown reliability test type',
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

    const baselineOutput = processSensorData(
      baselineData,
      { objective: scenario.objective }
    )

    const baselineDecision = extractDecision(
      baselineOutput
    )

    let testDecision = null
    let passed = false
    let observation = ''
    let variation = null
    let recoveryState = null

    // --------------------------------------------------------
    // 1. REPEATABILITY
    // --------------------------------------------------------

    if (testType === 'repeatability') {
      const repeatedOutput = processSensorData(
        cloneData(baselineData),
        { objective: scenario.objective }
      )

      testDecision = extractDecision(
        repeatedOutput
      )

      passed = decisionsMatch(
        baselineDecision,
        testDecision
      )

      observation = passed
        ? 'Identical input produced the same decision.'
        : 'Identical input produced a different decision.'
    }

    // --------------------------------------------------------
    // 2. METADATA NOISE
    // --------------------------------------------------------

    if (testType === 'metadata_noise') {
      const noisyData = makeMetadataNoise(
        baselineData
      )

      const noisyOutput = processSensorData(
        noisyData,
        { objective: scenario.objective }
      )

      testDecision = extractDecision(
        noisyOutput
      )

      passed = decisionsMatch(
        baselineDecision,
        testDecision
      )

      observation = passed
        ? 'Irrelevant metadata did not change the decision.'
        : 'Decision changed after irrelevant metadata was added.'
    }

    // --------------------------------------------------------
    // 3. INPUT VARIATION
    // --------------------------------------------------------

    if (testType === 'input_variation') {
      variation = makeInputVariation(
        baselineData,
        requiredSensors
      )

      if (!variation.modified) {
        passed = false
        observation =
          'No suitable numeric sensor field was found; variation was not tested.'
      } else {
        const variedOutput = processSensorData(
          variation.data,
          { objective: scenario.objective }
        )

        testDecision = extractDecision(
          variedOutput
        )

        const matched = decisionsMatch(
          baselineDecision,
          testDecision
        )

        // This test checks whether a small input change
        // leaves the categorical decision unchanged.
        // A changed decision is recorded for review,
        // not automatically assumed to be unsafe.
        passed = matched

        observation = matched
          ? 'Decision remained unchanged after a small numeric variation.'
          : 'Decision changed after numeric variation; review the affected field.'
      }
    }

    // --------------------------------------------------------
    // 4. SENSOR FAILURE AWARENESS
    // --------------------------------------------------------

    if (testType === 'sensor_failure') {
      const selectedSensor = requiredSensors[0]

      if (!selectedSensor) {
        throw new Error(
          'No required sensor configured for objective'
        )
      }

      const faultyData = injectSensorFault(
        baselineData,
        selectedSensor,
        'missing'
      )

      const recovery = evaluateFailureRecovery(
        scenarioId,
        faultyData
      )

      recoveryState = recovery.state

      passed =
        recovery.normalDecisionAllowed === false &&
        recovery.decision === null &&
        recovery.detectedFaults.some(
          (fault) =>
            fault.sensor === selectedSensor &&
            fault.type === 'missing'
        )

      observation = passed
        ? 'Required sensor failure blocked normal processing.'
        : 'Required sensor failure was not handled as expected.'
    }

    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      category: scenario.category,
      objective: scenario.objective,

      testType,
      passed,
      observation,

      baselineDecision,
      testDecision,
      variation,
      recoveryState,

      timestamp: Date.now(),
    }
  } catch (error) {
    return {
      scenarioId,
      scenarioName: scenario.name,
      objective: scenario.objective,
      testType,
      passed: false,
      error: String(
        error?.message ?? error
      ),
    }
  }
}

// ============================================================
// RUN ALL RELIABILITY TESTS
// ============================================================

export function testAllDecisionReliability() {
  const scenarios = getAvailableScenarios()
  const testTypes = Object.keys(
    RELIABILITY_TEST_TYPES
  )

  const results = []

  for (const scenario of scenarios) {
    for (const testType of testTypes) {
      results.push(
        testDecisionReliability(
          scenario.id,
          testType
        )
      )
    }
  }

  const passedTests = results.filter(
    (result) => result.passed
  ).length

  const failedTests = results.length - passedTests

  const changedDecisions = results.filter(
    (result) =>
      result.testType === 'input_variation' &&
      result.variation?.modified &&
      result.testDecision &&
      !decisionsMatch(
        result.baselineDecision,
        result.testDecision
      )
  ).length

  const untestedVariations = results.filter(
    (result) =>
      result.testType === 'input_variation' &&
      !result.variation?.modified
  ).length

  return {
    totalScenarios: scenarios.length,
    totalTests: results.length,
    passedTests,
    failedTests,

    changedDecisions,
    untestedVariations,

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
