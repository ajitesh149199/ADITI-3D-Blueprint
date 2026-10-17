
import { useState } from 'react'

import {
  compareAllScenarioResources,
} from '../../simulation/ResourceComparisonEngine'

import './ResourceOptimizationPanel.css'

export default function ResourceOptimizationPanel() {
  const [report, setReport] = useState(null)
  const [selectedScenario, setSelectedScenario] = useState('')

  const handleCompare = () => {
    const result = compareAllScenarioResources()

    setReport(result)
    setSelectedScenario(
      result.results.find((item) => !item.error)?.scenarioId ?? ''
    )
  }

  const selectedResult = report?.results.find(
    (item) => item.scenarioId === selectedScenario
  )

  const reduction = report?.overallWorkloadReduction ?? 0

  return (
    <section className="aditi-resource-panel">
      <div className="aditi-resource-header">
        <div>
          <span className="aditi-resource-eyebrow">
            RESOURCE MANAGEMENT
          </span>

          <h2>Resource Optimization</h2>

          <p>
            Compare baseline and objective-filtered
            simulated sensor workloads.
          </p>
        </div>

        <button
          type="button"
          className="aditi-resource-run"
          onClick={handleCompare}
        >
          Compare All Scenarios
        </button>
      </div>

      {!report ? (
        <div className="aditi-resource-empty">
          No resource comparison has been run yet.
          Click Compare All Scenarios to begin.
        </div>
      ) : (
        <>
          <div className="aditi-resource-stats">
            <div className="aditi-resource-stat">
              <span>Baseline Workload</span>
              <strong>{report.totalBaselineCost}</strong>
              <small>weighted units</small>
            </div>

            <div className="aditi-resource-stat">
              <span>Optimized Workload</span>
              <strong>{report.totalOptimizedCost}</strong>
              <small>weighted units</small>
            </div>

            <div className="aditi-resource-stat">
              <span>Workload Reduction</span>
              <strong>{reduction}%</strong>
              <small>estimated from sensor weights</small>
            </div>

            <div className="aditi-resource-stat">
              <span>Decisions Preserved</span>
              <strong>
                {report.decisionsPreserved}/
                {report.evaluatedScenarios}
              </strong>
              <small>matching simulated outputs</small>
            </div>
          </div>

          <div className="aditi-resource-chart-section">
            <div className="aditi-resource-section-heading">
              <h3>Scenario Workload Comparison</h3>

              <span>
                {report.totalSkippedSensors} sensor inputs skipped
              </span>
            </div>

            <div className="aditi-resource-comparison-list">
              {report.results.map((result) => {
                if (result.error) {
                  return (
                    <p key={result.scenarioId}>
                      {result.scenarioId}: {result.error}
                    </p>
                  )
                }

                const width =
                  result.baselineCost > 0
                    ? (result.optimizedCost / result.baselineCost) * 100
                    : 0

                return (
                  <button
                    type="button"
                    key={result.scenarioId}
                    className={
                      'aditi-resource-comparison-row ' +
                      (selectedScenario === result.scenarioId
                        ? 'selected'
                        : '')
                    }
                    onClick={() =>
                      setSelectedScenario(result.scenarioId)
                    }
                  >
                    <span className="aditi-resource-row-name">
                      {result.scenarioName}
                    </span>

                    <span className="aditi-resource-bars">
                      <span className="aditi-resource-baseline-bar">
                        <span />
                      </span>

                      <span className="aditi-resource-optimized-bar">
                        <span style={{ width: `${width}%` }} />
                      </span>
                    </span>

                    <span className="aditi-resource-row-reduction">
                      {result.workloadReduction}%
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="aditi-resource-legend">
              <span>
                <i className="baseline" />
                Baseline
              </span>

              <span>
                <i className="optimized" />
                Optimized
              </span>
            </div>
          </div>

          {selectedResult && !selectedResult.error && (
            <div className="aditi-resource-details">
              <div className="aditi-resource-section-heading">
                <h3>{selectedResult.scenarioName}</h3>

                <span>{selectedResult.category}</span>
              </div>

              <div className="aditi-resource-detail-grid">
                <div>
                  <span>Baseline Cost</span>
                  <strong>{selectedResult.baselineCost}</strong>
                </div>

                <div>
                  <span>Optimized Cost</span>
                  <strong>{selectedResult.optimizedCost}</strong>
                </div>

                <div>
                  <span>Saved Cost</span>
                  <strong>{selectedResult.savedCost}</strong>
                </div>

                <div>
                  <span>Reduction</span>
                  <strong>
                    {selectedResult.workloadReduction}%
                  </strong>
                </div>
              </div>

              <div className="aditi-resource-sensor-groups">
                <div>
                  <h4>Active Sensors</h4>

                  <div className="aditi-resource-chips">
                    {selectedResult.activeSensors.map((sensor) => (
                      <span
                        key={sensor}
                        className="aditi-resource-chip active"
                      >
                        {sensor}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4>Skipped Sensors</h4>

                  <div className="aditi-resource-chips">
                    {selectedResult.skippedSensors.length === 0 ? (
                      <span className="aditi-resource-muted">
                        None
                      </span>
                    ) : (
                      selectedResult.skippedSensors.map((sensor) => (
                        <span
                          key={sensor}
                          className="aditi-resource-chip skipped"
                        >
                          {sensor}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="aditi-resource-decision">
                <span>AI Decisions Preserved</span>

                <strong
                  className={
                    selectedResult.decisionsPreserved
                      ? 'preserved'
                      : 'changed'
                  }
                >
                  {selectedResult.decisionsPreserved
                    ? 'YES'
                    : 'NO'}
                </strong>
              </div>

              {!selectedResult.decisionsPreserved && (
                <div className="aditi-resource-warning">
                  <strong>Decision mismatch detected.</strong>

                  <p>
                    Baseline: {JSON.stringify(
                      selectedResult.baselineDecision
                    )}
                  </p>

                  <p>
                    Optimized: {JSON.stringify(
                      selectedResult.optimizedDecision
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="aditi-resource-note">
            Workload values are illustrative weighted sensor-input
            costs. They do not represent measured CPU usage,
            energy consumption, battery life, or real-world
            assistive safety performance.
          </p>
        </>
      )}
    </section>
  )
}
