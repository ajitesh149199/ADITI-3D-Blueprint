
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
  injectSensorFault,
} from '../../simulation/SensorFailureEngine'

import {
  buildBaselineSensorData,
} from '../../simulation/ResourceComparisonEngine'

import {
  evaluateFailureRecovery,
  validateAllFailureRecoveries,
} from '../../simulation/FailureRecoveryEngine'

import './FailureRecoveryPanel.css'

export default function FailureRecoveryPanel() {
  const scenarios = getAvailableScenarios()

  const [scenarioId, setScenarioId] = useState(
    scenarios[0]?.id ?? ''
  )

  const [sensor, setSensor] = useState(
    'camera'
  )

  const [faultType, setFaultType] = useState(
    'missing'
  )

  const [result, setResult] = useState(null)
  const [batchResult, setBatchResult] = useState(null)
  const [error, setError] = useState('')

  const selectedScenario = scenarios.find(
    (item) => item.id === scenarioId
  )

  const requiredSensors = selectedScenario
    ? selectRequiredSensors(selectedScenario.objective)
    : []

  function changeScenario(nextId) {
    setScenarioId(nextId)

    const nextScenario = scenarios.find(
      (item) => item.id === nextId
    )

    const nextRequired = nextScenario
      ? selectRequiredSensors(nextScenario.objective)
      : []

    setSensor(nextRequired[0] ?? 'camera')
    setResult(null)
    setError('')
  }

  function runSingleRecovery() {
    setError('')

    try {
      const baselineData = buildBaselineSensorData(
        scenarioId
      )

      const healthy = evaluateFailureRecovery(
        scenarioId,
        baselineData
      )

      const faultyData = injectSensorFault(
        baselineData,
        sensor,
        faultType
      )

      const faulty = evaluateFailureRecovery(
        scenarioId,
        faultyData
      )

      if (healthy.error || faulty.error) {
        throw new Error(
          healthy.error ||
          faulty.error
        )
      }

      setResult({
        healthy,
        faulty,
        sensor,
        faultType,
      })
    } catch (err) {
      setResult(null)
      setError(String(err?.message ?? err))
    }
  }

  function runAllRecoveryTests() {
    setError('')

    try {
      const report = validateAllFailureRecoveries()
      setBatchResult(report)
    } catch (err) {
      setBatchResult(null)
      setError(String(err?.message ?? err))
    }
  }

  function statusClass(state) {
    if (state === 'normal') {
      return 'normal'
    }

    if (state === 'degraded') {
      return 'degraded'
    }

    return 'unavailable'
  }

  return (
    <section className="aditi-recovery-panel">
      <div className="aditi-recovery-header">
        <span className="aditi-recovery-eyebrow">
          SENSOR RESILIENCE
        </span>

        <h2>Failure Recovery Validation</h2>

        <p>
          Examine how ADITI's simulated processing
          pipeline handles unavailable sensor data.
        </p>
      </div>

      <div className="aditi-recovery-controls">
        <label>
          Scenario

          <select
            value={scenarioId}
            onChange={(event) =>
              changeScenario(event.target.value)
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
              setResult(null)
            }}
          >
            {SENSOR_TYPES.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item.toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fault Type

          <select
            value={faultType}
            onChange={(event) => {
              setFaultType(event.target.value)
              setResult(null)
            }}
          >
            {Object.entries(SENSOR_FAULT_TYPES).map(
              ([key, config]) => (
                <option
                  key={key}
                  value={key}
                >
                  {config.label}
                </option>
              )
            )}
          </select>
        </label>

        <button
          type="button"
          onClick={runSingleRecovery}
          disabled={!scenarioId}
        >
          Simulate Recovery
        </button>
      </div>

      <div className="aditi-recovery-sensor-list">
        <strong>Required Sensors:</strong>

        <span>
          {requiredSensors.length
            ? requiredSensors.join(', ')
            : 'None'}
        </span>

        <span
          className={
            requiredSensors.includes(sensor)
              ? 'required'
              : 'optional'
          }
        >
          {requiredSensors.includes(sensor)
            ? 'Required sensor selected'
            : 'Optional sensor selected'}
        </span>
      </div>

      {error && (
        <div className="aditi-recovery-error">
          {error}
        </div>
      )}

      {result && (
        <div className="aditi-recovery-results">
          <h3>Recovery Comparison</h3>

          <div className="aditi-recovery-comparison">
            <div className="aditi-recovery-card">
              <h4>Normal Sensor Inputs</h4>

              <span
                className={`aditi-recovery-status ${
                  statusClass(result.healthy.state)
                }`}
              >
                {result.healthy.state.toUpperCase()}
              </span>

              <p>
                Normal Decision Allowed:
                <strong>
                  {result.healthy.normalDecisionAllowed
                    ? 'YES'
                    : 'NO'}
                </strong>
              </p>

              <p>
                Detected Faults:
                <strong>
                  {result.healthy.detectedFaults.length}
                </strong>
              </p>
            </div>

            <div className="aditi-recovery-card">
              <h4>Injected Sensor Fault</h4>

              <span
                className={`aditi-recovery-status ${
                  statusClass(result.faulty.state)
                }`}
              >
                {result.faulty.state.toUpperCase()}
              </span>

              <p>
                Normal Decision Allowed:
                <strong>
                  {result.faulty.normalDecisionAllowed
                    ? 'YES'
                    : 'NO'}
                </strong>
              </p>

              <p>
                Detected Faults:
                <strong>
                  {result.faulty.detectedFaults.length}
                </strong>
              </p>
            </div>
          </div>

          <div className="aditi-recovery-fallback">
            <h4>Recovery Action</h4>

            {result.faulty.fallback ? (
              <>
                <p>
                  <strong>Severity:</strong>
                  {' '}
                  {result.faulty.fallback.severity}
                </p>

                <p>
                  <strong>Output:</strong>
                  {' '}
                  {result.faulty.fallback.recommendedOutput}
                </p>

                <p>
                  <strong>Message:</strong>
                  {' '}
                  {result.faulty.fallback.message}
                </p>
              </>
            ) : (
              <p>
                No fallback required.
                Normal processing remains available.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="aditi-recovery-batch">
        <div className="aditi-recovery-batch-header">
          <div>
            <h3>Automated Recovery Validation</h3>

            <p>
              Evaluate required-sensor faults and
              optional-sensor behavior across scenarios.
            </p>
          </div>

          <button
            type="button"
            onClick={runAllRecoveryTests}
          >
            Run All Recovery Tests
          </button>
        </div>

        {batchResult && (
          <>
            <div className="aditi-recovery-stats">
              <div>
                <span>Total Tests</span>
                <strong>
                  {batchResult.totalTests}
                </strong>
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
                <span>Pass Rate</span>
                <strong>
                  {batchResult.passRate}%
                </strong>
              </div>
            </div>

            <div className="aditi-recovery-state-stats">
              <div>
                <span>Normal</span>
                <strong>
                  {batchResult.normalFallbacks}
                </strong>
              </div>

              <div>
                <span>Degraded</span>
                <strong>
                  {batchResult.degradedFallbacks}
                </strong>
              </div>

              <div>
                <span>Unavailable</span>
                <strong>
                  {batchResult.unavailableFallbacks}
                </strong>
              </div>
            </div>

            <div className="aditi-recovery-table-wrapper">
              <table className="aditi-recovery-table">
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Sensor</th>
                    <th>Fault</th>
                    <th>Expected</th>
                    <th>Actual</th>
                    <th>Result</th>
                  </tr>
                </thead>

                <tbody>
                  {batchResult.results.map(
                    (item, index) => (
                      <tr
                        key={`${item.scenarioId}-${item.sensor}-${item.faultType}-${index}`}
                      >
                        <td>{item.scenarioName ?? item.scenarioId}</td>
                        <td>{item.sensor}</td>
                        <td>{item.faultType}</td>
                        <td>{item.expectedState ?? '—'}</td>
                        <td>{item.recoveryState ?? '—'}</td>
                        <td>
                          <span
                            className={
                              item.passed
                                ? 'aditi-recovery-pass'
                                : 'aditi-recovery-fail'
                            }
                          >
                            {item.passed ? 'PASS' : 'FAIL'}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <p className="aditi-recovery-note">
        Recovery states represent simulated software
        decisions, not verified hardware recovery.
        A passing test does not establish real-world
        safety or reliability.
      </p>
    </section>
  )
}
