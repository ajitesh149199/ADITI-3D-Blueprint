
import { useState } from 'react'

import PowerDiagram from './PowerDiagram'
import BatteryEstimator from './BatteryEstimator'
import PowerConsumption from './PowerConsumption'
import BatteryStatus from './BatteryStatus'

import PowerDashboard from '../PowerDashboard'

export default function PowerSection() {
  const [activeView, setActiveView] = useState('distribution')
  const [calculatedPower, setCalculatedPower] = useState(null)

  function handlePowerTransfer(watts) {
    setCalculatedPower(watts)
    setActiveView('battery')
  }

  const buttonStyle = (active) => ({
    minHeight: 44,
    padding: '11px 16px',
    borderRadius: 10,
    border: `1px solid ${
      active ? '#22d3ee' : 'rgba(244,114,182,0.3)'
    }`,
    background: active
      ? 'rgba(34,211,238,0.12)'
      : 'rgba(27,17,41,0.9)',
    color: active ? '#22d3ee' : '#f5f0fa',
    fontFamily: 'inherit',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  })

  return (
    <section
      style={{
        width: '100%',
        height: '100%',
        minWidth: 0,
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        padding: 'clamp(12px, 2vw, 24px)',
        color: '#f5f0fa',
      }}
    >
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            color: '#f472b6',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1.2,
            marginBottom: 8,
          }}
        >
          ADITI / ENGINEERING BLUEPRINT
        </div>

        <h1
          style={{
            fontSize: 'clamp(21px, 4vw, 30px)',
            margin: '0 0 10px',
          }}
        >
          Power & Battery System
        </h1>

        <p
          style={{
            color: '#b7a9c6',
            fontSize: 13,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Explore power distribution, estimate individual
          module consumption, calculate battery runtime,
          simulate remaining battery energy, and compare
          proposed energy-management strategies.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 20,
        }}
      >
        <button
          type="button"
          style={buttonStyle(activeView === 'distribution')}
          onClick={() => setActiveView('distribution')}
        >
          ⚡ Power Distribution
        </button>

        <button
          type="button"
          style={buttonStyle(activeView === 'consumption')}
          onClick={() => setActiveView('consumption')}
        >
          📊 Power Consumption
        </button>

        <button
          type="button"
          style={buttonStyle(activeView === 'battery')}
          onClick={() => setActiveView('battery')}
        >
          🔋 Battery Estimator
        </button>

        <button
          type="button"
          style={buttonStyle(activeView === 'status')}
          onClick={() => setActiveView('status')}
        >
          📈 Battery Status
        </button>

        <button
          type="button"
          style={buttonStyle(activeView === 'energy')}
          onClick={() => setActiveView('energy')}
        >
          🔬 Energy Management
        </button>
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: activeView === 'distribution' ? 'block' : 'none',
          }}
        >
          <PowerDiagram />
        </div>

        <div
          style={{
            display: activeView === 'consumption' ? 'block' : 'none',
          }}
        >
          <PowerConsumption onPowerChange={handlePowerTransfer} />
        </div>

        {activeView === 'battery' && (
          <BatteryEstimator externalPower={calculatedPower} />
        )}

        {activeView === 'status' && (
          <BatteryStatus externalPower={calculatedPower} />
        )}

        {activeView === 'energy' && (
          <PowerDashboard />
        )}
      </div>
    </section>
  )
}
