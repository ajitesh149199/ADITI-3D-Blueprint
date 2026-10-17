
import { useState } from 'react'

import {
  validateAllResourceScenarios,
} from '../../simulation/ResourceValidationEngine'

import './ResourceValidationPanel.css'

export default function ResourceValidationPanel() {
  const [report, setReport] = useState(null)
  const [selectedScenario, setSelectedScenario] = useState(null)

  const runValidation = () => {
    const result = validateAllResourceScenarios()

    setReport(result)
    setSelectedScenario(result.results[0]?.scenarioId ?? null)
  }

  const selectedResult = report?.results.find(
    (result) => result.scenarioId === selectedScenario
  )

  return (
    <section className="aditi-validation-panel">
      <div className="aditi-validation-header">
        <div>
          <span className="aditi-validation-eyebrow">
            SYSTEM VALIDATION
          </span>

          <h2>Resource Optimization Validation</h2>

          <p>
            Compare baseline and optimized AI decisions
            across multiple simulated sensor conditions.
          </p>
        </div>

        <button
          type="button"
          className="aditi-validation-run"
          onClick={runValidation}
        >
          Run All Validation Tests
        </button>
      </div>

      {!report ? (
        <div className="aditi-validation-empty">
          No validation results yet.
          Click Run All Validation Tests to begin.
        </div>
      ) : (
        <>
          <div className="aditi-validation-stats">
            <div className="aditi-validation-stat">
              <span>Total Tests</span>
              <strong>{report.totalTests}</strong>
            </div>

            <div className="aditi-validation-stat">
              <span>Passed Tests</span>
              <strong className="passed">
                {report.passedTests}
              </strong>
            </div>

            <div className="aditi-validation-stat">
              <span>Failed Tests</span>
              <strong className="failed">
                {report.failedTests}
              </strong>
            </div>

            <div className="aditi-validation-stat">
              <span>Pass Rate</span>
              <strong>{report.passRate}%</strong>
            </div>
          </div>

          <div className="aditi-validation-progress">
            <div
              className="aditi-validation-progress-fill"
              style={{
                width: `${report.passRate}%`,
              }}
            />
          </div>

          <div className="aditi-validation-content">
            <div className="aditi-validation-scenarios">
              <h3>Scenario Results</h3>

              {report.results.map((result) => (
                <button
                  type="button"
                  key={result.scenarioId}
                  className={
                    'aditi-validation-scenario ' +
                    (selectedScenario === result.scenarioId
                      ? 'selected'
                      : '')
                  }
                  onClick={() =>
                    setSelectedScenario(result.scenarioId)
                  }
                >
                  <span>{result.scenarioName}</span>

                  <span
                    className={
                      result.passed
                        ? 'aditi-validation-pass'
                        : 'aditi-validation-fail'
                    }
                  >
                    {result.passed ? 'PASS' : 'FAIL'}
                  </span>
                </button>
              ))}
            </div>

            <div className="aditi-validation-details">
              {selectedResult ? (
                <>
                  <div className="aditi-validation-detail-heading">
                    <div>
                      <h3>{selectedResult.scenarioName}</h3>

                      <p>
                        {selectedResult.category} •{' '}
                        {selectedResult.objective}
                      </p>
                    </div>

                    <strong>
                      {selectedResult.passedTests}/
                      {selectedResult.totalTests}
                    </strong>
                  </div>

                  {selectedResult.error && (
                    <div className="aditi-validation-error">
                      {selectedResult.error}
                    </div>
                  )}

                  <div className="aditi-validation-tests">
                    {selectedResult.tests.map((test, index) => (
                      <div
                        className="aditi-validation-test"
                        key={`${test.testName}-${index}`}
                      >
                        <div className="aditi-validation-test-heading">
                          <strong>{test.testName}</strong>

                          <span
                            className={
                              test.passed
                                ? 'aditi-validation-pass'
                                : 'aditi-validation-fail'
                            }
                          >
                            {test.passed ? 'PASS' : 'FAIL'}
                          </span>
                        </div>

                        {test.removedSensor && (
                          <p>
                            Removed sensor:{' '}
                            <strong>{test.removedSensor}</strong>
                          </p>
                        )}

                        <p>
                          Active sensors:{' '}
                          {test.activeSensors?.join(', ') || 'None'}
                        </p>

                        <p>
                          Skipped sensors:{' '}
                          {test.skippedSensors?.join(', ') || 'None'}
                        </p>

                        {test.error && (
                          <p className="aditi-validation-error">
                            Error: {test.error}
                          </p>
                        )}

                        {!test.passed && test.baselineDecision && (
                          <div className="aditi-validation-mismatch">
                            <p>
                              Baseline:{' '}
                              {JSON.stringify(
                                test.baselineDecision
                              )}
                            </p>

                            <p>
                              Optimized:{' '}
                              {JSON.stringify(
                                test.optimizedDecision
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>Select a scenario to inspect its tests.</p>
              )}
            </div>
          </div>

          <p className="aditi-validation-note">
            These tests verify agreement between baseline
            and optimized simulated decisions. A passing
            result does not establish real-world accuracy,
            reliability, or safety.
          </p>
        </>
      )}
    </section>
  )
}
