
export const HARDWARE_COMPONENTS = [
  {
    id: 'camera',
    name: 'Vision Camera',
    category: 'Vision',
    description: 'Captures visual information for object detection and text recognition.',
    functions: ['Object detection', 'Text recognition', 'Scene understanding'],
    sensorKey: 'camera',
  },
  {
    id: 'imu',
    name: 'IMU Sensor',
    category: 'Motion',
    description: 'Provides simulated movement and orientation information.',
    functions: ['Motion sensing', 'Orientation estimation'],
    sensorKey: 'imu',
  },
  {
    id: 'gps',
    name: 'GPS Module',
    category: 'Location',
    description: 'Supports location-aware assistance and navigation.',
    functions: ['Position estimation', 'Navigation assistance'],
    sensorKey: 'gps',
  },
  {
    id: 'microphone',
    name: 'Microphone',
    category: 'Audio',
    description: 'Provides audio input for the assistance pipeline.',
    functions: ['Audio input', 'Voice interaction'],
    sensorKey: 'microphone',
  },
  {
    id: 'processor',
    name: 'AI Processing Unit',
    category: 'Processing',
    description: 'Executes the multimodal decision and relevance pipeline.',
    functions: ['AI inference', 'Decision selection', 'Output suppression'],
    sensorKey: 'processor',
  },
  {
    id: 'battery',
    name: 'Power System',
    category: 'Power',
    description: 'Supplies power to the simulated hardware architecture.',
    functions: ['Power distribution', 'Energy management'],
    sensorKey: 'battery',
  },
  {
    id: 'speaker',
    name: 'Audio Output',
    category: 'Feedback',
    description: 'Provides spoken assistance and alerts.',
    functions: ['Text-to-speech', 'Audio feedback'],
    sensorKey: 'speaker',
  },
  {
    id: 'haptic',
    name: 'Haptic Feedback',
    category: 'Feedback',
    description: 'Provides vibration-based notifications.',
    functions: ['Haptic alerts', 'Directional feedback'],
    sensorKey: 'haptic',
  },
]

export function getHardwareComponent(id) {
  return HARDWARE_COMPONENTS.find(
    (component) => component.id === id
  ) ?? null
}

export function getHardwareStatus(
  component,
  faultIds = [],
  telemetrySnapshot = null
) {
  if (!component) return 'Unknown'

  const normalizedFaults = faultIds.map(
    (fault) => String(fault).toLowerCase()
  )

  const aliases = {
    camera: ['camera', 'vision'],
    imu: ['imu', 'motion'],
    gps: ['gps', 'location'],
    microphone: ['microphone', 'mic', 'audio_input'],
    processor: ['processor', 'ai', 'compute'],
    battery: ['battery', 'power'],
    speaker: ['speaker', 'audio_output'],
    haptic: ['haptic', 'vibration'],
  }

  const componentAliases =
    aliases[component.id] ?? [component.id]

  const hasFault = normalizedFaults.some((fault) =>
    componentAliases.some((alias) =>
      fault.includes(alias)
    )
  )

  if (hasFault) return 'Simulated Fault'

  if (
    telemetrySnapshot?.missionStatus === 'Blocked'
  ) {
    return 'Mission Blocked'
  }

  return 'Nominal (Simulated)'
}

export function buildHardwareOverview(
  faultIds = [],
  telemetrySnapshot = null
) {
  return HARDWARE_COMPONENTS.map((component) => ({
    ...component,
    status: getHardwareStatus(
      component,
      faultIds,
      telemetrySnapshot
    ),
  }))
}
