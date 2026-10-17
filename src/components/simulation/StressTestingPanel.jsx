
import { useState } from 'react'

import {
  STRESS_TEST_LEVELS,
  stressTestAllScenarios,
} from '../../simulation/StressTestingEngine'

import './StressTestingPanel.css'

export default function StressTestingPanel() {
  const [level, setLevel] = useState('light')
  const [report, setReport] = useState(null)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [running, setRunning] = useState(false)

  const runTest = () => {
    setRunning(true)

    // Allow the browser to paint the loading state
    // before beginning synchronous processing.
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          const iterations = STRESS_TEST_LEVELS[level].iterations
          const result = stressTestAllScenarios(iterations)

          setReport(result)
          setSelectedScenario(
            result.results.find((item) => !item.error)
              ?.scenarioId ?? null
          )
        } catch (error) {
          console.error('ADITI stress test failed:', error)
          setReport(null)
        } finally {
          setRunning(false)
        }
      }, 0)
    })
  }

  const selectedResult = report?.results.find(
    (item) => item.scenarioId === selectedScenario
  )

  const successRate = report?.totalCycles
    ? (
        (report.successfulCycles / report.totalCycles) *
        100
      ).toFixed(1)
    : '0.0'

  return (
    <section className="aditi-stress-panel">
      <div className="aditi-stress-header">
        <div>
          <span className="aditi-stress-eyebrow">
            PERFORMANCE TESTING
          </span>

          <h2>AI Stress Testing</h2>

          <p>
            Measure simulated decision processing under
            repeated workloads.
          </p>
        </div>

        <div className="aditi-stress-controls">
          <label>
            Workload
            <select
              value={level}
              disabled={running}
              onChange={(event) =>
                setLevel(event.target.value)
              }
            >
              <option value="light">
                Light — 100 cycles
              </option>

              <option value="medium">
                Medium — 500 cycles
              </option>

              <option value="heavy">
                Heavy — 2000 cycles
              </option>
            </select>
          </label>

          <button
            type="button"
            onClick={runTest}
            disabled={running}
          >
            {running
              ? 'Running Tests...'
              : 'Run Stress Test'}
          </button>
        </div>
      </div>

      {!report ? (
        <div className="aditi-stress-empty">
          {running
            ? 'Executing simulated AI processing cycles...'
            : 'No stress test results yet. Select a workload and run the test.'}
        </div>
      ) : (
        <>
          <div className="aditi-stress-stats">
            <div className="aditi-stress-stat">
              <span>Total Cycles</span>
              <strong>
                {report.totalCycles.toLocaleString()}
              </strong>
            </div>

            <div className="aditi-stress-stat">
              <span>Successful Cycles</span>
              <strong className="success">
                {report.successfulCycles.toLocaleString()}
              </strong>
            </div>

            <div className="aditi-stress-stat">
              <span>Failed Cycles</span>
              <strong className="failure">
                {report.failedCycles.toLocaleString()}
              </strong>
            </div>

            <div className="aditi-stress-stat">
              <span>Decision Changes</span>
              <strong>
                {report.unstableDecisions.toLocaleString()}
              </strong>
            </div>

            <div className="aditi-stress-stat">
              <span>Throughput</span>
              <strong>
                {report.averageThroughputPerSecond.toLocaleString()}
              </strong>
              <small>cycles / second</small>
            </div>

            <div className="aditi-stress-stat">
              <span>Stable Scenarios</span>
              <strong>
                {report.stableScenarios}/
                {report.testedScenarios}
              </strong>
            </div>
          </div>

          <div className="aditi-stress-progress-section">
            <div className="aditi-stress-progress-label">
              <span>Successful Execution Rate</span>
              <strong>{successRate}%</strong>
            </div>

            <div className="aditi-stress-progress">
              <div
                className="aditi-stress-progress-fill"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>

          <div className="aditi-stress-content">
            <div className="aditi-stress-scenarios">
              <h3>Scenario Results</h3>

              {report.results.map((result) => (
                <button
                  type="button"
                  key={result.scenarioId}
                  className={
                    'aditi-stress-scenario ' +
                    (selectedScenario === result.scenarioId
                      ? 'selected'
                      : '')
                  }
                  onClick={() =>
                    setSelectedScenario(result.scenarioId)
                  }
                >
                  <span>{result.scenarioName ?? result.scenarioId}</span>

                  <span
                    className={
                      result.decisionStable
                        ? 'aditi-stress-pass'
                        : 'aditi-stress-fail'
                    }
                  >
                    {result.decisionStable ? 'STABLE' : 'CHECK'}
                  </span>
                </button>
              ))}
            </div>

            <div className="aditi-stress-details">
              {selectedResult ? (
                <>
                  <div className="aditi-stress-detail-heading">
                    <div>
                      <h3>{selectedResult.scenarioName}</h3>
                      <p>{selectedResult.objective}</p>
                    </div>

                    <strong>
                      {selectedResult.successfulCycles}/
                      {selectedResult.requestedCycles}
                    </strong>
                  </div>

                  <div className="aditi-stress-metrics">
                    <div>
                      <span>Average Time</span>
                      <strong>
                        {selectedResult.averageTimeMs?.toFixed(4) ?? '—'}
                        {' '}ms
                      </strong>
                    </div>

                    <div>
                      <span>P95 Latency</span>
                      <strong>
                        {selectedResult.p95TimeMs?.toFixed(4) ?? '—'}
                        {' '}ms
                      </strong>
                    </div>

                    <div>
                      <span>Maximum Time</span>
                      <strong>
                        {selectedResult.maximumTimeMs?.toFixed(4) ?? '—'}
                        {' '}ms
                      </strong>
                    </div>

                    <div>
                      <span>Throughput</span>
                      <strong>
                        {selectedResult.throughputPerSecond?.toLocaleString() ?? '—'}
                      </strong>
                    </div>
                  </div>

                  <div className="aditi-stress-decision">
                    <h4>Reference Decision</h4>

                    {selectedResult.referenceDecision ? (
                      <div className="aditi-stress-decision-grid">
                        <p>
                          Risk: <strong>
                            {selectedResult.referenceDecision.risk}
                          </strong>
                        </p>

                        <p>
                          Suppression: <strong>
                            {selectedResult.referenceDecision.suppression}
                          </strong>
                        </p>

                        <p>
                          Feedback: <strong>
                            {selectedResult.referenceDecision.feedback}
                          </strong>
                        </p>
                      </div>
                    ) : (
                      <p>No successful reference decision.</p>
                    )}
                  </div>

                  {selectedResult.firstError && (
                    <p className="aditi-stress-error">
                      Error: {selectedResult.firstError}
                    </p>
                  )}
                </>
              ) : (
                <p>Select a scenario to view its metrics.</p>
              )}
            </div>
          </div>

          <p className="aditi-stress-note">
            Stress tests execute repeated JavaScript decision
            calculations in the browser. They do not measure
            physical hardware, camera inference, battery
            consumption, or real-time safety performance.
            Identical input cycles test consistency rather
            than changing environmental conditions.
          </p>
        </>
      )}
    </section>
  )
}
