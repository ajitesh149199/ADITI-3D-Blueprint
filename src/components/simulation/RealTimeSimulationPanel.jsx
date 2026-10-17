
import { useEffect, useRef, useState } from 'react'

import {
  getAvailableScenarios,
} from '../../simulation/ScenarioSimulationEngine'

import {
  createRealTimeSimulation,
  SIMULATION_STATES,
} from '../../simulation/RealTimeSimulationEngine'

import './RealTimeSimulationPanel.css'

export default function RealTimeSimulationPanel() {
  const scenarios = getAvailableScenarios()

  const [scenarioId, setScenarioId] = useState(
    scenarios[0]?.id ?? ''
  )

  const [intervalMs, setIntervalMs] = useState(1000)
  const [simulationState, setSimulationState] = useState(
    SIMULATION_STATES.IDLE
  )

  const [tickCount, setTickCount] = useState(0)
  const [latestUpdate, setLatestUpdate] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')

  const controllerRef = useRef(null)

  useEffect(() => {
    if (!scenarioId) return undefined

    const controller = createRealTimeSimulation({
      scenarioId,
      interval: intervalMs,

      onUpdate: (update) => {
        setLatestUpdate(update)
        setTickCount(update.tick)

        setHistory((previous) =>
          [...previous, update].slice(-20)
        )
      },

      onStateChange: (state) => {
        setSimulationState(state)
      },

      onError: (err) => {
        setError(String(err?.message ?? err))
      },
    })

    controllerRef.current = controller

    setSimulationState(SIMULATION_STATES.IDLE)
    setTickCount(0)
    setLatestUpdate(null)
    setHistory([])
    setError('')

    return () => {
      controller.destroy()

      if (controllerRef.current === controller) {
        controllerRef.current = null
      }
    }
  }, [scenarioId, intervalMs])

  function handleStart() {
    setError('')
    controllerRef.current?.start()
  }

  function handlePause() {
    controllerRef.current?.pause()
  }

  function handleResume() {
    setError('')
    controllerRef.current?.resume()
  }

  function handleStop() {
    controllerRef.current?.stop()
  }

  function handleReset() {
    controllerRef.current?.reset()
    setTickCount(0)
    setLatestUpdate(null)
    setHistory([])
    setError('')
  }

  function handleStep() {
    setError('')
    controllerRef.current?.step()
  }

  const decision = latestUpdate?.decision

  const canStart =
    simulationState === SIMULATION_STATES.IDLE ||
    simulationState === SIMULATION_STATES.STOPPED

  const canPause =
    simulationState === SIMULATION_STATES.RUNNING

  const canResume =
    simulationState === SIMULATION_STATES.PAUSED

  const canStep =
    simulationState !== SIMULATION_STATES.RUNNING

  return (
    <section className="aditi-live-panel">
      <header className="aditi-live-header">
        <div>
          <span className="aditi-live-eyebrow">
            REAL-TIME SIMULATION
          </span>

          <h2>ADITI Live Simulation Controls</h2>

          <p>
            Run, pause, and inspect repeated simulated
            sensor processing and AI decisions.
          </p>
        </div>

        <span
          className={`aditi-live-status ${simulationState}`}
        >
          {simulationState.toUpperCase()}
        </span>
      </header>

      <div className="aditi-live-settings">
        <label>
          Scenario

          <select
            value={scenarioId}
            onChange={(event) =>
              setScenarioId(event.target.value)
            }
          >
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Update Interval

          <select
            value={intervalMs}
            onChange={(event) =>
              setIntervalMs(Number(event.target.value))
            }
          >
            <option value={250}>250 ms</option>
            <option value={500}>500 ms</option>
            <option value={1000}>1000 ms</option>
            <option value={2000}>2000 ms</option>
          </select>
        </label>
      </div>

      <div className="aditi-live-controls">
        <button
          type="button"
          disabled={!canStart || !scenarioId}
          onClick={handleStart}
        >
          ▶ Start
        </button>

        <button
          type="button"
          disabled={!canPause}
          onClick={handlePause}
        >
          ⏸ Pause
        </button>

        <button
          type="button"
          disabled={!canResume}
          onClick={handleResume}
        >
          ▶ Resume
        </button>

        <button
          type="button"
          disabled={
            simulationState === SIMULATION_STATES.IDLE ||
            simulationState === SIMULATION_STATES.STOPPED
          }
          onClick={handleStop}
        >
          ■ Stop
        </button>

        <button
          type="button"
          onClick={handleReset}
        >
          ↺ Reset
        </button>

        <button
          type="button"
          disabled={!canStep || !scenarioId}
          onClick={handleStep}
        >
          ▷ Step
        </button>
      </div>

      {error && (
        <div className="aditi-live-error">
          {error}
        </div>
      )}

      <div className="aditi-live-stats">
        <div>
          <span>Simulation State</span>
          <strong>
            {simulationState.toUpperCase()}
          </strong>
        </div>

        <div>
          <span>Processed Ticks</span>
          <strong>{tickCount}</strong>
        </div>

        <div>
          <span>Update Interval</span>
          <strong>{intervalMs} ms</strong>
        </div>

        <div>
          <span>Recent Updates</span>
          <strong>{history.length}</strong>
        </div>
      </div>

      <div className="aditi-live-section">
        <h3>Latest AI Decision</h3>

        {decision ? (
          <div className="aditi-live-details">
            <div>
              <span>Objective</span>
              <strong>
                {latestUpdate.objective}
              </strong>
            </div>

            <div>
              <span>Risk Level</span>
              <strong>
                {decision.risk?.level ?? 'N/A'}
              </strong>
            </div>

            <div>
              <span>Relevance</span>
              <strong>
                {typeof decision.relevance === 'object'
                  ? JSON.stringify(decision.relevance)
                  : String(decision.relevance ?? 'N/A')}
              </strong>
            </div>

            <div>
              <span>Suppression Action</span>
              <strong>
                {decision.suppression?.action ?? 'N/A'}
              </strong>
            </div>

            <div>
              <span>Feedback</span>
              <strong>
                {typeof decision.feedback === 'object'
                  ? JSON.stringify(decision.feedback)
                  : String(decision.feedback ?? 'N/A')}
              </strong>
            </div>

            <div>
              <span>Last Updated</span>
              <strong>
                {new Date(latestUpdate.timestamp)
                  .toLocaleTimeString()}
              </strong>
            </div>
          </div>
        ) : (
          <p className="aditi-live-empty">
            No AI decision processed yet.
          </p>
        )}
      </div>

      <div className="aditi-live-section">
        <h3>Recent Simulation Updates</h3>

        {history.length === 0 ? (
          <p className="aditi-live-empty">
            Simulation history is empty.
          </p>
        ) : (
          <div className="aditi-live-table-wrapper">
            <table className="aditi-live-table">
              <thead>
                <tr>
                  <th>Tick</th>
                  <th>Time</th>
                  <th>Risk</th>
                  <th>Suppression</th>
                </tr>
              </thead>

              <tbody>
                {[...history].reverse().map((item) => (
                  <tr key={item.tick}>
                    <td>{item.tick}</td>

                    <td>
                      {new Date(item.timestamp)
                        .toLocaleTimeString()}
                    </td>

                    <td>
                      {item.decision.risk?.level ?? 'N/A'}
                    </td>

                    <td>
                      {item.decision.suppression?.action
                        ?? 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="aditi-live-note">
        This is a timed software simulation.
        It currently reprocesses predefined scenario
        data rather than receiving live hardware
        sensor readings.
      </p>
    </section>
  )
}
