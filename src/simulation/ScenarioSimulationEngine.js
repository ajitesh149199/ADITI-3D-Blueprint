
/* ============================================================
   ADITI — SCENARIO SIMULATION ENGINE
   Phase 10.5

   12 predefined scenarios for conceptual simulation testing.
   ============================================================ */

export const SIMULATION_SCENARIOS = {

  // ==========================================================
  // 1. OBSTACLE DETECTION
  // ==========================================================

  obstacle: {
    id: 'obstacle',
    name: 'Obstacle Detection',
    category: 'Safety',
    objective: 'obstacle_avoidance',
    description: 'Nearby obstacle while walking.',

    requiredSensors: ['camera', 'imu', 'distance'],

    sensorData: {
      camera: {
        detectedObject: 'person',
        confidence: 0.96,
        distance: 0.65,
      },

      imu: {
        movement: 'walking',
        acceleration: 1.2,
        angularVelocity: 0.15,
      },

      distance: {
        distance: 0.65,
        proximity: 'very_close',
      },
    },

    expected: {
      risk: 'high',
      suppression: 'keep',
      feedback: 'haptic',
    },
  },

  // ==========================================================
  // 2. TEXT READING
  // ==========================================================

  text_reading: {
    id: 'text_reading',
    name: 'Text Reading',
    category: 'Vision',
    objective: 'read_text',
    description: 'Printed text detected nearby.',

    requiredSensors: ['camera'],

    sensorData: {
      camera: {
        detectedObject: 'text',
        confidence: 0.98,
        distance: 0.8,
      },
    },

    expected: {
      risk: 'low',
      suppression: 'keep',
      feedback: 'audio',
    },
  },

  // ==========================================================
  // 3. GENERAL ASSISTANCE
  // ==========================================================

  general_assistance: {
    id: 'general_assistance',
    name: 'General Assistance',
    category: 'System',
    objective: 'general_assistance',
    description: 'Routine surroundings during navigation.',

    requiredSensors: ['camera', 'imu', 'gps'],

    sensorData: {
      camera: {
        detectedObject: 'building',
        confidence: 0.87,
        distance: 6,
      },

      imu: {
        movement: 'walking',
        acceleration: 0.6,
        angularVelocity: 0.08,
      },

      gps: {
        latitude: 30.3165,
        longitude: 78.0322,
        speed: 1.1,
      },
    },

    expected: {
      risk: 'low',
      suppression: 'keep',
      feedback: 'visual',
    },
  },

  // ==========================================================
  // 4. IRRELEVANT NOISE
  // ==========================================================

  irrelevant_noise: {
    id: 'irrelevant_noise',
    name: 'Irrelevant Noise',
    category: 'System',
    objective: 'general_assistance',
    description: 'Low-priority background sound.',

    requiredSensors: ['microphone'],

    sensorData: {
      microphone: {
        detectedSound: 'fan',
        soundLevel: 28,
      },
    },

    expected: {
      risk: 'low',
      suppression: 'suppress',
      feedback: 'none',
    },
  },

  // ==========================================================
  // 5. OBJECT IDENTIFICATION
  // ==========================================================

  object_identification: {
    id: 'object_identification',
    name: 'Object Identification',
    category: 'Vision',
    objective: 'identify_object',
    description: 'Identify an everyday object.',

    requiredSensors: ['camera'],

    sensorData: {
      camera: {
        detectedObject: 'bottle',
        confidence: 0.95,
        distance: 1.4,
      },
    },

    expected: {
      risk: 'low',
      suppression: 'keep',
      feedback: 'audio',
    },
  },

  // ==========================================================
  // 6. NAVIGATION ASSISTANCE
  // ==========================================================

  navigation: {
    id: 'navigation',
    name: 'Navigation Assistance',
    category: 'Navigation',
    objective: 'navigation',
    description: 'Simulated outdoor route guidance.',

    requiredSensors: ['gps', 'imu', 'camera'],

    sensorData: {
      gps: {
        latitude: 30.3165,
        longitude: 78.0322,
        speed: 1.1,
        instruction: 'Turn right in 20 meters',
      },

      imu: {
        movement: 'walking',
        acceleration: 0.5,
        angularVelocity: 0.08,
      },

      camera: {
        detectedObject: 'road',
        confidence: 0.92,
        distance: 8,
      },
    },

    expected: {
      risk: 'low',
      suppression: 'keep',
      feedback: 'audio',
    },
  },

  // ==========================================================
  // 7. PERSON DETECTION
  // ==========================================================

  person_detection: {
    id: 'person_detection',
    name: 'Person Detection',
    category: 'Vision',
    objective: 'identify_person',
    description: 'Detect a person in view.',

    requiredSensors: ['camera', 'distance'],

    sensorData: {
      camera: {
        detectedObject: 'person',
        confidence: 0.94,
        distance: 2.8,
      },

      distance: {
        distance: 2.8,
        proximity: 'moderate',
      },
    },

    expected: {
      risk: 'low',
      suppression: 'keep',
      feedback: 'audio',
    },
  },

  // ==========================================================
  // 8. STAIRCASE DETECTION
  // ==========================================================

  staircase: {
    id: 'staircase',
    name: 'Staircase Detection',
    category: 'Safety',
    objective: 'obstacle_avoidance',
    description: 'Detect stairs while walking.',

    requiredSensors: ['camera', 'imu', 'distance'],

    sensorData: {
      camera: {
        detectedObject: 'stairs',
        confidence: 0.97,
        distance: 0.9,
      },

      imu: {
        movement: 'walking',
        acceleration: 0.8,
        angularVelocity: 0.1,
      },

      distance: {
        distance: 0.9,
        proximity: 'close',
      },
    },

    expected: {
      risk: 'high',
      suppression: 'keep',
      feedback: 'haptic',
    },
  },

  // ==========================================================
  // 9. TRAFFIC AWARENESS
  // ==========================================================

  traffic: {
    id: 'traffic',
    name: 'Traffic Awareness',
    category: 'Safety',
    objective: 'traffic_awareness',
    description: 'Detect a nearby moving vehicle.',

    requiredSensors: [
      'camera',
      'imu',
      'distance',
      'microphone',
    ],

    sensorData: {
      camera: {
        detectedObject: 'car',
        confidence: 0.96,
        distance: 1.8,
      },

      imu: {
        movement: 'walking',
        acceleration: 0.7,
        angularVelocity: 0.05,
      },

      distance: {
        distance: 1.8,
        proximity: 'close',
      },

      microphone: {
        detectedSound: 'vehicle',
        soundLevel: 76,
      },
    },

    expected: {
      risk: 'high',
      suppression: 'keep',
      feedback: 'haptic',
    },
  },

  // ==========================================================
  // 10. INDOOR NAVIGATION
  // ==========================================================

  indoor_navigation: {
    id: 'indoor_navigation',
    name: 'Indoor Navigation',
    category: 'Navigation',
    objective: 'indoor_navigation',
    description: 'Identify corridors and doorways.',

    requiredSensors: ['camera', 'imu', 'distance'],

    sensorData: {
      camera: {
        detectedObject: 'door',
        confidence: 0.93,
        distance: 3.2,
      },

      imu: {
        movement: 'walking',
        acceleration: 0.45,
        angularVelocity: 0.04,
      },

      distance: {
        distance: 3.2,
        proximity: 'moderate',
      },
    },

    expected: {
      risk: 'low',
      suppression: 'keep',
      feedback: 'audio',
    },
  },

  // ==========================================================
  // 11. EMERGENCY ALERT
  // ==========================================================

  emergency: {
    id: 'emergency',
    name: 'Emergency Alert',
    category: 'Safety',
    objective: 'emergency_alert',
    description: 'Simulated urgent environmental hazard.',

    requiredSensors: [
      'camera',
      'microphone',
      'distance',
    ],

    sensorData: {
      camera: {
        detectedObject: 'hazard',
        confidence: 0.99,
        distance: 0.5,
      },

      microphone: {
        detectedSound: 'alarm',
        soundLevel: 88,
      },

      distance: {
        distance: 0.5,
        proximity: 'very_close',
      },
    },

    expected: {
      risk: 'high',
      suppression: 'keep',
      feedback: 'haptic',
    },
  },

  // ==========================================================
  // 12. LOW BATTERY MODE
  // ==========================================================

  low_battery: {
    id: 'low_battery',
    name: 'Low Battery Mode',
    category: 'System',
    objective: 'power_saving',
    description: 'Test resource-saving decisions.',

    requiredSensors: ['imu'],

    sensorData: {
      imu: {
        movement: 'standing',
        acceleration: 0.02,
        angularVelocity: 0.01,
      },
    },

    expected: {
      risk: 'low',
      suppression: 'suppress',
      feedback: 'none',
    },
  },
}

