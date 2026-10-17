
import { useState } from 'react'

import {
  analyzeAllResourceEfficiency,
} from '../../simulation/ResourceEfficiencyAnalyticsEngine'

import './ResourceEfficiencyPanel.css'

export default function ResourceEfficiencyPanel() {
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [selectedScenario, setSelectedScenario] = useState('')

  function runAnalysis() {
    setError('')

    try {
      const result = analyzeAllResourceEfficiency()

      setReport(result)

      setSelectedScenario(
        result.results.find((item) => !item.error)
          ?.scenarioId ?? ''
      )
    } catch (err) {
      setReport(null)
      setError(String(err?.message ?? err))
    }
  }

  const selectedResult = report?.results.find(
    (item) => item.scenarioId === selectedScenario
  )

  const maximumCost = Math.max(
    report?.totalBaselineCost ?? 0,
    report?.totalOptimizedCost ?? 0,
    1
  )

  return (
    <section className="aditi-efficiency-panel">
      <header className="aditi-efficiency-header">
        <div>
          <span className="aditi-efficiency-eyebrow">
            RESOURCE ANALYTICS
          </span>

          <h2>Resource Efficiency Analytics</h2>

          <p>
            Compare baseline and optimized sensor
            workloads across ADITI scenarios.
          </p>
        </div>

        <button
          type="button"
          onClick={runAnalysis}
        >
          Run Efficiency Analysis
        </button>
      </header>

      {error && (
        <div className="aditi-efficiency-error">
          {error}
        </div>
      )}

      {!report ? (
        <div className="aditi-efficiency-empty">
          No efficiency report yet. Click
          "Run Efficiency Analysis" to begin.
        </div>
      ) : (
        <>
          <div className="aditi-efficiency-stats">
            <div>
              <span>Scenarios Analyzed</span>
              <strong>
                {report.analyzedScenarios}/
                {report.totalScenarios}
              </strong>
            </div>

            <div>
              <span>Baseline Workload</span>
              <strong>
                {report.totalBaselineCost}
              </strong>
              <small>modeled units</small>
            </div>

            <div>
              <span>Optimized Workload</span>
              <strong>
                {report.totalOptimizedCost}
              </strong>
              <small>modeled units</small>
            </div>

            <div>
              <span>Saved Workload</span>
              <strong className="success">
                {report.totalSavedCost}
              </strong>
              <small>modeled units</small>
            </div>

            <div>
              <span>Overall Savings</span>
              <strong className="success">
                {report.overallSavingsPercent}%
              </strong>
            </div>

            <div>
              <span>Analysis Errors</span>
              <strong className="failure">
                {report.failedScenarios}
              </strong>
            </div>
          </div>

          <div className="aditi-efficiency-section">
            <h3>Workload Comparison</h3>

            <div className="aditi-efficiency-chart">
              <div className="aditi-efficiency-bar-row">
                <div className="aditi-efficiency-bar-label">
                  <span>Baseline</span>
                  <strong>
                    {report.totalBaselineCost} units
                  </strong>
                </div>

                <div className="aditi-efficiency-track">
                  <div
                    className="aditi-efficiency-bar baseline"
                    style={{
                      width: `${
                        (report.totalBaselineCost / maximumCost) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="aditi-efficiency-bar-row">
                <div className="aditi-efficiency-bar-label">
                  <span>Optimized</span>
                  <strong>
                    {report.totalOptimizedCost} units
                  </strong>
                </div>

                <div className="aditi-efficiency-track">
                  <div
                    className="aditi-efficiency-bar optimized"
                    style={{
                      width: `${
                        (report.totalOptimizedCost / maximumCost) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <p className="aditi-efficiency-highlight">
              Modeled workload reduction:
              <strong>
                {' '}{report.overallSavingsPercent}%
              </strong>
            </p>
          </div>

          <div className="aditi-efficiency-section">
            <h3>Sensor Utilization</h3>

            <div className="aditi-efficiency-sensors">
              {report.sensorUtilization.map((sensor) => (
                <div
                  className="aditi-efficiency-sensor"
                  key={sensor.sensor}
                >
                  <div className="aditi-efficiency-sensor-heading">
                    <strong>
                      {sensor.sensor.toUpperCase()}
                    </strong>

                    <span>
                      {sensor.activeScenarios}/
                      {report.analyzedScenarios} scenarios
                    </span>
                  </div>

                  <div className="aditi-efficiency-track">
                    <div
                      className="aditi-efficiency-bar utilization"
                      style={{
                        width: `${sensor.utilizationPercent}%`,
                      }}
                    />
                  </div>

                  <div className="aditi-efficiency-sensor-footer">
                    <span>
                      Utilization: {sensor.utilizationPercent}%
                    </span>

                    <span>
                      Weight: {sensor.modeledCost}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="aditi-efficiency-section">
            <h3>Scenario Efficiency Comparison</h3>

            <div className="aditi-efficiency-table-wrapper">
              <table className="aditi-efficiency-table">
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Baseline</th>
                    <th>Optimized</th>
                    <th>Saved</th>
                    <th>Savings</th>
                  </tr>
                </thead>

                <tbody>
                  {report.sortedBySavings.map((item) => (
                    <tr
                      key={item.scenarioId}
                      className={
                        selectedScenario === item.scenarioId
                          ? 'selected'
                          : ''
                      }
                      onClick={() =>
                        setSelectedScenario(item.scenarioId)
                      }
                    >
                      <td>{item.scenarioName}</td>
                      <td>{item.baselineCost}</td>
                      <td>{item.optimizedCost}</td>
                      <td>{item.savedCost}</td>
                      <td>
                        <strong>
                          {item.savingsPercent}%
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedResult && !selectedResult.error && (
            <div className="aditi-efficiency-section">
              <h3>Selected Scenario Details</h3>

              <div className="aditi-efficiency-details">
                <div>
                  <span>Scenario</span>
                  <strong>
                    {selectedResult.scenarioName}
                  </strong>
                </div>

                <div>
                  <span>Objective</span>
                  <strong>
                    {selectedResult.objective}
                  </strong>
                </div>

                <div>
                  <span>Active Sensors</span>
                  <strong>
                    {selectedResult.activeSensors.join(', ')}
                  </strong>
                </div>

                <div>
                  <span>Skipped Sensors</span>
                  <strong>
                    {selectedResult.skippedSensors.length
                      ? selectedResult.skippedSensors.join(', ')
                      : 'None'}
                  </strong>
                </div>

                <div>
                  <span>Active Sensor Percentage</span>
                  <strong>
                    {selectedResult.activeSensorPercent}%
                  </strong>
                </div>

                <div>
                  <span>Modeled Workload Savings</span>
                  <strong>
                    {selectedResult.savingsPercent}%
                  </strong>
                </div>
              </div>
            </div>
          )}

          <p className="aditi-efficiency-note">
            These results use predefined sensor workload
            weights. They are not measurements of physical
            power consumption, battery life, CPU utilization,
            memory use, or actual hardware efficiency.
          </p>
        </>
      )}
    </section>
  )
}
