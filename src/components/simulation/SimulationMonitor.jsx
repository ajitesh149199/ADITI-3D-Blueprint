import { useSimulation } from '../../state/SimulationContext'
import LiveSensorReadings from './LiveSensorReadings'
import './SimulationMonitor.css'
import AIDecisionMonitor from './AIDecisionMonitor'
import SimulationAnalytics from './SimulationAnalytics'
import SimulationAnalyticsCharts from './SimulationAnalyticsCharts'
import ScenarioControl from './ScenarioControl'
import ScenarioEvaluationPanel from './ScenarioEvaluationPanel'
import ScenarioPerformancePanel from './ScenarioPerformancePanel'
import ResourceOptimizationPanel from './ResourceOptimizationPanel'
import ResourceValidationPanel from './ResourceValidationPanel'
import StressTestingPanel from './StressTestingPanel'
import SensorFailurePanel from './SensorFailurePanel'
import FailureRecoveryPanel from './FailureRecoveryPanel'
import AIDecisionReliabilityPanel from './AIDecisionReliabilityPanel'
import ResourceEfficiencyPanel from './ResourceEfficiencyPanel'
import RealTimeSimulationPanel from './RealTimeSimulationPanel'
import RealTimeValidationPanel from './RealTimeValidationPanel'
import DynamicSensorVerificationPanel from './DynamicSensorVerificationPanel'

const SENSOR_LABELS = {
  camera: 'CAMERA',
  imu: 'IMU',
  gps: 'GPS',
  microphone: 'MICROPHONE',
  distance: 'DISTANCE',
}

const PROCESSING_STAGES = [
  { value: 'idle', label: 'Idle' },
  { value: 'fusion', label: 'Sensor Fusion' },
  { value: 'relevance', label: 'Relevance Analysis' },
  { value: 'risk', label: 'Risk Assessment' },
  { value: 'suppression', label: 'Suppression Engine' },
  { value: 'output', label: 'Output Selection' },
]

const FEEDBACK_OPTIONS = [
  { value: 'none', label: 'No Feedback' },
  { value: 'audio', label: 'Audio' },
  { value: 'haptic', label: 'Haptic' },
  { value: 'visual', label: 'Visual' },
]

