
import { useState } from 'react'
import { useSimulation } from '../../state/SimulationContext'
import './ScenarioControl.css'

const CATEGORIES = [
  'All',
  'Vision',
  'Navigation',
  'Safety',
  'System',
]

export default function ScenarioControl() {
  const {
    selectedScenario,
    availableScenarios,
    selectScenario,
    runScenario,
    scenarioResult,
  } = useSimulation()

  const [activeCategory, setActiveCategory] =
    useState('All')

  const filteredScenarios = availableScenarios.filter(
    (scenario) =>
      activeCategory === 'All' ||
      scenario.category === activeCategory
  )

  const selectedDetails = availableScenarios.find(
    (scenario) => scenario.id === selectedScenario
  )

  const result = scenarioResult?.results

  return (
    <section className="aditi-scenario-panel">

      <div className="aditi-scenario-heading">
        <div>
          <span>09 / SCENARIO TESTING</span>
          <h2>ADITI Scenario Simulator</h2>
        </div>

        <span className="aditi-scenario-tag">
          {availableScenarios.length} SCENARIOS
        </span>
      </div>

      {/* CATEGORY FILTERS */}

      <div className="aditi-category-filters">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={
              'aditi-category-button ' +
              (activeCategory === category
                ? 'active'
                : '')
            }
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* COMPACT SCENARIO CARDS */}

      <div className="aditi-scenario-grid">
        {filteredScenarios.map((scenario) => (
          <button
            type="button"
            key={scenario.id}
            className={
              'aditi-scenario-card ' +
              (selectedScenario === scenario.id
                ? 'selected'
                : '')
            }
            onClick={() => selectScenario(scenario.id)}
          >
            <strong>{scenario.name}</strong>

            <span className="aditi-card-category">
              {scenario.category}
            </span>

            <span>{scenario.description}</span>
          </button>
        ))}
      </div>

      {/* EXECUTION CONTROLS */}

      <div className="aditi-scenario-actions">
        <button
          type="button"
          disabled={!selectedScenario}
          onClick={runScenario}
        >
          Run Selected Scenario
        </button>

        <span>
          {selectedDetails
            ? `Selected: ${selectedDetails.name}`
            : 'Select a scenario to begin'}
        </span>
      </div>

      {/* SCENARIO RESULTS */}

      {scenarioResult && (
        <div className="aditi-scenario-result">
          <h3>Scenario Execution Result</h3>

          <p>
            <strong>Scenario:</strong>{' '}
            {scenarioResult.scenarioName}
          </p>

          <p>
            <strong>Objective:</strong>{' '}
            {scenarioResult.objective}
          </p>

          <p>
            <strong>Risk:</strong>{' '}
            {result?.risk?.level ?? 'N/A'}
          </p>

          <p>
            <strong>Suppression:</strong>{' '}
            {result?.suppression?.action ?? 'N/A'}
          </p>

          <p>
            <strong>Feedback:</strong>{' '}
            {result?.feedback ?? 'none'}
          </p>
        </div>
      )}
    </section>
  )
}
