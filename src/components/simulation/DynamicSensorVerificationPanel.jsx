
import { useState } from 'react'

import {
  getAvailableScenarios,
} from '../../simulation/ScenarioSimulationEngine'

import {
  generateDynamicSensorData,
  compareSensorSnapshots,
} from '../../simulation/DynamicSensorSimulationEngine'

import './DynamicSensorVerificationPanel.css'

export default function DynamicSensorVerificationPanel() {
  const scenarios = getAvailableScenarios()

  const [scenarioId, setScenarioId] = useState(
    scenarios[0]?.id ?? ''
  )

  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  function runVerification() {
    setError('')
    setReport(null)

    try {
      if (!scenarioId) {
        throw new Error('Select a scenario first.')
      }

      const snapshots = []

      for (let tick = 1; tick <= 10; tick++) {
        snapshots.push(
          generateDynamicSensorData(
            scenarioId,
            tick
          )
        )
      }

      const transitions = []

      for (let index = 1; index < snapshots.length; index++) {
        const changes = compareSensorSnapshots(
          snapshots[index - 1],
          snapshots[index]
        )

        transitions.push({
          fromTick: index,
          toTick: index + 1,
          changes,
        })
      }

      const changedTransitions = transitions.filter(
        (transition) => transition.changes.length > 0
      ).length

      const changedSensors = [
        ...new Set(
          transitions.flatMap((transition) =>
            transition.changes.map(
              (change) => change.sensor
            )
          )
        ),
      ]

      const totalChanges = transitions.reduce(
        (sum, transition) =>
          sum + transition.changes.length,
        0
      )

      setReport({
        scenarioId,
        snapshotsGenerated: snapshots.length,
        transitionsChecked: transitions.length,
        changedTransitions,
        unchangedTransitions:
          transitions.length - changedTransitions,
        changedSensors,
        totalChanges,
        transitions,
      })
    } catch (err) {
      setError(String(err?.message ?? err))
    }
  }

  return (
    <section className="aditi-dynamic-verification">
      <header>
        <span className="aditi-dynamic-eyebrow">
          DYNAMIC SENSOR VERIFICATION
        </span>

        <h2>Sensor Variation Analysis</h2>

        <p>
          Compare simulated sensor snapshots across
          ten consecutive ticks.
        </p>
      </header>

      <div className="aditi-dynamic-controls">
        <label>
          Scenario

          <select
            value={scenarioId}
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
          disabled={!scenarioId}
          onClick={runVerification}
        >
          Run Sensor Verification
        </button>
      </div>

      {error && (
        <div className="aditi-dynamic-error">
          {error}
        </div>
      )}

      {report && (
        <>
          <div className="aditi-dynamic-stats">
            <div>
              <span>Snapshots Generated</span>
              <strong>
                {report.snapshotsGenerated}
              </strong>
            </div>

            <div>
              <span>Transitions Checked</span>
              <strong>
                {report.transitionsChecked}
              </strong>
            </div>

            <div>
              <span>Changed Transitions</span>
              <strong>
                {report.changedTransitions}
              </strong>
            </div>

            <div>
              <span>Unchanged Transitions</span>
              <strong>
                {report.unchangedTransitions}
              </strong>
            </div>

            <div>
              <span>Changed Sensors</span>
              <strong>
                {report.changedSensors.length}
              </strong>
            </div>

            <div>
              <span>Total Field Changes</span>
              <strong>
                {report.totalChanges}
              </strong>
            </div>
          </div>

          <div className="aditi-dynamic-section">
            <h3>Detected Sensor Changes</h3>

            {report.changedSensors.length ? (
              <div className="aditi-dynamic-tags">
                {report.changedSensors.map((sensor) => (
                  <span key={sensor}>
                    {sensor}
                  </span>
                ))}
              </div>
            ) : (
              <p>
                No numeric sensor changes detected.
                Check whether the scenario uses
                supported sensor field names.
              </p>
            )}
          </div>

          <div className="aditi-dynamic-section">
            <h3>Tick-by-Tick Comparison</h3>

            <div className="aditi-dynamic-table-wrap">
              <table className="aditi-dynamic-table">
                <thead>
                  <tr>
                    <th>Transition</th>
                    <th>Changed Fields</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {report.transitions.map((item) => (
                    <tr key={item.toTick}>
                      <td>
                        {item.fromTick} → {item.toTick}
                      </td>

                      <td>
                        {item.changes.length}
                      </td>

                      <td>
                        {item.changes.length > 0
                          ? 'CHANGED'
                          : 'UNCHANGED'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="aditi-dynamic-note">
            This verifies synthetic changes in
            supported numeric sensor fields.
            It does not establish physical sensor
            accuracy or AI decision correctness.
          </p>
        </>
      )}
    </section>
  )
}
