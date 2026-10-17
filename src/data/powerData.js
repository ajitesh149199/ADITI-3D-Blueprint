
/*
  ADITI Phase 10.5.14H
  Provisional component power model.

  Values are illustrative average watts while enabled.
  They must be replaced with measured or datasheet-based
  values after exact hardware models are selected.
*/

export const POWER_COMPONENTS = [
  { id: 'raspberryPi', name: 'Raspberry Pi', group: 'Processing', watts: 5.0 },
  { id: 'camera', name: 'Front Camera', group: 'Input', watts: 1.0 },
  { id: 'rearCamera', name: 'Rear Camera', group: 'Input', watts: 1.0 },
  { id: 'distance', name: 'Distance Sensor', group: 'Input', watts: 0.15 },
  { id: 'imu', name: 'IMU', group: 'Input', watts: 0.05 },
  { id: 'microphone', name: 'Microphone', group: 'Input', watts: 0.1 },
  { id: 'audioOutput', name: 'Audio Output', group: 'Output', watts: 0.5 },
  { id: 'vibrationMotorleft', name: 'Left Vibration Motor', group: 'Output', watts: 0.3 },
  { id: 'vibrationMotorright', name: 'Right Vibration Motor', group: 'Output', watts: 0.3 },
  { id: 'torch', name: 'Assistive Torch', group: 'Output', watts: 1.0 },
  { id: 'switches', name: 'Physical Switches', group: 'Controls', watts: 0 },
  { id: 'statusLEDs', name: 'Status LEDs', group: 'Controls', watts: 0.1 },
  { id: 'battery', name: 'Battery System', group: 'Power', watts: 0 },
]

export const POWER_PROFILES = {
  standby: {
    name: 'Standby',
    description: 'Minimal conceptual monitoring configuration.',
    enabled: ['raspberryPi', 'imu', 'switches', 'statusLEDs'],
    processingFactor: 0.45,
  },
  obstacle: {
    name: 'Obstacle Detection',
    description: 'Front vision, proximity sensing, and warning feedback.',
    enabled: [
      'raspberryPi', 'camera', 'distance', 'imu',
      'audioOutput', 'vibrationMotorleft',
      'vibrationMotorright', 'switches', 'statusLEDs',
    ],
    processingFactor: 0.85,
  },
  reading: {
    name: 'Text Reading',
    description: 'Camera input and spoken text output.',
    enabled: [
      'raspberryPi', 'camera', 'imu', 'microphone',
      'audioOutput', 'switches', 'statusLEDs',
    ],
    processingFactor: 0.9,
  },
  general: {
    name: 'General Assistance',
    description: 'Broad conceptual hardware activation.',
    enabled: POWER_COMPONENTS
      .filter((component) => component.id !== 'battery')
      .map((component) => component.id),
    processingFactor: 1,
  },
}

export const DEFAULT_BATTERY = {
  capacityMah: 5000,
  voltage: 3.7,
  usablePercent: 80,
  efficiencyPercent: 85,
}

export const POWER_SYSTEM_NODES = [
  'Battery',
  'Protection & Regulation',
  'Processing',
  'Input Sensors',
  'Output & Feedback',
  'Controls & Indicators',
]
