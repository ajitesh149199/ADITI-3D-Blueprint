
import {
  getAvailableScenarios,
  getScenario,
} from '../simulation/ScenarioSimulationEngine'

// These values are illustrative mission-level assumptions,
// not measurements from ADITI hardware.

const MISSION_PROFILES = {
  obstacle: { power: 3.8, latency: 115, duration: 60 },
  text_reading: { power: 4.1, latency: 220, duration: 90 },
  general_assistance: { power: 4.5, latency: 175, duration: 120 },
  irrelevant_noise: { power: 1.7, latency: 65, duration: 60 },
  object_identification: { power: 3.9, latency: 180, duration: 60 },
  navigation: { power: 4.4, latency: 165, duration: 120 },
  person_detection: { power: 3.7, latency: 140, duration: 60 },
  staircase: { power: 4.0, latency: 125, duration: 60 },
  traffic: { power: 4.6, latency: 130, duration: 60 },
  indoor_navigation: { power: 4.2, latency: 155, duration: 120 },
  emergency: { power: 4.8, latency: 100, duration: 60 },
  low_battery: { power: 1.4, latency: 80, duration: 60 },
}

const DEFAULT_PROFILE = {
  power: 3.5,
  latency: 160,
  duration: 60,
}

export const MISSIONS = getAvailableScenarios().map((scenario) => {
  const fullScenario = getScenario(scenario.id)
  const profile =
    MISSION_PROFILES[scenario.id] ?? DEFAULT_PROFILE

  return {
    ...scenario,
    expected: { ...fullScenario.expected },
    sensors: [...scenario.requiredSensors],
    requires: [...scenario.requiredSensors],
    activePower: profile.power,
    baselinePower: 5.2,
    latency: profile.latency,
    duration: profile.duration,
  }
})

export const MISSION_STAGES = [
  'Sensor Acquisition',
  'Sensor Fusion',
  'Relevance Analysis',
  'Risk Assessment',
  'Suppression Decision',
  'Feedback Selection',
]

export const MISSION_FAULTS = [
  { id: 'none', name: 'Normal Operation' },
  { id: 'camera', name: 'Camera Unavailable' },
  { id: 'distance', name: 'Distance Sensor Unavailable' },
  { id: 'imu', name: 'IMU Unavailable' },
  { id: 'gps', name: 'GPS Unavailable' },
  { id: 'microphone', name: 'Microphone Unavailable' },
  { id: 'audioOutput', name: 'Audio Output Unavailable' },
  { id: 'lowBattery', name: 'Low Battery' },
  { id: 'highLoad', name: 'High Processor Load' },
]
