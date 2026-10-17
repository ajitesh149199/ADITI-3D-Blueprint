
const OBJECTS = [
  'person',
  'chair',
  'table',
  'door',
  'vehicle',
  'stairs',
]

const SOUNDS = [
  'speech',
  'traffic',
  'footsteps',
  'horn',
  'ambient_noise',
]

const randomBetween = (min, max, decimals = 2) => {
  return Number(
    (Math.random() * (max - min) + min).toFixed(decimals)
  )
}

const randomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)]
}

// ------------------------------------------------------------
// CAMERA SENSOR
// ------------------------------------------------------------

export function simulateCamera() {
  return {
    detectedObject: randomItem(OBJECTS),
    confidence: randomBetween(0.65, 0.99),
    distance: randomBetween(0.5, 8),
    timestamp: Date.now(),
  }
}

// ------------------------------------------------------------
// IMU SENSOR
// ------------------------------------------------------------

export function simulateIMU() {
  const acceleration = {
    x: randomBetween(-2, 2),
    y: randomBetween(-2, 2),
    z: randomBetween(8.5, 10.5),
  }

  const angularVelocity = {
    x: randomBetween(-30, 30),
    y: randomBetween(-30, 30),
    z: randomBetween(-30, 30),
  }

  return {
    acceleration,
    angularVelocity,
    movement: randomItem([
      'standing',
      'walking',
      'turning',
    ]),
    timestamp: Date.now(),
  }
}

// ------------------------------------------------------------
// GPS SENSOR
// ------------------------------------------------------------

// Synthetic coordinates near a fixed demonstration location.
// These are NOT the user's live location.

const DEMO_LATITUDE = 30.3165
const DEMO_LONGITUDE = 78.0322

export function simulateGPS() {
  return {
    latitude: Number(
      (DEMO_LATITUDE + randomBetween(-0.002, 0.002, 6))
        .toFixed(6)
    ),
    longitude: Number(
      (DEMO_LONGITUDE + randomBetween(-0.002, 0.002, 6))
        .toFixed(6)
    ),
    speed: randomBetween(0, 5),
    timestamp: Date.now(),
  }
}

// ------------------------------------------------------------
// MICROPHONE SENSOR
// ------------------------------------------------------------

export function simulateMicrophone() {
  return {
    soundLevel: randomBetween(25, 90),
    detectedSound: randomItem(SOUNDS),
    timestamp: Date.now(),
  }
}

// ------------------------------------------------------------
// DISTANCE SENSOR
// ------------------------------------------------------------

export function simulateDistance() {
  const distance = randomBetween(0.3, 5)

  let proximity = 'safe'

  if (distance < 1) {
    proximity = 'near'
  } else if (distance < 2) {
    proximity = 'moderate'
  }

  return {
    distance,
    proximity,
    timestamp: Date.now(),
  }
}

// ------------------------------------------------------------
// CENTRAL SENSOR GENERATOR
// ------------------------------------------------------------

const SENSOR_GENERATORS = {
  camera: simulateCamera,
  imu: simulateIMU,
  gps: simulateGPS,
  microphone: simulateMicrophone,
  distance: simulateDistance,
}

export function generateSensorData(activeSensors = {}) {
  const data = {}

  for (const [sensorName, enabled] of Object.entries(
    activeSensors
  )) {
    const generator = SENSOR_GENERATORS[sensorName]

    if (enabled && generator) {
      data[sensorName] = generator()
    }
  }

  return data
}
