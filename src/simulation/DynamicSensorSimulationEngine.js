
/* ============================================================
   ADITI — DYNAMIC SENSOR SIMULATION ENGINE
   Phase 10.5.13D.1

   Produces deterministic variations in simulated
   sensor readings over successive simulation ticks.

   This does not read physical sensors.
   ============================================================ */

import {
  buildBaselineSensorData,
} from './ResourceComparisonEngine'

// Create a deep copy without modifying the baseline.
function cloneData(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value))
}

// Round numeric values for readable monitoring.
function round(value, digits = 2) {
  return Number(value.toFixed(digits))
}

// Smooth, repeatable oscillation between -1 and +1.
function oscillation(tick, speed = 0.2) {
  return Math.sin(tick * speed)
}

function updateNumericField(
  object,
  key,
  change,
  minimum = -Infinity,
  maximum = Infinity
) {
  if (
    !object ||
    typeof object !== 'object' ||
    typeof object[key] !== 'number' ||
    !Number.isFinite(object[key])
  ) {
    return false
  }

  object[key] = round(
    Math.max(
      minimum,
      Math.min(maximum, object[key] + change)
    )
  )

  return true
}

export function generateDynamicSensorData(
  scenarioId,
  tick = 1
) {
  const baseline = buildBaselineSensorData(
    scenarioId
  )

  if (!baseline) {
    throw new Error(
      `No baseline sensor data for: ${scenarioId}`
    )
  }

  const sensorData = cloneData(baseline)

  const currentTick = Math.max(
    1,
    Math.floor(Number(tick) || 1)
  )

  const wave = oscillation(currentTick)
  const slowWave = oscillation(currentTick, 0.1)

  // --------------------------------------------------------
  // DISTANCE SENSOR
  // --------------------------------------------------------

  if (
    sensorData.distance &&
    typeof sensorData.distance === 'object'
  ) {
    updateNumericField(
      sensorData.distance,
      'distance',
      wave * 0.5,
      0.1
    )

    updateNumericField(
      sensorData.distance,
      'distance_m',
      wave * 0.5,
      0.1
    )

    updateNumericField(
      sensorData.distance,
      'value',
      wave * 0.5,
      0.1
    )
  }

  // --------------------------------------------------------
  // CAMERA
  // --------------------------------------------------------

  if (
    sensorData.camera &&
    typeof sensorData.camera === 'object'
  ) {
    updateNumericField(
      sensorData.camera,
      'distance',
      wave * 0.5,
      0.1
    )

    updateNumericField(
      sensorData.camera,
      'confidence',
      slowWave * 0.03,
      0,
      1
    )
  }

  // --------------------------------------------------------
  // IMU
  // --------------------------------------------------------

  if (
    sensorData.imu &&
    typeof sensorData.imu === 'object'
  ) {
    updateNumericField(
      sensorData.imu,
      'heading',
      wave * 3,
      0,
      360
    )

    updateNumericField(
      sensorData.imu,
      'acceleration',
      slowWave * 0.1
    )
  }

  // --------------------------------------------------------
  // GPS
  // --------------------------------------------------------

  if (
    sensorData.gps &&
    typeof sensorData.gps === 'object'
  ) {
    updateNumericField(
      sensorData.gps,
      'latitude',
      slowWave * 0.00001,
      -90,
      90
    )

    updateNumericField(
      sensorData.gps,
      'longitude',
      wave * 0.00001,
      -180,
      180
    )
  }

  // --------------------------------------------------------
  // MICROPHONE
  // --------------------------------------------------------

  if (
    sensorData.microphone &&
    typeof sensorData.microphone === 'object'
  ) {
    updateNumericField(
      sensorData.microphone,
      'noise_level',
      wave * 2,
      0
    )

    updateNumericField(
      sensorData.microphone,
      'decibels',
      wave * 2,
      0
    )
  }

  return sensorData
}

// Compare two sensor snapshots to identify changed fields.
export function compareSensorSnapshots(
  previous,
  current
) {
  const changes = []

  if (!previous || !current) {
    return changes
  }

  for (const sensorName of Object.keys(current)) {
    const previousSensor = previous[sensorName]
    const currentSensor = current[sensorName]

    if (
      !currentSensor ||
      typeof currentSensor !== 'object' ||
      Array.isArray(currentSensor)
    ) {
      continue
    }

    for (const key of Object.keys(currentSensor)) {
      const oldValue = previousSensor?.[key]
      const newValue = currentSensor[key]

      if (
        typeof oldValue === 'number' &&
        typeof newValue === 'number' &&
        oldValue !== newValue
      ) {
        changes.push({
          sensor: sensorName,
          field: key,
          previous: oldValue,
          current: newValue,
          difference: round(newValue - oldValue, 6),
        })
      }
    }
  }

  return changes
}
