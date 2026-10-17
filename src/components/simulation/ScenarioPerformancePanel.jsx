
import { useState } from 'react'
import {
  measureAllScenarioPerformance,
} from '../../simulation/ScenarioPerformanceEngine'
import './ScenarioPerformancePanel.css'

export default function ScenarioPerformancePanel() {
  const [report, setReport] = useState(null)
  const [iterations, setIterations] = useState(100)
  const [sortBy, setSortBy] = useState('time')

  const handleMeasure = () => {
    const result = measureAllScenarioPerformance(iterations)
    setReport(result)
  }

  const results = report
    ? [...report.results]
        .filter((result) => !result.error)
        .sort((a, b) => {
          if (sortBy === 'relevance') {
            return b.relevanceScore - a.relevanceScore
          }

          if (sortBy === 'risk') {
            return b.riskScore - a.riskScore
          }

          return b.averageTimeMs - a.averageTimeMs
        })
    : []

  const maximumTime = Math.max(
    ...results.map((result) => result.averageTimeMs),
    0
  )

  return (
    <section className="aditi-performance-panel">
      <div className="aditi-performance-header">
        <div>
          <span className="aditi-performance-eyebrow">
            PERFORMANCE ANALYTICS
          </span>

          <h2>Scenario Performance</h2>

          <p>
            Compare simulated decision processing across
            all 12 scenarios.
          </p>
        </div>

        <div className="aditi-performance-controls">
          <label>
            Iterations
            <select
              value={iterations}
              onChange={(event) =>
                setIterations(Number(event.target.value))
              }
            >
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
          </label>

          <button
            type="button"
            onClick={handleMeasure}
          >
            Measure All Scenarios
          </button>
        </div>
      </div>

      {!report ? (
        <div className="aditi-performance-empty">
          No performance measurements yet.
          Click Measure All Scenarios to begin.
        </div>
      ) : (
        <>
          <div className="aditi-performance-stats">
            <div className="aditi-performance-stat">
              <span>Measured Scenarios</span>
              <strong>{report.measuredScenarios}</strong>
            </div>

            <div className="aditi-performance-stat">
              <span>Avg. Processing</span>
              <strong>
                {report.averageProcessingTimeMs.toFixed(4)}
                <small> ms</small>
              </strong>
            </div>

            <div className="aditi-performance-stat">
              <span>Suppression Rate</span>
              <strong>{report.suppressionRate}%</strong>
            </div>

            <div className="aditi-performance-stat">
              <span>Iterations / Scenario</span>
              <strong>{report.iterationsPerScenario}</strong>
            </div>
          </div>

          <div className="aditi-performance-chart-heading">
            <h3>Processing Time Comparison</h3>

            <label>
              Sort by
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
              >
                <option value="time">Processing Time</option>
                <option value="relevance">Relevance</option>
                <option value="risk">Risk</option>
              </select>
            </label>
          </div>

          <div className="aditi-performance-chart">
            {results.map((result) => {
              const width =
                maximumTime > 0
                  ? (result.averageTimeMs / maximumTime) * 100
                  : 0

              return (
                <div
                  className="aditi-performance-bar-row"
                  key={result.scenarioId}
                >
                  <span className="aditi-performance-bar-label">
                    {result.scenarioName}
                  </span>

                  <div className="aditi-performance-bar-track">
                    <div
                      className="aditi-performance-bar-fill"
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>

                  <span className="aditi-performance-bar-value">
                    {result.averageTimeMs.toFixed(4)} ms
                  </span>
                </div>
              )
            })}
          </div>

          <div className="aditi-performance-table-wrap">
            <table className="aditi-performance-table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Category</th>
                  <th>Avg. Time</th>
                  <th>P95</th>
                  <th>Relevance</th>
                  <th>Risk</th>
                  <th>Suppression</th>
                  <th>Feedback</th>
                </tr>
              </thead>

              <tbody>
                {results.map((result) => (
                  <tr key={result.scenarioId}>
                    <td>{result.scenarioName}</td>
                    <td>{result.category}</td>
                    <td>
                      {result.averageTimeMs.toFixed(4)} ms
                    </td>
                    <td>
                      {result.p95TimeMs.toFixed(4)} ms
                    </td>
                    <td>{result.relevanceScore.toFixed(2)}</td>
                    <td>
                      {result.riskLevel} (
                      {result.riskScore.toFixed(2)})
                    </td>
                    <td>{result.suppression}</td>
                    <td>{result.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="aditi-performance-note">
            Timings measure JavaScript decision processing
            only. They do not include real hardware, camera
            inference, networking, or audio output.
            Suppression rate does not measure battery savings.
          </p>
        </>
      )}
    </section>
  )
}
