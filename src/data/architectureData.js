
/*
  ADITI 3D Blueprint
  Phase 10.5.14G — Architecture Data

  This file describes a proposed logical architecture.
  Scenarios are demonstrations, not live sensor readings.
*/

export const ARCHITECTURE_NODES = [
  {
    id: 'sensors',
    name: 'Sensor Input',
    layer: 'input',
    description: 'Collect visual, proximity, motion, and audio observations.',
    hardware: ['camera', 'rearCamera', 'distance', 'imu', 'microphone'],
  },
  {
    id: 'fusion',
    name: 'Sensor Fusion',
    layer: 'processing',
    description: 'Combine available observations into a shared scene context.',
    hardware: ['raspberryPi'],
  },
  {
    id: 'relevance',
    name: 'Relevance Engine',
    layer: 'decision',
    description: 'Evaluate observations against the active user objective.',
    hardware: ['raspberryPi'],
  },
  {
    id: 'risk',
    name: 'Risk Assessment',
    layer: 'decision',
    description: 'Estimate the urgency and importance of an observation.',
    hardware: ['raspberryPi'],
  },
  {
    id: 'suppression',
    name: 'Suppression Engine',
    layer: 'decision',
    description: 'Reduce unnecessary or low-priority feedback.',
    hardware: ['raspberryPi'],
  },
  {
    id: 'output',
    name: 'Output Manager',
    layer: 'output',
    description: 'Select suitable audio, haptic, or visual feedback.',
    hardware: [
      'audioOutput',
      'vibrationMotorleft',
      'vibrationMotorright',
      'statusLEDs',
    ],
  },
]

export const ARCHITECTURE_CONNECTIONS = [
  ['sensors', 'fusion'],
  ['fusion', 'relevance'],
  ['relevance', 'risk'],
  ['risk', 'suppression'],
  ['suppression', 'output'],
]

export const ARCHITECTURE_SCENARIOS = {
  obstacle: {
    name: 'Obstacle Detection',
    objective: 'obstacle',
    observation: 'Object detected ahead at a potentially relevant distance.',
    stages: {
      sensors: 'Camera and distance sensor report an object ahead.',
      fusion: 'Object location and estimated distance are combined.',
      relevance: 'Obstacle is relevant to the navigation objective.',
      risk: 'Potential collision risk is assessed.',
      suppression: 'Important warning is retained.',
      output: 'Audio or haptic warning is selected.',
    },
    result: 'Simulated obstacle warning',
  },
  text: {
    name: 'Text Reading',
    objective: 'text_reading',
    observation: 'Text is visible within the camera view.',
    stages: {
      sensors: 'Camera captures a frame containing text.',
      fusion: 'Visual observation is associated with the active context.',
      relevance: 'Text is relevant to the reading objective.',
      risk: 'No immediate obstacle risk is assumed in this example.',
      suppression: 'Unrelated observations are filtered.',
      output: 'Text-to-speech feedback is selected.',
    },
    result: 'Simulated spoken text',
  },
  general: {
    name: 'General Assistance',
    objective: 'general_assistance',
    observation: 'An object is identified in the surroundings.',
    stages: {
      sensors: 'Visual and motion observations are available.',
      fusion: 'A combined environmental observation is prepared.',
      relevance: 'The observation is evaluated against the current context.',
      risk: 'Estimated urgency is assessed.',
      suppression: 'Nonessential feedback may be delayed.',
      output: 'A suitable feedback channel is selected if needed.',
    },
    result: 'Simulated contextual assistance',
  },
  noise: {
    name: 'Irrelevant Noise',
    objective: 'irrelevant_noise',
    observation: 'An unrelated low-priority observation is received.',
    stages: {
      sensors: 'A low-priority observation enters the pipeline.',
      fusion: 'The observation is associated with available context.',
      relevance: 'Observation has low relevance to the objective.',
      risk: 'No urgent risk is assumed.',
      suppression: 'Unnecessary feedback is suppressed.',
      output: 'No user-facing alert is generated.',
    },
    result: 'Simulated output suppressed',
  },
}

export const ARCHITECTURE_LAYERS = {
  input: {
    label: 'Input Layer',
    color: '#22d3ee',
  },
  processing: {
    label: 'Processing Layer',
    color: '#a78bfa',
  },
  decision: {
    label: 'Decision Layer',
    color: '#f59e0b',
  },
  output: {
    label: 'Output Layer',
    color: '#34d399',
  },
}