export default function SimulationMonitor() {
  const {
    isRunning,
    sensors,
    processingStage,
    feedback,
    batteryLevel,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    toggleSensor,
    setProcessingStage,
    setFeedback,
    setBatteryLevel,
  } = useSimulation()

  const activeSensors = Object.values(sensors).filter(Boolean).length
  const totalSensors = Object.keys(sensors).length

  const stageLabel =
    PROCESSING_STAGES.find(
      (stage) => stage.value === processingStage
    )?.label ?? 'Unknown'

  const feedbackLabel =
    FEEDBACK_OPTIONS.find(
      (option) => option.value === feedback
    )?.label ?? 'Unknown'

  return (
    <div className="aditi-sim">
      <header className="aditi-sim-header">
        <div>
          <div className="aditi-sim-eyebrow">
            ADITI / ENGINEERING SYSTEM
          </div>
          <h1>Simulation Control Center</h1>
          <p>
            Centralized sensor activity, AI processing, feedback
            and simulated battery management.
          </p>
        </div>

        <span className="aditi-sim-mode">
          SOFTWARE SIMULATION
        </span>
      </header>

      <div className="aditi-sim-stats">
        <div className="aditi-sim-stat">
          <span>SYSTEM STATUS</span>
          <strong
            className={
              isRunning ? 'sim-success' : 'sim-warning'
            }
          >
            <i className="sim-status-dot" />
            {isRunning ? 'RUNNING' : 'STANDBY'}
          </strong>
          <small>
            {isRunning
              ? 'Simulation active'
              : 'Simulation stopped'}
          </small>
        </div>

        <div className="aditi-sim-stat">
          <span>ACTIVE SENSORS</span>
          <strong className="sim-cyan">
            {activeSensors} / {totalSensors}
          </strong>
          <small>Enabled sensor modules</small>
        </div>

        <div className="aditi-sim-stat">
          <span>BATTERY LEVEL</span>
          <strong className="sim-success">
            {batteryLevel}%
          </strong>
          <small>Simulated charge</small>
        </div>
      </div>

      <section className="aditi-sim-panel">
        <div className="aditi-sim-panel-head">
          <div>
            <span className="aditi-sim-panel-index">01 / CONTROL</span>
            <h2>Simulation Controls</h2>
          </div>
          <span className="aditi-sim-panel-caption">
            SYSTEM OPERATIONS
          </span>
        </div>

        <div className="aditi-sim-actions">
          <button
            type="button"
            className="aditi-sim-btn sim-btn-start"
            onClick={startSimulation}
            disabled={isRunning}
          >
            ▶ START
          </button>

          <button
            type="button"
            className="aditi-sim-btn sim-btn-pause"
            onClick={pauseSimulation}
            disabled={!isRunning}
          >
            Ⅱ PAUSE
          </button>

          <button
            type="button"
            className="aditi-sim-btn sim-btn-reset"
            onClick={resetSimulation}
          >
            ↺ RESET
          </button>
        </div>

        <p className="aditi-sim-hint">
          Start enables the simulation state. Automatic sensor
          updates will be connected in the next development step.
        </p>
      </section>

      <div className="aditi-sim-main-grid">
        <section className="aditi-sim-panel">
          <div className="aditi-sim-panel-head">
            <div>
              <span className="aditi-sim-panel-index">
                02 / SENSOR NETWORK
              </span>
              <h2>Sensor Activity</h2>
            </div>
            <span className="aditi-sim-count">
              {activeSensors} ACTIVE
            </span>
          </div>

          <div className="aditi-sim-sensors">
            {Object.entries(sensors).map(
              ([sensorName, enabled]) => (
                <button
                  key={sensorName}
                  type="button"
                  aria-pressed={enabled}
                  className={`aditi-sim-sensor ${
                    enabled ? 'is-active' : ''
                  }`}
                  onClick={() => toggleSensor(sensorName)}
                >
                  <span className="aditi-sim-sensor-name">
                    {SENSOR_LABELS[sensorName] ?? sensorName}
                  </span>

                  <span
                    className={`aditi-sim-sensor-status ${
                      enabled ? 'is-active' : ''
                    }`}
                  >
                    <i />
                    {enabled ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </button>
              )
            )}
          </div>

          <p className="aditi-sim-hint">
            Select a sensor to enable or disable its simulated
            data source.
          </p>
        </section>

        <section className="aditi-sim-panel">
          <div className="aditi-sim-panel-head">
            <div>
              <span className="aditi-sim-panel-index">
                03 / DECISION PIPELINE
              </span>
              <h2>AI Processing</h2>
            </div>
          </div>

          <div className="aditi-sim-field">
            <label htmlFor="aditi-processing-stage">
              PROCESSING STAGE
            </label>

            <select
              id="aditi-processing-stage"
              value={processingStage}
              onChange={(event) =>
                setProcessingStage(event.target.value)
              }
            >
              {PROCESSING_STAGES.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>

          <div className="aditi-sim-field">
            <label htmlFor="aditi-feedback-output">
              FEEDBACK OUTPUT
            </label>

            <select
              id="aditi-feedback-output"
              value={feedback}
              onChange={(event) =>
                setFeedback(event.target.value)
              }
            >
              {FEEDBACK_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="aditi-sim-pipeline-summary">
            <div>
              <span>CURRENT STAGE</span>
              <strong>{stageLabel}</strong>
            </div>
            <div>
              <span>SELECTED OUTPUT</span>
              <strong>{feedbackLabel}</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="aditi-sim-panel">
        <div className="aditi-sim-panel-head">
          <div>
            <span className="aditi-sim-panel-index">
              04 / POWER SYSTEM
            </span>
            <h2>Battery Simulation</h2>
          </div>

          <strong className="aditi-sim-battery-value">
            {batteryLevel}%
          </strong>
        </div>

        <div
          className="aditi-sim-battery-track"
          role="progressbar"
          aria-label="Simulated battery level"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={batteryLevel}
        >
          <div
            className="aditi-sim-battery-fill"
            style={{ width: `${batteryLevel}%` }}
          />
        </div>

        <div className="aditi-sim-battery-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>

        <label
          className="aditi-sim-slider-label"
          htmlFor="aditi-battery-slider"
        >
          MANUAL BATTERY LEVEL
        </label>

        <input
          id="aditi-battery-slider"
          className="aditi-sim-slider"
          type="range"
          min="0"
          max="100"
          value={batteryLevel}
          onChange={(event) =>
            setBatteryLevel(Number(event.target.value))
          }
        />

        <p className="aditi-sim-hint">
          Battery percentage is manually simulated. It is not
          connected to physical hardware or the existing power
          estimator yet.
        </p>
            </section>

      {/* ====================================================
          LIVE SENSOR TELEMETRY
          ==================================================== */}

      <ScenarioControl />

      <ScenarioEvaluationPanel />

      <ScenarioPerformancePanel />

      <ResourceOptimizationPanel />

      <ResourceValidationPanel />

      <StressTestingPanel />

      <SensorFailurePanel />

      <FailureRecoveryPanel />

      <AIDecisionReliabilityPanel />

      <ResourceEfficiencyPanel />

      <RealTimeSimulationPanel />

      <RealTimeValidationPanel />

      <DynamicSensorVerificationPanel />

      {/* LIVE SENSOR READINGS */}
      <LiveSensorReadings />

      {/* AI DECISION MONITOR */}
      <AIDecisionMonitor />

      {/* SIMULATION ANALYTICS */}
      <SimulationAnalytics />

      {/* REAL-TIME ANALYTICS CHARTS */}
      <SimulationAnalyticsCharts />

    </div>
  )
}