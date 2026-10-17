
/* ============================================================
   ADITI — REAL-TIME CONTROL VALIDATION ENGINE
   Phase 10.5.13C

   Tests the existing simulation controller using
   actual state transitions and asynchronous waits.

   This validates software timer behavior only.
   ============================================================ */

import {
  getAvailableScenarios,
} from './ScenarioSimulationEngine'

import {
  createRealTimeSimulation,
  SIMULATION_STATES,
} from './RealTimeSimulationEngine'

const TEST_INTERVAL = 100
const WAIT_TOLERANCE = 80

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function makeResult(name, passed, details) {
  return {
    name,
    passed,
    details,
  }
}

export async function validateRealTimeControls(
  scenarioId
) {
  const scenarios = getAvailableScenarios()

  const selectedScenario =
    scenarioId ?? scenarios[0]?.id

  if (!selectedScenario) {
    return {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      passRate: 0,
      error: 'No scenarios available',
      results: [],
    }
  }

  const results = []
  const errors = []
  const updates = []

  const controller = createRealTimeSimulation({
    scenarioId: selectedScenario,
    interval: TEST_INTERVAL,

    onUpdate: (update) => {
      updates.push(update)
    },

    onError: (error) => {
      errors.push(String(error?.message ?? error))
    },
  })

  try {
    // --------------------------------------------------------
    // TEST 1 — START
    // --------------------------------------------------------

    controller.start()

    let status = controller.getStatus()

    results.push(
      makeResult(
        'Start simulation',
        status.state === SIMULATION_STATES.RUNNING &&
          status.tickCount === 1,
        `State: ${status.state}, ticks: ${status.tickCount}`
      )
    )

    // --------------------------------------------------------
    // TEST 2 — AUTOMATIC TICKS
    // --------------------------------------------------------

    await sleep(
      TEST_INTERVAL * 2 + WAIT_TOLERANCE
    )

    status = controller.getStatus()

    results.push(
      makeResult(
        'Automatic tick progression',
        status.state === SIMULATION_STATES.RUNNING &&
          status.tickCount >= 2,
        `Ticks after waiting: ${status.tickCount}`
      )
    )

    // --------------------------------------------------------
    // TEST 3 — PAUSE
    // --------------------------------------------------------

    controller.pause()

    const pausedCount =
      controller.getStatus().tickCount

    await sleep(
      TEST_INTERVAL + WAIT_TOLERANCE
    )

    status = controller.getStatus()

    results.push(
      makeResult(
        'Pause freezes ticks',
        status.state === SIMULATION_STATES.PAUSED &&
          status.tickCount === pausedCount,
        `Ticks before: ${pausedCount}, after: ${status.tickCount}`
      )
    )

    // --------------------------------------------------------
    // TEST 4 — RESUME
    // --------------------------------------------------------

    controller.resume()

    await sleep(
      TEST_INTERVAL + WAIT_TOLERANCE
    )

    status = controller.getStatus()

    results.push(
      makeResult(
        'Resume continues ticks',
        status.state === SIMULATION_STATES.RUNNING &&
          status.tickCount > pausedCount,
        `Ticks before: ${pausedCount}, after: ${status.tickCount}`
      )
    )

    // --------------------------------------------------------
    // TEST 5 — STOP
    // --------------------------------------------------------

    controller.stop()

    const stoppedCount =
      controller.getStatus().tickCount

    await sleep(
      TEST_INTERVAL + WAIT_TOLERANCE
    )

    status = controller.getStatus()

    results.push(
      makeResult(
        'Stop clears timer',
        status.state === SIMULATION_STATES.STOPPED &&
          status.tickCount === stoppedCount,
        `State: ${status.state}, ticks: ${status.tickCount}`
      )
    )

    // --------------------------------------------------------
    // TEST 6 — RESTART
    // --------------------------------------------------------

    controller.start()

    status = controller.getStatus()

    results.push(
      makeResult(
        'Restart begins a new run',
        status.state === SIMULATION_STATES.RUNNING &&
          status.tickCount === 1 &&
          status.historyLength === 1,
        `State: ${status.state}, ticks: ${status.tickCount}`
      )
    )

    // --------------------------------------------------------
    // TEST 7 — RESET
    // --------------------------------------------------------

    controller.reset()

    status = controller.getStatus()

    results.push(
      makeResult(
        'Reset clears simulation',
        status.state === SIMULATION_STATES.IDLE &&
          status.tickCount === 0 &&
          status.historyLength === 0,
        `State: ${status.state}, ticks: ${status.tickCount}`
      )
    )

    // --------------------------------------------------------
    // TEST 8 — MANUAL STEP
    // --------------------------------------------------------

    const stepUpdate = controller.step()

    status = controller.getStatus()

    results.push(
      makeResult(
        'Manual step processes one tick',
        stepUpdate !== null &&
          status.state === SIMULATION_STATES.IDLE &&
          status.tickCount === 1,
        `State: ${status.state}, ticks: ${status.tickCount}`
      )
    )

    // --------------------------------------------------------
    // TEST 9 — HISTORY CONSISTENCY
    // --------------------------------------------------------

    const history = controller.getHistory()

    results.push(
      makeResult(
        'History matches processed ticks',
        history.length === status.tickCount &&
          history[0]?.tick === 1,
        `History entries: ${history.length}, ticks: ${status.tickCount}`
      )
    )

    // --------------------------------------------------------
    // TEST 10 — DESTROY CLEANUP
    // --------------------------------------------------------

    controller.start()
    controller.destroy()

    const destroyedCount =
      controller.getStatus().tickCount

    await sleep(
      TEST_INTERVAL + WAIT_TOLERANCE
    )

    status = controller.getStatus()

    results.push(
      makeResult(
        'Destroy prevents further ticks',
        status.state === SIMULATION_STATES.STOPPED &&
          status.tickCount === destroyedCount,
        `State: ${status.state}, ticks: ${status.tickCount}`
      )
    )

    // --------------------------------------------------------
    // TEST 11 — CALLBACK UPDATES
    // --------------------------------------------------------

    results.push(
      makeResult(
        'Update callbacks received',
        updates.length >= 2,
        `Callbacks received: ${updates.length}`
      )
    )

    // --------------------------------------------------------
    // TEST 12 — NO PROCESSING ERRORS
    // --------------------------------------------------------

    results.push(
      makeResult(
        'No simulation processing errors',
        errors.length === 0,
        errors.length
          ? errors.join('; ')
          : 'No errors recorded'
      )
    )
  } catch (error) {
    results.push(
      makeResult(
        'Unexpected validation exception',
        false,
        String(error?.message ?? error)
      )
    )
  } finally {
    controller.destroy()
  }

  const passedTests = results.filter(
    (item) => item.passed
  ).length

  return {
    scenarioId: selectedScenario,
    totalTests: results.length,
    passedTests,
    failedTests: results.length - passedTests,

    passRate: results.length
      ? Number(
          (
            (passedTests / results.length) *
            100
          ).toFixed(2)
        )
      : 0,

    results,
    errors,
    timestamp: Date.now(),
  }
}
