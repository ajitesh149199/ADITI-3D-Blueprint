
import { MISSION_STAGES } from '../data/missionData'

const SENSOR_FAULTS = [
  'camera',
  'distance',
  'imu',
  'gps',
  'microphone',
]

function feedbackOutputs(feedback) {
  if (!feedback || feedback === 'none') {
    return []
  }

  return [feedback.charAt(0).toUpperCase() + feedback.slice(1)]
}

export function evaluateMission(mission, faultId = 'none') {
  const missingRequirements = SENSOR_FAULTS.includes(faultId)
    ? mission.requires.filter((id) => id === faultId)
    : []

  const blocked = missingRequirements.length > 0
  const lowBattery = faultId === 'lowBattery'
  const highLoad = faultId === 'highLoad'

  const expected = mission.expected

  let activePower = mission.activePower
  let latency = mission.latency

  if (lowBattery) {
    activePower *= 0.8
    latency = Math.round(latency * 1.2)
  }

  if (highLoad) {
    activePower *= 1.15
    latency = Math.round(latency * 1.8)
  }

  const originalOutputs = feedbackOutputs(expected.feedback)

  let outputs = blocked ? [] : [...originalOutputs]

  if (faultId === 'audioOutput') {
    outputs = outputs.filter((output) => output !== 'Audio')
  }

  let status = 'Completed'
  let explanation = mission.description

  if (blocked) {
    status = 'Blocked'
    explanation =
      `Mission blocked: required sensor unavailable (${missingRequirements.join(', ')}).`
  } else if (
    faultId === 'audioOutput' &&
    originalOutputs.includes('Audio')
  ) {
    status = 'Degraded'
    explanation =
      'Audio output unavailable. The expected audio feedback cannot be delivered.'
  } else if (lowBattery) {
    status = 'Degraded'
    explanation =
      'Simulated low-power operation applied. Estimated processing latency increased.'
  } else if (highLoad) {
    status = 'Degraded'
    explanation =
      'Simulated high processor load increased estimated latency.'
  } else if (expected.suppression === 'suppress') {
    explanation =
      'The scenario expects suppression of low-priority output.'
  } else {
    explanation =
      `The scenario expects ${expected.feedback} feedback with ${expected.risk} risk.`
  }

  const durationHours = mission.duration / 3600

  const activeEnergyWh = blocked
    ? 0
    : activePower * durationHours

  const baselineEnergyWh = blocked
    ? 0
    : mission.baselinePower * durationHours

  const savingsPercent = blocked
    ? 0
    : Math.round(
        (1 - activePower / mission.baselinePower) * 100
      )

  return {
    missionId: mission.id,
    missionName: mission.name,
    category: mission.category,
    objective: mission.objective,
    description: mission.description,
    status,
    explanation,
    faultId,
    risk: expected.risk,
    suppression: expected.suppression,
    expectedFeedback: expected.feedback,
    outputs,
    sensors: [...mission.sensors],
    missingRequirements,
    latency: blocked ? null : latency,
    activePower: blocked ? 0 : activePower,
    activeEnergyWh,
    baselineEnergyWh,
    savingsPercent,
    duration: mission.duration,
    stages: blocked
      ? ['Preflight Check']
      : [...MISSION_STAGES],
  }
}
