
import { useState } from 'react'

import {
  getAvailableScenarios,
} from '../../simulation/ScenarioSimulationEngine'

import {
  RELIABILITY_TEST_TYPES,
  testDecisionReliability,
  testAllDecisionReliability,
} from '../../simulation/AIDecisionReliabilityEngine'

import './AIDecisionReliabilityPanel.css'

export default function AIDecisionReliabilityPanel() {
  const scenarios = getAvailableScenarios()
  const testTypes = Object.entries(RELIABILITY_TEST_TYPES)

  const [scenarioId, setScenarioId] = useState(
    scenarios[0]?.id ?? ''
  )

  const [testType, setTestType] = useState('repeatability')
  const [singleResult, setSingleResult] = useState(null)
  const [batchResult, setBatchResult] = useState(null)
  const [error, setError] = useState('')
  const [showOnlyFailures, setShowOnlyFailures] = useState(false)

  function runSingleTest() {
    setError('')

    try {
      const result = testDecisionReliability(
        scenarioId,
        testType
      )

      setSingleResult(result)

      if (result.error) {
        setError(result.error)
      }
    } catch (err) {
      setSingleResult(null)
      setError(String(err?.message ?? err))
    }
  }

  function runBatchTests() {
    setError('')

    try {
      const report = testAllDecisionReliability()
      setBatchResult(report)
    } catch (err) {
      setBatchResult(null)
      setError(String(err?.message ?? err))
    }
  }

  const displayedResults = batchResult
    ? batchResult.results.filter(
        (result) => !showOnlyFailures || !result.passed
      )
    : []

  return (
    <section className="aditi-reliability-panel">
      <header className="aditi-reliability-header">
        <span className="aditi-reliability-eyebrow">
          AI DECISION ANALYSIS
        </span>

        <h2>AI Decision Reliability Testing</h2>

        <p>
          Evaluate simulated decision consistency,
          input sensitivity, and sensor-fault awareness.
        </p>
      </header>

      <div className="aditi-reliability-controls">
        <label>
          Scenario

          <select
            value={scenarioId}
            onChange={(event) => {
              setScenarioId(event.target.value)
              setSingleResult(null)
            }}
          >
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Test Type

          <select
            value={testType}
            onChange={(event) => {
              setTestType(event.target.value)
              setSingleResult(null)
            }}
          >
            {testTypes.map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          disabled={!scenarioId}
          onClick={runSingleTest}
        >
          Run Single Test
        </button>
      </div>

      {error && (
        <div className="aditi-reliability-error">
          {error}
        </div>
      )}

      {singleResult && !singleResult.error && (
        <div className="aditi-reliability-single">
          <div className="aditi-reliability-heading">
            <h3>Individual Test Result</h3>

            <span
              className={
                singleResult.passed
                  ? 'aditi-reliability-pass'
                  : 'aditi-reliability-fail'
              }
            >
              {singleResult.passed
                ? 'PASS'
                : 'REVIEW'}
            </span>
          </div>

          <p className="aditi-reliability-observation">
            {singleResult.observation}
          </p>

          <div className="aditi-reliability-comparison">
            <div>
              <h4>Baseline Decision</h4>

              <p>
                Risk:
                <strong>
                  {singleResult.baselineDecision?.risk ?? 'N/A'}
                </strong>
              </p>

              <p>
                Suppression:
                <strong>
                  {singleResult.baselineDecision?.suppression ?? 'N/A'}
                </strong>
              </p>

              <p>
                Feedback:
                <strong>
                  {singleResult.baselineDecision?.feedback ?? 'N/A'}
                </strong>
              </p>
            </div>

            <div>
              <h4>Test Decision</h4>

              {singleResult.testDecision ? (
                <>
                  <p>
                    Risk:
                    <strong>
                      {singleResult.testDecision.risk}
                    </strong>
                  </p>

                  <p>
                    Suppression:
                    <strong>
                      {singleResult.testDecision.suppression}
                    </strong>
                  </p>

                  <p>
                    Feedback:
                    <strong>
                      {singleResult.testDecision.feedback}
                    </strong>
                  </p>
                </>
              ) : (
                <p>
                  {singleResult.recoveryState
                    ? `Recovery state: ${singleResult.recoveryState}`
                    : 'No comparison decision available'}
                </p>
              )}
            </div>
          </div>

          {singleResult.variation?.modified && (
            <div className="aditi-reliability-variation">
              <h4>Modified Input</h4>

              <p>
                Sensor:
                <strong>
                  {singleResult.variation.sensor}
                </strong>
              </p>

              <p>
                Field:
                <strong>
                  {singleResult.variation.field}
                </strong>
              </p>

              <p>
                Original:
                <strong>
                  {String(singleResult.variation.originalValue)}
                </strong>
              </p>

              <p>
                Modified:
                <strong>
                  {String(singleResult.variation.modifiedValue)}
                </strong>
              </p>
            </div>
          )}
        </div>
      )}

      <div className="aditi-reliability-batch">
        <div className="aditi-reliability-heading">
          <div>
            <h3>Automated Reliability Tests</h3>

            <p>
              Run four test categories across all
              12 predefined scenarios.
            </p>
          </div>

          <button
            type="button"
            onClick={runBatchTests}
          >
            Run All Reliability Tests
          </button>
        </div>

        {batchResult && (
          <>
            <div className="aditi-reliability-stats">
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
                <span>Failed / Review</span>
                <strong className="failure">
                  {batchResult.failedTests}
                </strong>
              </div>

              <div>
                <span>Pass Rate</span>
                <strong>{batchResult.passRate}%</strong>
              </div>

              <div>
                <span>Changed Decisions</span>
                <strong>{batchResult.changedDecisions}</strong>
              </div>

              <div>
                <span>Untested Variations</span>
                <strong>{batchResult.untestedVariations}</strong>
              </div>
            </div>

            <div className="aditi-reliability-filter">
              <label>
                <input
                  type="checkbox"
                  checked={showOnlyFailures}
                  onChange={(event) =>
                    setShowOnlyFailures(event.target.checked)
                  }
                />
                Show only tests requiring review
              </label>

              <span>
                Displaying {displayedResults.length} tests
              </span>
            </div>

            <div className="aditi-reliability-table-wrapper">
              <table className="aditi-reliability-table">
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Test Type</th>
                    <th>Result</th>
                    <th>Observation</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedResults.map((item, index) => (
                    <tr
                      key={`${item.scenarioId}-${item.testType}-${index}`}
                    >
                      <td>
                        {item.scenarioName ?? item.scenarioId}
                      </td>

                      <td>
                        {RELIABILITY_TEST_TYPES[item.testType]?.label
                          ?? item.testType}
                      </td>

                      <td>
                        <span
                          className={
                            item.passed
                              ? 'aditi-reliability-pass'
                              : 'aditi-reliability-fail'
                          }
                        >
                          {item.passed ? 'PASS' : 'REVIEW'}
                        </span>
                      </td>

                      <td>
                        {item.error ??
                          item.observation ??
                          'No observation'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <p className="aditi-reliability-note">
        These tests examine simulated software behavior.
        They do not establish physical sensor accuracy,
        real-world safety, or independent decision correctness.
        A decision change after input variation may be
        legitimate and should be reviewed in context.
      </p>
    </section>
  )
}
