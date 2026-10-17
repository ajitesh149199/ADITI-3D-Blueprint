
import { useEffect, useState } from 'react'

import {
  ARCHITECTURE_NODES,
  ARCHITECTURE_CONNECTIONS,
  ARCHITECTURE_SCENARIOS,
  ARCHITECTURE_LAYERS,
} from '../data/architectureData'

import { HARDWARE_DETAILS } from '../visualisation/SensorIndicators'

const buttonStyle = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid rgba(148,163,184,0.3)',
  background: 'rgba(15,23,42,0.85)',
  color: '#e2e8f0',
  cursor: 'pointer',
}

function ArchitectureNode({
  node,
  active,
  completed,
  selected,
  onClick,
}) {
  const layer = ARCHITECTURE_LAYERS[node.layer]

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        padding: 13,
        borderRadius: 12,
        textAlign: 'left',
        cursor: 'pointer',
        color: '#f8fafc',
        background: active
          ? `${layer.color}22`
          : 'rgba(15,23,42,0.9)',
        border: `1px solid ${
          active || selected
            ? layer.color
            : 'rgba(148,163,184,0.25)'
        }`,
        boxShadow: active
          ? `0 0 22px ${layer.color}55`
          : 'none',
        transition: 'all 250ms ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <strong>{node.name}</strong>
        <span style={{ color: layer.color, fontSize: 11 }}>
          {active ? '● Active' : completed ? '✓ Complete' : layer.label}
        </span>
      </div>

      <div
        style={{
          fontSize: 12,
          opacity: 0.75,
          marginTop: 6,
        }}
      >
        {node.description}
      </div>
    </button>
  )
}

function ArchitectureArrow({ active }) {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 35,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 3,
          height: 26,
          position: 'relative',
          borderRadius: 4,
          background: active ? '#22d3ee' : '#475569',
          boxShadow: active ? '0 0 12px #22d3ee' : 'none',
          transition: 'background 250ms ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: -2,
            left: -5,
            width: 11,
            height: 11,
            borderRight: '2px solid',
            borderBottom: '2px solid',
            borderColor: active ? '#22d3ee' : '#64748b',
            transform: 'rotate(45deg)',
          }}
        />

        {active && (
          <div
            style={{
              position: 'absolute',
              width: 7,
              height: 7,
              left: -2,
              borderRadius: '50%',
              background: '#67e8f9',
              boxShadow: '0 0 12px #22d3ee',
              animation: 'aditi-flow 0.9s linear infinite',
            }}
          />
        )}
      </div>
    </div>
  )
}

