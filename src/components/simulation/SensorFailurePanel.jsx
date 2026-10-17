
import { useState } from 'react'

import {
  getAvailableScenarios,
} from '../../simulation/ScenarioSimulationEngine'

import {
  SENSOR_TYPES,
  selectRequiredSensors,
} from '../../simulation/ResourceOptimizationEngine'

import {
  SENSOR_FAULT_TYPES,
  simulateSensorFailure,
  simulateAllSensorFailures,
} from '../../simulation/SensorFailureEngine'

import './SensorFailurePanel.css'

export default function SensorFailurePanel() {
  const scenarios = getAvailableScenarios()

  const [scenarioId, setScenarioId] = useState(
    scenarios[0]?.id ?? ''
  )

  const [sensor, setSensor] = useState('camera')
  const [faultType, setFaultType] = useState('missing')
  const [singleResult, setSingleResult] = useState(null)
  const [batchResult, setBatchResult] = useState(null)
  const [error, setError] = useState('')

  const selectedScenario = scenarios.find(
    (item) => item.id === scenarioId
  )

  const requiredSensors = selectedScenario
    ? selectRequiredSensors(selectedScenario.objective)
    : []

  const selectedSensorIsRequired =
    requiredSensors.includes(sensor)

  function handleScenarioChange(nextId) {
    setScenarioId(nextId)

    const nextScenario = scenarios.find(
      (item) => item.id === nextId
    )

    const nextRequired = nextScenario
      ? selectRequiredSensors(nextScenario.objective)
      : []

    setSensor(nextRequired[0] ?? 'camera')
    setSingleResult(null)
    setError('')
  }

  function handleSingleTest() {
    setError('')

    try {
      const result = simulateSensorFailure(
        scenarioId,
        sensor,
        faultType
      )

      if (result.error) {
        setError(result.error)
      }

      setSingleResult(result)
    } catch (err) {
      setError(String(err?.message ?? err))
    }
  }

  function handleBatchTest() {
    setError('')

    try {
      const result = simulateAllSensorFailures()
      setBatchResult(result)
    } catch (err) {
      setError(String(err?.message ?? err))
    }
  }

  return (
    <section className="aditi-failure-panel">
      <header className="aditi-failure-header">
        <div>
          <span className="aditi-failure-eyebrow">
            FAULT INJECTION & DIAGNOSTICS
          </span>

          <h2>Sensor Failure Simulation</h2>

          <p>
            Test how simulated sensor faults affect
            ADITI's AI processing pipeline.
          </p>
        </div>
      </header>

      <div className="aditi-failure-controls">
        <label>
          Scenario

          <select
            value={scenarioId}
            onChange={(event) =>
              handleScenarioChange(event.target.value)
            }
          >
            {scenarios.map((scenario) => (
              <option
                key={scenario.id}
                value={scenario.id}
              >
                {scenario.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sensor

          <select
            value={sensor}
            onChange={(event) => {
              setSensor(event.target.value)
              setSingleResult(null)
            }}
          >
            {SENSOR_TYPES.map((item) => (
              <option key={item} value={item}>
                {item.toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        <label>
          Failure Type

          <select
            value={faultType}
            onChange={(event) => {
              setFaultType(event.target.value)
              setSingleResult(null)
            }}
          >
            {Object.entries(SENSOR_FAULT_TYPES).map(
              ([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              )
            )}
          </select>
        </label>

        <button
          type="button"
          onClick={handleSingleTest}
          disabled={!scenarioId}
        >
          Inject Sensor Fault
        </button>
      </div>

      <div className="aditi-failure-sensor-info">
        <strong>Required sensors:</strong>
        {' '}
        {requiredSensors.length
          ? requiredSensors.join(', ')
          : 'None configured'}

        <span
          className={
            selectedSensorIsRequired
              ? 'aditi-failure-required'
              : 'aditi-failure-optional'
          }
        >
          {selectedSensorIsRequired
            ? 'Selected sensor is required'
            : 'Selected sensor is not required'}
        </span>
      </div>

      {error && (
        <div className="aditi-failure-error">
          {error}
        </div>
      )}

      {singleResult && !singleResult.error && (
        <div className="aditi-failure-single">
          <div className="aditi-failure-section-title">
            <h3>Single Fault Test</h3>

            <span
              className={
                singleResult.passed
                  ? 'aditi-failure-pass'
                  : 'aditi-failure-fail'
              }
            >
              {singleResult.passed
                ? 'TEST PASSED'
                : 'CHECK REQUIRED'}
            </span>
          </div>

          <div className="aditi-failure-stats">
            <div>
              <span>Sensor</span>
              <strong>
                {singleResult.sensor?.toUpperCase()}
              </strong>
            </div>

            <div>
              <span>Injected Fault</span>
              <strong>{singleResult.faultType}</strong>
            </div>

            <div>
              <span>Fault Detected</span>
              <strong>
                {singleResult.faultDetected
                  ? 'YES'
                  : 'NO'}
              </strong>
            </div>

            <div>
              <span>AI Processing</span>
              <strong>
                {singleResult.processingError
                  ? 'ERROR'
                  : 'COMPLETED'}
              </strong>
            </div>
          </div>

          <div className="aditi-failure-comparison">
            <div>
              <h4>Normal Decision</h4>

              <p>
                Risk:
                <strong>
                  {singleResult.baselineDecision?.risk}
                </strong>
              </p>

              <p>
                Suppression:
                <strong>
                  {singleResult.baselineDecision?.suppression}
                </strong>
              </p>

              <p>
                Feedback:
                <strong>
                  {singleResult.baselineDecision?.feedback}
                </strong>
              </p>
            </div>

            <div>
              <h4>Faulty Decision</h4>

              <p>
                Risk:
                <strong>
                  {singleResult.faultyDecision?.risk ?? 'N/A'}
                </strong>
              </p>

              <p>
                Suppression:
                <strong>
                  {singleResult.faultyDecision?.suppression ?? 'N/A'}
                </strong>
              </p>

              <p>
                Feedback:
                <strong>
                  {singleResult.faultyDecision?.feedback ?? 'N/A'}
                </strong>
              </p>
            </div>
          </div>

          <p className="aditi-failure-observation">
            Decision changed:
            <strong>
              {singleResult.decisionChanged ? ' YES' : ' NO'}
            </strong>
          </p>

          {singleResult.processingError && (
            <p className="aditi-failure-error">
              {singleResult.processingError}
            </p>
          )}
        </div>
      )}

      <div className="aditi-failure-batch">
        <div className="aditi-failure-section-title">
          <div>
            <h3>Automated Sensor Failure Tests</h3>

            <p>
              Test every required sensor against all
              four fault types across 12 scenarios.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBatchTest}
          >
            Run All Failure Tests
          </button>
        </div>

        {batchResult && (
          <>
            <div className="aditi-failure-stats">
              <div>
                <span>Total Tests</span>
                <strong>{batchResult.totalTests}</strong>
              </div>

              <div>
                <span>Passed Tests</span>
                <strong className="success">
                  {batchResult.passedTests}
                </strong>
              </div>

              <div>
                <span>Failed Tests</span>
                <strong className="failure">
                  {batchResult.failedTests}
                </strong>
              </div>

              <div>
                <span>Detection Rate</span>
                <strong>
                  {batchResult.detectionRate}%
                </strong>
              </div>
            </div>

            <div className="aditi-failure-table-wrapper">
              <table className="aditi-failure-table">
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Sensor</th>
                    <th>Fault</th>
                    <th>Detected</th>
                    <th>AI Error</th>
                    <th>Result</th>
                  </tr>
                </thead>

                <tbody>
                  {batchResult.results.map((result, index) => (
                    <tr key={`${result.scenarioId}-${result.sensor}-${result.faultType}-${index}`}>
                      <td>{result.scenarioName ?? result.scenarioId}</td>
                      <td>{result.sensor}</td>
                      <td>{result.faultType}</td>
                      <td>
                        {result.faultDetected ? 'Yes' : 'No'}
                      </td>
                      <td>
                        {result.processingError ? 'Yes' : 'No'}
                      </td>
                      <td>
                        <span
                          className={
                            result.passed
                              ? 'aditi-failure-pass'
                              : 'aditi-failure-fail'
                          }
                        >
                          {result.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <p className="aditi-failure-note">
        These are simulated faults, not physical sensor failures.
        A passing test confirms fault detection and absence of
        processing exceptions; it does not establish safe
        fallback behavior or real-world reliability.
      </p>
    </section>
  )
}
