
/* ============================================================
   ADITI — REAL-TIME SIMULATION ENGINE
   Phase 10.5.13A

   Runs simulated sensor processing at a configurable
   interval. This engine does not read physical sensors.
   ============================================================ */

import {
  getScenario,
} from './ScenarioSimulationEngine'

import {
  generateDynamicSensorData,
} from './DynamicSensorSimulationEngine'

import {
  processSensorData,
} from './AIProcessingEngine'

export const SIMULATION_STATES = Object.freeze({
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  STOPPED: 'stopped',
})

export const DEFAULT_SIMULATION_INTERVAL = 1000

export function createRealTimeSimulation({
  scenarioId,
  interval = DEFAULT_SIMULATION_INTERVAL,
  onUpdate = () => {},
  onStateChange = () => {},
  onError = () => {},
} = {}) {
  let timer = null
  let state = SIMULATION_STATES.IDLE
  let tickCount = 0
  let history = []

  const tickInterval = Math.max(
    100,
    Number(interval) || DEFAULT_SIMULATION_INTERVAL
  )

  function notifyState() {
    onStateChange(state)
  }

  function clearTimer() {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  function runTick() {
    try {
      const scenario = getScenario(scenarioId)

      if (!scenario) {
        throw new Error(
          `Simulation scenario not found: ${scenarioId}`
        )
      }

      const sensorData = generateDynamicSensorData(
  scenarioId,
  tickCount + 1
)
      

      if (!sensorData) {
        throw new Error(
          'Scenario sensor data is unavailable'
        )
      }

      const decision = processSensorData(
        sensorData,
        { objective: scenario.objective }
      )

      tickCount += 1

      const update = {
        tick: tickCount,
        scenarioId,
        scenarioName: scenario.name,
        objective: scenario.objective,
        sensorData,
        decision,
        timestamp: Date.now(),
      }

      history.push(update)

      // Keep the most recent 100 updates in memory.
      if (history.length > 100) {
        history = history.slice(-100)
      }

      onUpdate(update)

      return update
    } catch (error) {
      clearTimer()
      state = SIMULATION_STATES.STOPPED

      onError(
        error instanceof Error
          ? error
          : new Error(String(error))
      )

      notifyState()
      return null
    }
  }

  function start() {
    if (state === SIMULATION_STATES.RUNNING) {
      return
    }

    if (state === SIMULATION_STATES.PAUSED) {
      resume()
      return
    }

    clearTimer()

    tickCount = 0
    history = []

    state = SIMULATION_STATES.RUNNING
    notifyState()

    runTick()

    if (state === SIMULATION_STATES.RUNNING) {
      timer = setInterval(runTick, tickInterval)
    }
  }

  function pause() {
    if (state !== SIMULATION_STATES.RUNNING) {
      return
    }

    clearTimer()
    state = SIMULATION_STATES.PAUSED
    notifyState()
  }

  function resume() {
    if (state !== SIMULATION_STATES.PAUSED) {
      return
    }

    state = SIMULATION_STATES.RUNNING
    notifyState()

    timer = setInterval(runTick, tickInterval)
  }

  function stop() {
    clearTimer()
    state = SIMULATION_STATES.STOPPED
    notifyState()
  }

  function reset() {
    clearTimer()
    tickCount = 0
    history = []

    state = SIMULATION_STATES.IDLE
    notifyState()
  }

  function step() {
    if (state === SIMULATION_STATES.RUNNING) {
      return null
    }

    return runTick()
  }

  function getStatus() {
    return {
      state,
      tickCount,
      interval: tickInterval,
      scenarioId,
      historyLength: history.length,
    }
  }

  function getHistory() {
    return [...history]
  }

  function destroy() {
    clearTimer()
    state = SIMULATION_STATES.STOPPED
  }

  return {
    start,
    pause,
    resume,
    stop,
    reset,
    step,
    getStatus,
    getHistory,
    destroy,
  }
}
