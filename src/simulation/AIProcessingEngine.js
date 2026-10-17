
/* ============================================================
   ADITI — OBJECTIVE-AWARE AI PROCESSING ENGINE
   Phase 10.5.5B
   Conceptual simulation only
   ============================================================ */

const clamp = (value, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value))

const round = (value, digits = 2) =>
  Number(value.toFixed(digits))

const getLevel = (score) =>
  score >= 0.7
    ? 'high'
    : score >= 0.35
      ? 'medium'
      : 'low'

// ============================================================
// STAGE 1 — SENSOR FUSION
// ============================================================

export function fuseSensorData(sensorData = {}) {
  const camera = sensorData.camera ?? null
  const imu = sensorData.imu ?? null
  const gps = sensorData.gps ?? null
  const microphone = sensorData.microphone ?? null
  const distanceSensor = sensorData.distance ?? null

  const distances = [
    camera?.distance,
    distanceSensor?.distance,
  ].filter(
    (value) => Number.isFinite(value) && value >= 0
  )

  return {
    detectedObject: camera?.detectedObject ?? null,
    confidence: camera?.confidence ?? null,
    nearestDistance:
      distances.length > 0 ? Math.min(...distances) : null,
    movement: imu?.movement ?? 'unknown',
    speed: gps?.speed ?? null,
    navigationInstruction: gps?.instruction ?? null,
    detectedSound: microphone?.detectedSound ?? null,
    soundLevel: microphone?.soundLevel ?? null,
    activeSources: Object.keys(sensorData),
  }
}

// ============================================================
// STAGE 2 — OBJECTIVE-AWARE RELEVANCE
// ============================================================

export function analyzeRelevance(
  fusedData,
  objective = 'general_assistance'
) {
  const object = fusedData.detectedObject
  const distance = fusedData.nearestDistance
  const sound = fusedData.detectedSound

  let score = 0

  switch (objective) {
    case 'read_text':
      score = object === 'text' ? 0.95 : 0.1
      break

    case 'identify_object':
      score = object ? 0.9 : 0.1
      break

    case 'identify_person':
      score = object === 'person' ? 0.92 : 0.1
      break

    case 'navigation':
      score = fusedData.navigationInstruction ? 0.95 : 0.2
      break

    case 'indoor_navigation':
      score = ['door', 'corridor'].includes(object)
        ? 0.9
        : 0.2
      break

    case 'obstacle_avoidance':
      score = object && distance !== null && distance < 2
        ? 0.95
        : 0.2
      break

    case 'traffic_awareness':
      score =
        ['car', 'truck', 'bus'].includes(object) ||
        ['horn', 'traffic', 'vehicle'].includes(sound)
          ? 0.95
          : 0.2
      break

    case 'emergency_alert':
      score = object === 'hazard' || sound === 'alarm'
        ? 1
        : 0.2
      break

    case 'power_saving':
      score = 0.05
      break

    default:
      if (object) score += 0.3

      if (distance !== null) {
        score += distance < 2 ? 0.4 : 0.1
      }

      if (['horn', 'traffic', 'vehicle'].includes(sound)) {
        score += 0.25
      }

      if (fusedData.movement === 'walking') {
        score += 0.1
      }
  }

  const relevanceScore = round(clamp(score))

  return {
    score: relevanceScore,
    level: getLevel(relevanceScore),
  }
}

// ============================================================
// STAGE 3 — OBJECTIVE-AWARE RISK
// ============================================================

export function assessRisk(
  fusedData,
  objective = 'general_assistance'
) {
  const object = fusedData.detectedObject
  const distance = fusedData.nearestDistance
  const sound = fusedData.detectedSound

  let score = 0

  const informationObjectives = [
    'read_text',
    'identify_object',
    'identify_person',
    'navigation',
    'indoor_navigation',
  ]

  if (informationObjectives.includes(objective)) {
    // Nearby informational targets are not automatically hazards.
    score = 0.1

  } else if (objective === 'power_saving') {
    score = 0.05

  } else if (objective === 'emergency_alert') {
    score = object === 'hazard' || sound === 'alarm'
      ? 0.95
      : 0.15

  } else if (objective === 'traffic_awareness') {
    const vehicleDetected =
      ['car', 'truck', 'bus'].includes(object) ||
      ['horn', 'traffic', 'vehicle'].includes(sound)

    score = vehicleDetected
      ? distance !== null && distance < 3
        ? 0.9
        : 0.45
      : 0.1

  } else if (objective === 'obstacle_avoidance') {
    if (distance !== null) {
      score =
        distance < 1.5
          ? 0.85
          : distance < 3
            ? 0.45
            : 0.1
    }

    if (fusedData.movement === 'walking') {
      score += 0.1
    }

  } else {
    // Preserve original rules for general live simulation.
    if (distance !== null) {
      score +=
        distance < 1
          ? 0.7
          : distance < 2
            ? 0.4
            : 0.1
    }

    if (fusedData.movement === 'walking') {
      score += 0.15
    }

    if (sound === 'horn') {
      score += 0.25
    }
  }

  const riskScore = round(clamp(score))

  return {
    score: riskScore,
    level: getLevel(riskScore),
  }
}

// ============================================================
// STAGE 4 — SUPPRESSION
// ============================================================

export function evaluateSuppression(
  relevance,
  risk,
  objective = 'general_assistance'
) {
  if (risk.level === 'high') {
    return {
      action: 'keep',
      reason: 'High simulated risk priority',
    }
  }

  if (objective === 'power_saving') {
    return {
      action: 'suppress',
      reason: 'Simulated power-saving mode',
    }
  }

  if (relevance.score < 0.2) {
    return {
      action: 'suppress',
      reason: 'Low relevance score',
    }
  }

  if (relevance.score < 0.45) {
    return {
      action: 'delay',
      reason: 'Moderate relevance; defer output',
    }
  }

  return {
    action: 'keep',
    reason: 'Relevant event for current objective',
  }
}

// ============================================================
// STAGE 5 — FEEDBACK SELECTION
// ============================================================

export function selectFeedback(
  risk,
  suppression,
  objective = 'general_assistance'
) {
  if (suppression.action !== 'keep') {
    return 'none'
  }

  if (risk.level === 'high') {
    return 'haptic'
  }

  const audioObjectives = [
    'read_text',
    'identify_object',
    'identify_person',
    'navigation',
    'indoor_navigation',
    'traffic_awareness',
    'obstacle_avoidance',
    'emergency_alert',
  ]

  if (audioObjectives.includes(objective)) {
    return 'audio'
  }

  if (risk.level === 'medium') {
    return 'audio'
  }

  return 'visual'
}

// ============================================================
// COMPLETE PROCESSING PIPELINE
// ============================================================

export function processSensorData(
  sensorData = {},
  options = {}
) {
  const objective =
    (typeof options === 'string'
      ? options
      : options?.objective) || 'general_assistance'

  const fusedData = fuseSensorData(sensorData)

  const relevance = analyzeRelevance(
    fusedData,
    objective
  )

  const risk = assessRisk(
    fusedData,
    objective
  )

  const suppression = evaluateSuppression(
    relevance,
    risk,
    objective
  )

  const feedback = selectFeedback(
    risk,
    suppression,
    objective
  )

  return {
    fusedData,
    relevance,
    risk,
    suppression,
    feedback,
    objective,
    timestamp: Date.now(),
  }
}
