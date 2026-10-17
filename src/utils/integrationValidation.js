
import {
  getAvailableScenarios,
} from '../simulation/ScenarioSimulationEngine'

import {
  runUnifiedScenario,
} from './unifiedSimulationEngine'

export function validateAllScenarios() {
  const scenarios = getAvailableScenarios()

  const results = scenarios.map((scenario) => {
    const result = runUnifiedScenario(scenario.id)

    return {
      id: scenario.id,
      name: scenario.name,
      status: result.status,
      expected: result.expected,
      actual: result.actual,
      comparison: result.comparison,
    }
  })

  const passed = results.filter(
    (result) => result.status === 'Completed'
  ).length

  return {
    total: results.length,
    passed,
    mismatches: results.filter(
      (result) => result.status === 'Mismatch'
    ).length,
    results,
  }
}
