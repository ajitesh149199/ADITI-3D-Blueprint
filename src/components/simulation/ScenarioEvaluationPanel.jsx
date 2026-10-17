
import { useState } from 'react'
import { evaluateAllScenarios } from '../../simulation/ScenarioEvaluationEngine'
import './ScenarioEvaluationPanel.css'

export default function ScenarioEvaluationPanel() {
  const [report, setReport] = useState(null)

  const handleRunAll = () => {
    const results = evaluateAllScenarios()
    setReport(results)
  }

  return (
    <section className="aditi-evaluation-panel">
      <div className="aditi-evaluation-header">
        <div>
          <span className="aditi-evaluation-eyebrow">
            AUTOMATED VALIDATION
          </span>
          <h2>Scenario Evaluation</h2>
          <p>
            Compare AI decisions against predefined
            simulation expectations.
          </p>
        </div>

        <button
          type="button"
          className="aditi-evaluation-run"
          onClick={handleRunAll}
        >
          Run All 12 Scenarios
        </button>
      </div>

      {!report ? (
        <div className="aditi-evaluation-empty">
          No evaluation has been run yet.
          Click the button to test all scenarios.
        </div>
      ) : (
        <>
          <div className="aditi-evaluation-stats">
            <div className="aditi-evaluation-stat">
              <span>Total Tests</span>
              <strong>{report.total}</strong>
            </div>

            <div className="aditi-evaluation-stat">
              <span>Passed</span>
              <strong className="passed">
                {report.passed}
              </strong>
            </div>

            <div className="aditi-evaluation-stat">
              <span>Failed</span>
              <strong className="failed">
                {report.failed}
              </strong>
            </div>

            <div className="aditi-evaluation-stat">
              <span>Pass Rate</span>
              <strong>{report.passRate}%</strong>
            </div>
          </div>

          <div className="aditi-evaluation-results">
            {report.results.map((result) => (
              <div
                key={result.scenarioId}
                className="aditi-evaluation-result"
              >
                <div className="aditi-evaluation-result-header">
                  <div>
                    <h3>
                      {result.scenarioName ??
                        result.scenarioId}
                    </h3>

                    <span>{result.category ?? 'System'}</span>
                  </div>

                  <span
                    className={
                      'aditi-evaluation-status ' +
                      (result.passed ? 'passed' : 'failed')
                    }
                  >
                    {result.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>

                {result.error ? (
                  <p className="aditi-evaluation-error">
                    {result.error}
                  </p>
                ) : (
                  <div className="aditi-evaluation-checks">
                    {Object.entries(result.checks).map(
                      ([name, check]) => (
                        <div
                          key={name}
                          className="aditi-evaluation-check"
                        >
                          <span className="check-name">
                            {name}
                          </span>

                          <span>
                            Expected: {check.expected}
                          </span>

                          <span>
                            Actual: {check.actual}
                          </span>

                          <span
                            className={
                              check.passed
                                ? 'check-pass'
                                : 'check-fail'
                            }
                          >
                            {check.passed ? '✓' : '✕'}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