export function ArchitecturePanel({
  onClose,
  onSelectHardware,
}) {
  const [scenarioKey, setScenarioKey] = useState('obstacle')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [selectedNodeId, setSelectedNodeId] = useState('sensors')

  const scenario = ARCHITECTURE_SCENARIOS[scenarioKey]
  const selectedNode = ARCHITECTURE_NODES.find(
    (node) => node.id === selectedNodeId
  )

  const lastStep = ARCHITECTURE_NODES.length - 1

  useEffect(() => {
    if (!playing) return

    if (step >= lastStep) {
      setPlaying(false)
      return
    }

    const timeout = setTimeout(() => {
      setStep((current) => Math.min(current + 1, lastStep))
    }, speed)

    return () => clearTimeout(timeout)
  }, [playing, step, speed, lastStep])

  const changeScenario = (key) => {
    setScenarioKey(key)
    setStep(0)
    setPlaying(false)
    setSelectedNodeId('sensors')
  }

  const play = () => {
    if (step >= lastStep) setStep(0)
    setPlaying(true)
  }

  const next = () => {
    setPlaying(false)
    setStep((current) => Math.min(current + 1, lastStep))
  }

  const previous = () => {
    setPlaying(false)
    setStep((current) => Math.max(current - 1, 0))
  }

  const reset = () => {
    setPlaying(false)
    setStep(0)
  }

  const currentNode = ARCHITECTURE_NODES[step]

  return (
    <section
      className="glass-panel aditi-phase-g-explorer"
      style={{
        marginTop: 16,
        padding: 18,
        background: 'rgba(8,15,30,0.96)',
        border: '1px solid rgba(34,211,238,0.3)',
        borderRadius: 14,
        color: '#e2e8f0',
      }}
    >
      <style>
        {`
          @keyframes aditi-flow {
            from { top: 0; opacity: 0.4; }
            to { top: 20px; opacity: 1; }
          }
        `}
      </style>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div className="kicker">ADITI SYSTEM ARCHITECTURE</div>
          <h3 style={{ margin: '7px 0' }}>
            Interactive Data Flow Explorer
          </h3>
          <p style={{ fontSize: 12, opacity: 0.7 }}>
            Conceptual simulation — not live hardware telemetry.
          </p>
        </div>

        <button type="button" style={buttonStyle} onClick={onClose}>
          Close Explorer ×
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          margin: '18px 0',
          alignItems: 'center',
        }}
      >
        <label htmlFor="aditi-architecture-scenario">
          Scenario
        </label>

        <select
          id="aditi-architecture-scenario"
          value={scenarioKey}
          onChange={(event) => changeScenario(event.target.value)}
        >
          {Object.entries(ARCHITECTURE_SCENARIOS).map(
            ([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            )
          )}
        </select>

        <label htmlFor="aditi-architecture-speed">
          Playback speed
        </label>

        <select
          id="aditi-architecture-speed"
          value={speed}
          onChange={(event) => setSpeed(Number(event.target.value))}
        >
          <option value={1600}>Slow</option>
          <option value={1000}>Normal</option>
          <option value={450}>Fast</option>
        </select>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 18,
        }}
      >
        <button
          type="button"
          style={buttonStyle}
          onClick={playing ? () => setPlaying(false) : play}
        >
          {playing ? 'Ⅱ Pause' : '▶ Play'}
        </button>

        <button
          type="button"
          style={buttonStyle}
          onClick={previous}
          disabled={step === 0}
        >
          ← Previous
        </button>

        <button
          type="button"
          style={buttonStyle}
          onClick={next}
          disabled={step === lastStep}
        >
          Next →
        </button>

        <button
          type="button"
          style={buttonStyle}
          onClick={reset}
        >
          ↺ Reset
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 18,
          alignItems: 'start',
        }}
      >
        <div
          style={{
            borderRadius: 12,
            border: '1px solid rgba(148,163,184,0.2)',
            padding: 15,
            background: 'rgba(2,6,23,0.5)',
          }}
        >
          <div className="kicker">
            DATA FLOW — STEP {step + 1} / {ARCHITECTURE_NODES.length}
          </div>

          <div style={{ marginTop: 15 }}>
            {ARCHITECTURE_NODES.map((node, index) => (
              <div key={node.id}>
                <ArchitectureNode
                  node={node}
                  active={index === step}
                  completed={index < step}
                  selected={selectedNodeId === node.id}
                  onClick={() => {
                    setSelectedNodeId(node.id)
                    setStep(index)
                    setPlaying(false)
                  }}
                />

                {index < lastStep && (
                  <ArchitectureArrow
                    active={
                      ARCHITECTURE_CONNECTIONS.some(
                        ([from, to]) =>
                          from === node.id &&
                          to === ARCHITECTURE_NODES[index + 1].id
                      ) && index < step
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gap: 14,
          }}
        >
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: 'rgba(34,211,238,0.07)',
              border: '1px solid rgba(34,211,238,0.25)',
            }}
          >
            <div className="kicker">CURRENT SIMULATION</div>
            <h4>{scenario.name}</h4>

            <p><strong>Objective:</strong> {scenario.objective}</p>
            <p><strong>Observation:</strong> {scenario.observation}</p>

            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: 'rgba(15,23,42,0.9)',
                borderLeft: '3px solid #22d3ee',
              }}
            >
              <strong>{currentNode.name}</strong>
              <p style={{ marginBottom: 0, lineHeight: 1.6 }}>
                {scenario.stages[currentNode.id]}
              </p>
            </div>

            {step === lastStep && (
              <p style={{ color: '#34d399' }}>
                <strong>Result:</strong> {scenario.result}
              </p>
            )}
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(148,163,184,0.2)',
            }}
          >
            <div className="kicker">MODULE INSPECTION</div>
            <h4>{selectedNode?.name}</h4>
            <p style={{ lineHeight: 1.6 }}>
              {selectedNode?.description}
            </p>

            <h4>Associated hardware</h4>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {selectedNode?.hardware.map((key) => (
                <button
                  key={key}
                  type="button"
                  style={buttonStyle}
                  onClick={() => onSelectHardware?.(key)}
                  title="Select this hardware in the 3D viewer"
                >
                  {HARDWARE_DETAILS[key]?.name || key} ↗
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: 14,
              borderRadius: 10,
              border: '1px solid rgba(148,163,184,0.2)',
              fontSize: 12,
              lineHeight: 1.7,
              opacity: 0.8,
            }}
          >
            <strong>Architecture note</strong>
            <p style={{ marginBottom: 0 }}>
              These animations illustrate ADITI's intended
              logical processing sequence. Actual timing,
              risk scores, suppression decisions, and output
              behavior must be verified through the simulator
              backend or physical hardware tests.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
