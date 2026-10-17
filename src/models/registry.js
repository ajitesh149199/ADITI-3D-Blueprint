
/**
 * ADITI Hardware Model Registry
 *
 * Model filenames correspond to files in /public/models.
 * Submesh names are discovered at runtime.
 *
 * Technical specifications will be extended
 * in later development steps.
 */

export const MODEL_FILES = {
  glasses: 'ADITI_3D.glb',
  hw01: 'HW01_RaspberryPi_Zero2W.glb',
  hw02: 'HW02_Camera_Module3.glb',
  
  hw05_06: "HW05_HW06.glb",
  hw07_08_09: "HW07_HW08_HW09.glb",

  hw10_11_12: 'HW10_HW11_HW12.glb',
  hw15_23_28: 'HW15_HW23_HW28.glb',
  hw18_21_22:
    'HW18_IMUHW21_HapticMotorHW22_HapticDriver.glb',
  hw19: 'HW19_GNSS_M10_Antenna_2.glb',
  hw20: 'HW20_VL53L1X_ToF.glb',
}


export function modelUrl(id) {
  const file = MODEL_FILES[id]

  if (!file) return null

  return `/models/${encodeURIComponent(file)}`
}


export const COMPONENTS = [
  {
    id: 'glasses',
    hardwareId: 'ADITI-ASM',
    name: 'ADITI Smart Glasses',
    shortName: 'Assembly',
    role: 'Primary wearable enclosure and optical chassis',
    systemRole: 'Wearable hardware platform',
    category: 'assembly',
    fileId: 'glasses',
    targetSize: 2.4,

    labels: ['ADITI Smart Glasses'],

    functions: [
      'Provides the wearable structural framework',
      'Supports integration of sensing and computing hardware',
      'Serves as the physical platform for assistive feedback',
    ],

    details:
      'Primary GLB of the ADITI assistive smart glasses. Geometry, materials, and textures are preserved from the source asset. Independent hardware GLBs are not assumed to be pre-mounted inside this assembly.',
  },

  {
    id: 'hw01',
    hardwareId: 'HW01',
    name: 'Raspberry Pi Zero 2 W',
    shortName: 'Compute',
    role: 'Edge computing',
    systemRole: 'Central processing unit',
    category: 'compute',
    fileId: 'hw01',
    targetSize: 0.42,

    labels: ['Raspberry Pi Zero 2 W'],

    functions: [
      'Processes information received from connected sensors',
      'Supports computer vision and AI inference',
      'Executes ADITI decision-making logic',
      'Coordinates selected user feedback',
    ],

    details:
      'On-device processor for computer vision, navigation logic, and intelligent feedback. Loaded from HW01_RaspberryPi_Zero2W.glb.',
  },

  {
    id: 'hw02',
    hardwareId: 'HW02',
    name: 'Camera Module 3',
    shortName: 'Vision',
    role: 'Visual perception',
    systemRole: 'Visual input sensor',
    category: 'sensing',
    fileId: 'hw02',
    targetSize: 0.28,

    labels: ['Camera Module 3'],

    functions: [
      'Captures visual information from the surroundings',
      'Provides images for object recognition',
      'Supports text-reading applications',
      'Supplies visual context for ADITI decisions',
    ],

    details:
      'Primary visual sensor for scene understanding. Loaded from HW02_Camera_Module3.glb.',
  },

  {
    id: 'hw20',
    hardwareId: 'HW20',
    name: 'VL53L1X Time-of-Flight',
    shortName: 'ToF',
    role: 'Distance measurement',
    systemRole: 'Proximity sensing',
    category: 'sensing',
    fileId: 'hw20',
    targetSize: 0.22,

    labels: ['VL53L1X ToF'],

    functions: [
      'Measures proximity using time-of-flight sensing',
      'Provides distance information for nearby obstacles',
      'Supports obstacle-awareness decisions',
    ],

    details:
      'Short-range distance sensor for obstacle proximity. Loaded from HW20 VL53L1X ToF.glb.',
  },

  {
    id: 'hw19',
    hardwareId: 'HW19',
    name: 'GNSS M10 + Antenna',
    shortName: 'GNSS',
    role: 'Outdoor positioning',
    systemRole: 'Location sensing',
    category: 'sensing',
    fileId: 'hw19',
    targetSize: 0.3,

    labels: ['GNSS M10'],

    functions: [
      'Receives satellite positioning information',
      'Provides outdoor location data',
      'Supports location-aware assistance',
    ],

    details:
      'Satellite positioning receiver and antenna for outdoor navigation. Loaded from HW19_GNSS_M10_Antenna (2).glb.',
  },

  {
    id: 'hw18_21_22',
    hardwareId: 'HW18 / HW21 / HW22',
    name: 'IMU + Haptic System',
    shortName: 'IMU / Haptic',
    role: 'Motion sensing and vibration feedback',
    systemRole: 'Motion input and tactile feedback',
    category: 'sensing',
    fileId: 'hw18_21_22',
    targetSize: 0.32,

    labels: [
      'IMU',
      'Haptic actuator',
      'Haptic driver',
    ],

    functions: [
      'Detects movement and orientation using the IMU',
      'Provides tactile notifications through vibration',
      'Controls haptic feedback through the driver',
    ],

    details:
      'Shared GLB containing IMU, haptic motor, and haptic driver (HW18 / HW21 / HW22). Individual parts are labeled from runtime mesh names when the file hierarchy allows; otherwise the parent group label is retained.',

    grouped: true,

    groupedParts: [
      {
        id: 'imu',
        name: 'IMU',
        role: 'Motion sensing',
      },
      {
        id: 'haptic-actuator',
        name: 'Haptic actuator',
        role: 'Vibration feedback',
      },
      {
        id: 'haptic-driver',
        name: 'Haptic driver',
        role: 'Haptic control',
      },
    ],
  },

  {
    id: 'hw07_08_09',
    hardwareId: 'HW07 / HW08 / HW09',
    name: 'Audio Subsystem',
    shortName: 'Audio',
    role: 'Audio input and spoken feedback',
    systemRole: 'Audio input and output',
    category: 'output',
    fileId: 'hw07_08_09',
    targetSize: 0.36,

    labels: [
      'Microphone',
      'Audio amplifier',
      'Bone-conduction transducer',
    ],

    functions: [
      'Captures user audio through the microphone',
      'Supports voice-based interaction',
      'Amplifies generated audio output',
      'Provides spoken feedback through the transducer',
    ],

    details:
      'Shared GLB for microphone, audio amplifier, and bone-conduction transducer (HW07 / HW08 / HW09). Submeshes are identified only when present in the file graph.',

    grouped: true,

    groupedParts: [
      {
        id: 'mic',
        name: 'Microphone',
        role: 'Audio input',
      },
      {
        id: 'amp',
        name: 'Audio amplifier',
        role: 'Sound output',
      },
      {
        id: 'bone',
        name: 'Bone-conduction transducer',
        role: 'Spoken feedback',
      },
    ],
  },

  {
    id: 'hw05_06',
    hardwareId: 'HW05 / HW06',
    name: 'Power System',
    shortName: 'Power',
    role: 'Power delivery',
    systemRole: 'Power management',
    category: 'power',
    fileId: 'hw05_06',
    targetSize: 0.34,

    labels: ['Power system'],

    functions: [
      'Supports power delivery to electronic components',
      'Provides the power subsystem for wearable operation',
    ],

    details:
      'Power-related components from HW05 + HW06.glb. Treat as a single power-delivery group unless runtime inspection reveals distinct named parts.',

    grouped: true,

    groupedParts: [
      {
        id: 'power',
        name: 'Power system',
        role: 'Power delivery',
      },
    ],
  },

  {
    id: 'hw10_11_12',
    hardwareId: 'HW10 / HW11 / HW12',
    name: 'Buttons and Indicators',
    shortName: 'Controls',
    role: 'User controls',
    systemRole: 'Physical user interface',
    category: 'interface',
    fileId: 'hw10_11_12',
    targetSize: 0.26,

    labels: ['Buttons and indicators'],

    functions: [
      'Provides physical user interaction controls',
      'Supports system commands through buttons',
      'Provides system status indications',
    ],

    details:
      'User controls and status indicators from HW10 + HW11 + HW12.glb.',

    grouped: true,

    groupedParts: [
      {
        id: 'controls',
        name: 'Buttons and indicators',
        role: 'User controls',
      },
    ],
  },

  {
    id: 'hw15_23_28',
    hardwareId: 'HW15 / HW23 / HW28',
    name: 'Hardware Interfaces',
    shortName: 'Interfaces',
    role: 'Hardware interconnects',
    systemRole: 'Component connectivity',
    category: 'interface',
    fileId: 'hw15_23_28',
    targetSize: 0.3,

    labels: ['Hardware interfaces'],

    functions: [
      'Supports connections between hardware subsystems',
      'Provides hardware interface components',
      'Supports integration of the electronic architecture',
    ],

    details:
      'Hardware interface components from HW15 + HW23 + HW28.glb. Labels follow discovered node names when available.',

    grouped: true,

    groupedParts: [
      {
        id: 'iface',
        name: 'Hardware interfaces',
        role: 'Hardware interconnects',
      },
    ],
  },
]

export const CATEGORY_META = {
  assembly: {
    label: 'Assembly',
    color: '#67e8f9',
  },

  compute: {
    label: 'Compute',
    color: '#38bdf8',
  },

  sensing: {
    label: 'Sensing',
    color: '#22d3ee',
  },

  output: {
    label: 'Feedback',
    color: '#818cf8',
  },

  power: {
    label: 'Power',
    color: '#34d399',
  },

  interface: {
    label: 'Interface',
    color: '#60a5fa',
  },
}

export function getComponent(id) {
  return COMPONENTS.find((component) => component.id === id)
}

export const HARDWARE_IDS = COMPONENTS
  .filter((component) => component.id !== 'glasses')
  .map((component) => component.id)