// ============================================================
// GET ALL AVAILABLE SCENARIOS
// ============================================================

export function getAvailableScenarios() {
  return Object.values(SIMULATION_SCENARIOS).map(
    ({
      id,
      name,
      category,
      objective,
      description,
      requiredSensors,
    }) => ({
      id,
      name,
      category,
      objective,
      description,
      requiredSensors: [...requiredSensors],
    })
  )
}

// ============================================================
// GET ONE SCENARIO BY ID
// ============================================================

export function getScenario(scenarioId) {
  if (
    typeof scenarioId !== 'string' ||
    !Object.hasOwn(SIMULATION_SCENARIOS, scenarioId)
  ) {
    return null
  }

  return SIMULATION_SCENARIOS[scenarioId]
}

// ============================================================
// GET SCENARIO SENSOR DATA
// ============================================================

export function getScenarioSensorData(scenarioId) {
  const scenario = getScenario(scenarioId)

  if (!scenario) {
    return null
  }

  // Prevent changes to the original test template.
  return structuredClone(scenario.sensorData)
}

// ============================================================
// GET EXPECTED SCENARIO RESULTS
// ============================================================

export function getScenarioExpectations(scenarioId) {
  const scenario = getScenario(scenarioId)

  return scenario
    ? { ...scenario.expected }
    : null
}
