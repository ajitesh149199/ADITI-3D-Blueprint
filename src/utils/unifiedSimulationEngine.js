
import {
  getScenario,
  getScenarioSensorData,
} from '../simulation/ScenarioSimulationEngine'

import {
  processSensorData,
} from '../simulation/AIProcessingEngine'

import {
  POWER_COMPONENTS,
  DEFAULT_BATTERY,
} from '../data/powerData'

import {
  calculatePower,
  calculateBattery,
} from './powerCalculations'

const SENSOR_IDS = [
  'camera',
  'distance',
  'imu',
  'gps',
  'microphone',
]

const FAULT_TO_MODULE = {
  'camera-failure': 'camera',
  'distance-failure': 'distance',
  'imu-failure': 'imu',
  'audio-failure': 'audioOutput',
  'high-load': 'highLoad',
  'low-battery': 'lowBattery',
}

export function normalizeFaults(faultIds = []) {
  return [...new Set(
    faultIds.map((id) => FAULT_TO_MODULE[id] ?? id)
  )]
}

export function runUnifiedScenario(
  scenarioId,
  faultIds = []
) {
  const scenario = getScenario(scenarioId)

  if (!scenario) {
    throw new Error(`Unknown scenario: ${scenarioId}`)
  }

  const faults = normalizeFaults(faultIds)
  const missingSensors = scenario.requiredSensors.filter(
    (sensor) => faults.includes(sensor)
  )

  const blocked = missingSensors.length > 0

  const readings = getScenarioSensorData(scenarioId)

  const processedReadings = { ...readings }

  for (const fault of faults) {
    if (SENSOR_IDS.includes(fault)) {
      delete processedReadings[fault]
    }
  }

  // The scenario objective is essential for correct
  // relevance, risk, suppression and feedback selection.
  const aiResult = blocked
    ? null
    : processSensorData(processedReadings, {
        objective: scenario.objective,
      })

  const expected = { ...scenario.expected }

  const actual = aiResult
    ? {
        risk: aiResult.risk.level,
        suppression: aiResult.suppression.action,
        feedback: aiResult.feedback,
      }
    : null

  const comparison = actual
    ? {
        risk: actual.risk === expected.risk,
        suppression:
          actual.suppression === expected.suppression,
        feedback: actual.feedback === expected.feedback,
      }
    : null

  const audioUnavailable = faults.includes('audioOutput')
  const feedbackUnavailable =
    audioUnavailable && actual?.feedback === 'audio'

  const highLoad = faults.includes('highLoad')
  const lowBattery = faults.includes('lowBattery')

  const estimatedLatency = blocked
    ? null
    : Math.round(
        140 *
        (highLoad ? 1.8 : 1) *
        (lowBattery ? 1.2 : 1)
      )

  const componentList = Array.isArray(POWER_COMPONENTS)
    ? POWER_COMPONENTS
    : Object.values(POWER_COMPONENTS ?? {})

  const activeIds = new Set([
    'raspberryPi',
    'battery',
    ...scenario.requiredSensors,
  ])

  if (actual?.feedback === 'audio' && !audioUnavailable) {
    activeIds.add('audioOutput')
  }

  if (actual?.feedback === 'haptic') {
    activeIds.add('vibrationMotorleft')
    activeIds.add('vibrationMotorright')
  }

  const power = calculatePower(
    componentList,
    [...activeIds],
    highLoad ? 1.4 : lowBattery ? 0.8 : 1
  )

  const battery = calculateBattery(
    DEFAULT_BATTERY,
    power.totalWatts
  )

  const mismatch = comparison
    ? Object.values(comparison).some((value) => !value)
    : false

  const status = blocked
    ? 'Blocked'
    : feedbackUnavailable || highLoad || lowBattery
      ? 'Degraded'
      : mismatch
        ? 'Mismatch'
        : 'Completed'

  return {
    scenarioId,
    scenarioName: scenario.name,
    category: scenario.category,
    objective: scenario.objective,
    status,
    expected,
    actual,
    comparison,
    aiResult,
    readings: processedReadings,
    missingSensors,
    faults,
    feedbackUnavailable,
    estimatedLatency,
    power: {
      ...power,
      ...battery,
    },
    timestamp: Date.now(),
  }
}
