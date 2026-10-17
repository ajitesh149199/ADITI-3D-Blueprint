
export const DIAGNOSTIC_HARDWARE = [
  ['camera', 'Front Camera', 'Vision'],
  ['distance', 'Distance Sensor', 'Sensors'],
  ['imu', 'IMU', 'Sensors'],
  ['rearCamera', 'Rear Camera', 'Vision'],
  ['battery', 'Battery System', 'Power'],
  ['raspberryPi', 'Raspberry Pi', 'Processing'],
  ['microphone', 'Microphone', 'Audio'],
  ['audioOutput', 'Audio Output', 'Audio'],
  ['vibrationMotorleft', 'Left Vibration Motor', 'Feedback'],
  ['vibrationMotorright', 'Right Vibration Motor', 'Feedback'],
  ['torch', 'Torch', 'Feedback'],
  ['switches', 'Switches', 'Controls'],
  ['statusLEDs', 'Status LEDs', 'Controls'],
].map(([id, name, group]) => ({ id, name, group }))

export const DIAGNOSTIC_FAULTS = [
  {
    id: 'camera-failure',
    target: 'camera',
    name: 'Front Camera Disconnected',
    severity: 'critical',
  },
  {
    id: 'distance-failure',
    target: 'distance',
    name: 'Distance Sensor Unreliable',
    severity: 'warning',
  },
  {
    id: 'imu-failure',
    target: 'imu',
    name: 'IMU Disconnected',
    severity: 'critical',
  },
  {
    id: 'high-load',
    target: 'raspberryPi',
    name: 'High Processing Load',
    severity: 'warning',
  },
  {
    id: 'low-battery',
    target: 'battery',
    name: 'Low Battery',
    severity: 'warning',
  },
  {
    id: 'audio-failure',
    target: 'audioOutput',
    name: 'Audio Output Disconnected',
    severity: 'critical',
  },
]

export const BASELINE_METRICS = {
  cpu: 34,
  memory: 41,
  latency: 74,
  workload: 38,
  battery: 82,
}
