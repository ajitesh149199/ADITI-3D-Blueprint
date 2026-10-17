
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  generateSensorData,
} from '../simulation/SensorSimulationEngine'

import {
  processSensorData,
} from '../simulation/AIProcessingEngine'

import {
  createAnalyticsState,
  recordProcessingCycle,
  getAnalyticsSummary,
} from '../simulation/SimulationAnalyticsEngine'

import {
  getAvailableScenarios,
  getScenario,
  getScenarioSensorData,
} from '../simulation/ScenarioSimulationEngine'

// ============================================================
// ADITI — CENTRAL SIMULATION CONTEXT
// Phase 10.5.3 + 10.5.4
// Sensors + AI + Analytics + Scenario Execution
// ============================================================

const SimulationContext = createContext(null)

const INITIAL_SENSORS = {
  camera: false,
  imu: false,
  gps: false,
  microphone: false,
  distance: false,
}

export function SimulationProvider({ children }) {

  // ==========================================================
  // 1. SIMULATION STATE
  // ==========================================================

  const [isRunning, setIsRunning] = useState(false)

  const [sensors, setSensors] = useState({
    ...INITIAL_SENSORS,
  })

  const [sensorData, setSensorData] = useState({})

  // ==========================================================
  // 2. AI PROCESSING
  // ==========================================================

  const [aiResults, setAiResults] = useState(null)

  const [processingStage, setProcessingStage] =
    useState('idle')

  const [feedback, setFeedback] = useState('none')

  // ==========================================================
  // 3. BATTERY
  // ==========================================================

  const [batteryLevel, setBatteryLevel] = useState(100)

  // ==========================================================
  // 4. ANALYTICS
  // ==========================================================

  const [analytics, setAnalytics] = useState(
    createAnalyticsState
  )

  const analyticsSummary = useMemo(
    () => getAnalyticsSummary(analytics),
    [analytics]
  )

  // ==========================================================
  // 5. SCENARIO STATE
  // ==========================================================

  const [selectedScenario, setSelectedScenario] =
    useState(null)

  const [scenarioResult, setScenarioResult] =
    useState(null)

  const availableScenarios = useMemo(
    () => getAvailableScenarios(),
    []
  )

  // ==========================================================
  // 6. START SIMULATION
  // ==========================================================

  const startSimulation = useCallback(() => {

    // Start normal live simulation mode.
    setScenarioResult(null)
    setSelectedScenario(null)

    setSensorData({})
    setAiResults(null)

    setIsRunning(true)

  }, [])

  // ==========================================================
  // 7. PAUSE SIMULATION
  // ==========================================================

  const pauseSimulation = useCallback(() => {

    setIsRunning(false)

    // Preserve a completed one-shot scenario result.
    setScenarioResult((previous) => previous)

    setSensorData({})
    setAiResults(null)

    setProcessingStage('idle')
    setFeedback('none')

  }, [])

  // ==========================================================
  // 8. RESET SIMULATION
  // ==========================================================

  const resetSimulation = useCallback(() => {

    setIsRunning(false)

    setSensors({
      ...INITIAL_SENSORS,
    })

    setSensorData({})
    setAiResults(null)

    setProcessingStage('idle')
    setFeedback('none')

    setBatteryLevel(100)

    // Reset analytics.
    setAnalytics(createAnalyticsState())

    // Reset scenario selection and results.
    setSelectedScenario(null)
    setScenarioResult(null)

  }, [])

  // ==========================================================
  // 9. TOGGLE SENSOR
  // ==========================================================

  const toggleSensor = useCallback((sensorName) => {

    if (!(sensorName in INITIAL_SENSORS)) {
      return
    }

    setSensors((previous) => ({
      ...previous,
      [sensorName]: !previous[sensorName],
    }))

  }, [])

  // ==========================================================
  // 10. SELECT SCENARIO
  // ==========================================================

  const selectScenario = useCallback((scenarioId) => {

    if (
      scenarioId !== null &&
      !getScenario(scenarioId)
    ) {
      return
    }

    // Stop live sensor simulation.
    setIsRunning(false)

    // Clear previous readings and decisions.
    setSensorData({})
    setAiResults(null)

    setProcessingStage('idle')
    setFeedback('none')

    setScenarioResult(null)

    // Save selection.
    setSelectedScenario(scenarioId)

    if (scenarioId === null) {
      setSensors({ ...INITIAL_SENSORS })
      return
    }

    const scenario = getScenario(scenarioId)

    const required = scenario.requiredSensors

    // Automatically enable required sensors.
    setSensors({
      camera: required.includes('camera'),
      imu: required.includes('imu'),
      gps: required.includes('gps'),
      microphone: required.includes('microphone'),
      distance: required.includes('distance'),
    })

  }, [])

  // ==========================================================
  // 11. EXECUTE SELECTED SCENARIO
  // ==========================================================

  const runScenario = useCallback(() => {

    const scenario = getScenario(selectedScenario)

    if (!scenario) {
      return
    }

    // Stop the automatic sensor simulation.
    setIsRunning(false)

    // Retrieve predefined sensor readings.
    const readings = getScenarioSensorData(
      selectedScenario
    )

    if (!readings) {
      return
    }

    // Execute the current AI processing engine.
    const results = processSensorData(readings)

    // Display scenario readings.
    setSensorData(readings)

    // Display AI decision.
    setAiResults(results)

    setProcessingStage('output')
    setFeedback(results.feedback)

    // Record exactly one scenario processing cycle.
    setAnalytics((previous) =>
      recordProcessingCycle(previous, results)
    )

    // Store the completed scenario.
    setScenarioResult({
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      objective: scenario.objective,
      expected: { ...scenario.expected },
      results,
      timestamp: results.timestamp,
    })

  }, [selectedScenario])

  // ==========================================================
  // 12. AUTOMATIC SENSOR + AI + ANALYTICS PROCESSING
  // ==========================================================

  const updateSensorData = useCallback(() => {

    if (!isRunning) {
      return
    }

    // Generate synthetic sensor readings.
    const newData = generateSensorData(sensors)

    setSensorData(newData)

    // No active sensors: no processing cycle.
    if (
      !newData ||
      Object.keys(newData).length === 0
    ) {
      setAiResults(null)
      setProcessingStage('idle')
      setFeedback('none')
      return
    }

    // Process simulated readings.
    const results = processSensorData(newData)

    setAiResults(results)

    // Record analytics.
    setAnalytics((previous) =>
      recordProcessingCycle(previous, results)
    )

    // Update dashboard indicators.
    setProcessingStage('output')
    setFeedback(results.feedback)

  }, [isRunning, sensors])

  // ==========================================================
  // 13. AUTOMATIC UPDATE LOOP
  // ==========================================================

  useEffect(() => {

    if (!isRunning) {
      return
    }

    // Generate first cycle immediately.
    updateSensorData()

    // Continue once per second.
    const intervalId = setInterval(() => {
      updateSensorData()
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }

  }, [isRunning, updateSensorData])

  // ==========================================================
  // 14. CENTRAL CONTEXT VALUE
  // ==========================================================

  const value = useMemo(
    () => ({

      // Simulation
      isRunning,

      // Sensors
      sensors,
      sensorData,

      // AI processing
      aiResults,
      processingStage,

      // Feedback
      feedback,

      // Battery
      batteryLevel,

      // Analytics
      analytics,
      analyticsSummary,

      // Scenarios
      selectedScenario,
      availableScenarios,
      scenarioResult,

      // Simulation controls
      startSimulation,
      pauseSimulation,
      resetSimulation,

      // Sensor controls
      toggleSensor,
      updateSensorData,

      // Scenario controls
      selectScenario,
      runScenario,

      // State setters
      setProcessingStage,
      setFeedback,
      setBatteryLevel,

    }),
    [
      isRunning,
      sensors,
      sensorData,
      aiResults,
      processingStage,
      feedback,
      batteryLevel,
      analytics,
      analyticsSummary,
      selectedScenario,
      availableScenarios,
      scenarioResult,
      startSimulation,
      pauseSimulation,
      resetSimulation,
      toggleSensor,
      updateSensorData,
      selectScenario,
      runScenario,
    ]
  )

  // ==========================================================
  // 15. PROVIDER
  // ==========================================================

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  )
}

// ============================================================
// 16. CUSTOM HOOK
// ============================================================

export function useSimulation() {

  const context = useContext(SimulationContext)

  if (!context) {
    throw new Error(
      'useSimulation must be used inside SimulationProvider'
    )
  }

  return context
}
