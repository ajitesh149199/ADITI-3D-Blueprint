
import { useState } from 'react'

import {
  getAvailableScenarios,
} from '../../simulation/ScenarioSimulationEngine'

import {
  validateRealTimeControls,
} from '../../simulation/RealTimeValidationEngine'

import './RealTimeValidationPanel.css'

export default function RealTimeValidationPanel() {
  const scenarios = getAvailableScenarios()

  const [scenarioId, setScenarioId] = useState(
    scenarios[0]?.id ?? ''
  )

  const [report, setReport] = useState(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')

  async function runValidation() {
    if (running || !scenarioId) return

    setRunning(true)
    setError('')
    setReport(null)

    try {
      const result = await validateRealTimeControls(
        scenarioId
      )

      setReport(result)

      if (result.error) {
        setError(result.error)
      }
    } catch (err) {
      setError(String(err?.message ?? err))
    } finally {
      setRunning(false)
    }
  }

  return (
    <section className="aditi-control-validation">
      <header className="aditi-control-validation-header">
        <div>
          <span className="aditi-control-validation-eyebrow">
            AUTOMATED VALIDATION
          </span>

          <h2>Real-Time Control Validation</h2>

          <p>
            Verify simulation state transitions,
            automatic ticks, history, and timer cleanup.
          </p>
        </div>
      </header>

      <div className="aditi-control-validation-controls">
        <label>
          Test Scenario

          <select
            value={scenarioId}
            disabled={running}
            onChange={(event) => {
              setScenarioId(event.target.value)
              setReport(null)
              setError('')
            }}
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

        <button
          type="button"
          disabled={running || !scenarioId}
          onClick={runValidation}
        >
          {running
            ? 'Running Validation...'
            : 'Run Control Validation'}
        </button>
      </div>

      {error && (
        <div className="aditi-control-validation-error">
          {error}
        </div>
      )}

      {report && (
        <>
          <div className="aditi-control-validation-stats">
            <div>
              <span>Total Tests</span>
              <strong>{report.totalTests}</strong>
            </div>

            <div>
              <span>Passed Tests</span>
              <strong className="success">
                {report.passedTests}
              </strong>
            </div>

            <div>
              <span>Failed Tests</span>
              <strong className="failure">
                {report.failedTests}
              </strong>
            </div>

            <div>
              <span>Pass Rate</span>
              <strong>{report.passRate}%</strong>
            </div>
          </div>

          <div className="aditi-control-validation-results">
            <h3>Detailed Validation Results</h3>

            <div className="aditi-control-validation-table-wrap">
              <table className="aditi-control-validation-table">
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>

                <tbody>
                  {report.results.map((item, index) => (
                    <tr key={`${item.name}-${index}`}>
                      <td>{item.name}</td>

                      <td>
                        <span
                          className={
                            item.passed
                              ? 'aditi-control-test-pass'
                              : 'aditi-control-test-fail'
                          }
                        >
                          {item.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </td>

                      <td>{item.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <p className="aditi-control-validation-note">
        These tests verify the simulated controller
        under browser timer scheduling. They do not
        measure physical sensor response times.
      </p>
    </section>
  )
}
