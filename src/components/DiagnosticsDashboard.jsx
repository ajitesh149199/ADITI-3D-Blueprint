
import { useMemo, useState } from 'react'

import { DIAGNOSTIC_FAULTS } from '../data/diagnosticsData'
import { evaluateDiagnostics } from '../utils/diagnosticsEngine'
import { useUnifiedSystem } from '../state/UnifiedSystemContext'

const panelStyle = {
  padding: 18,
  background: 'rgba(18,11,31,0.92)',
  border: '1px solid rgba(255,0,122,0.28)',
  borderRadius: 14,
  minWidth: 0,
}

const buttonStyle = {
  padding: '9px 12px',
  borderRadius: 9,
  border: '1px solid rgba(34,211,238,0.4)',
  background: 'rgba(34,211,238,0.1)',
  color: '#67e8f9',
  cursor: 'pointer',
}

function statusColor(status) {
  if (status === 'Critical' || status === 'Offline') {
    return '#fb7185'
  }

  if (status === 'Warning') {
    return '#fbbf24'
  }

  return '#34d399'
}

export default function DiagnosticsDashboard() {
  const {
  faultIds,
  acknowledged,
  toggleFault: toggleSharedFault,
  acknowledgeFault,
  resetFaults,
  } = useUnifiedSystem()
  const [events, setEvents] = useState([])

  const diagnostics = useMemo(
    () => evaluateDiagnostics(faultIds),
    [faultIds]
  )

  function logEvent(message) {
    setEvents((previous) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString(),
        message,
      },
      ...previous,
    ].slice(0, 60))
  }

  function toggleFault(fault) {
  const alreadyActive = faultIds.includes(fault.id)

  toggleSharedFault(fault.id)

  logEvent(
    `${fault.name}: ${
      alreadyActive ? 'Fault cleared' : 'Fault injected'
    }`
  )
}

  function resetSystem() {
  resetFaults()
  logEvent('Simulated system restored to baseline')
 }

  const metrics = [
    ['CPU Utilization', diagnostics.metrics.cpu, '%'],
    ['Memory Usage', diagnostics.metrics.memory, '%'],
    ['AI Workload', diagnostics.metrics.workload, '%'],
    ['Processing Latency', diagnostics.metrics.latency, 'ms'],
  ]

  return (
    <div
      style={{
        display: 'grid',
        gap: 18,
        color: '#f5f0fa',
      }}
    >
      <div style={panelStyle}>
        <div style={{ color: '#22d3ee', fontSize: 11 }}>
          ADITI / PHASE 10.5.14I
        </div>

        <h1>System Health & Diagnostics</h1>

        <p style={{ color: '#a99db8', fontSize: 12 }}>
          Interactive simulation of ADITI hardware health,
          processing activity, faults, alerts, and recovery.
          No live hardware telemetry is connected.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
        }}
      >
        {[
          ['System Status', diagnostics.systemStatus],
          ['Hardware Modules', `${diagnostics.hardware.length}`],
          ['Active Faults', `${diagnostics.activeFaults.length}`],
          ['Battery Level', `${diagnostics.metrics.battery}%`],
        ].map(([label, value]) => (
          <div key={label} style={panelStyle}>
            <div style={{ fontSize: 11, color: '#a99db8' }}>
              {label}
            </div>

            <strong
              style={{
                display: 'block',
                marginTop: 10,
                fontSize: 22,
                color: label === 'System Status'
                  ? statusColor(value)
                  : '#67e8f9',
              }}
            >
              {value}
            </strong>
          </div>
        ))}
      </div>

      <div style={panelStyle}>
        <h2>Performance Monitoring</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
          {metrics.map(([name, value, unit]) => (
            <div key={name}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 8,
                  fontSize: 12,
                }}
              >
                <span>{name}</span>
                <strong>{value}{unit}</strong>
              </div>

              <div
                style={{
                  height: 10,
                  background: '#25172f',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${
                      unit === 'ms'
                        ? Math.min(100, value / 3)
                        : value
                    }%`,
                    height: '100%',
                    background: value >= 90
                      ? '#fb7185'
                      : '#22d3ee',
                    transition: 'width 200ms',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={panelStyle}>
        <h2>Hardware & Sensor Health</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(210px, 1fr))',
            gap: 10,
          }}
        >
          {diagnostics.hardware.map((component) => (
            <div
              key={component.id}
              style={{
                padding: 12,
                borderRadius: 10,
                border: '1px solid rgba(255,0,122,0.18)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 8,
                  fontSize: 12,
                }}
              >
                <strong>{component.name}</strong>

                <span
                  style={{
                    color: statusColor(component.status),
                  }}
                >
                  {component.status}
                </span>
              </div>

              <div
                style={{
                  marginTop: 8,
                  color: '#a99db8',
                  fontSize: 11,
                }}
              >
                {component.group} · Simulated reliability:{' '}
                {component.reliability}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={panelStyle}>
        <h2>Fault Detection & Recovery Simulation</h2>

        <p style={{ fontSize: 12, color: '#a99db8' }}>
          Inject faults to test system status changes.
          Acknowledging an alert does not resolve its fault.
        </p>

        <div style={{ display: 'grid', gap: 12 }}>
          {DIAGNOSTIC_FAULTS.map((fault) => {
            const active = faultIds.includes(fault.id)
            const isAcknowledged = acknowledged.includes(fault.id)

            return (
              <div
                key={fault.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 10,
                  paddingBottom: 12,
                  borderBottom:
                    '1px solid rgba(255,0,122,0.14)',
                }}
              >
                <div style={{ flex: 1, minWidth: 170 }}>
                  <strong style={{ fontSize: 12 }}>
                    {fault.name}
                  </strong>

                  {active && (
                    <div
                      style={{
                        marginTop: 5,
                        color: isAcknowledged
                          ? '#fbbf24'
                          : '#fb7185',
                        fontSize: 11,
                      }}
                    >
                      {isAcknowledged
                        ? 'Acknowledged — fault still active'
                        : 'Active alert'}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  style={buttonStyle}
                  onClick={() => {
  acknowledgeFault(fault.id)
  logEvent(`${fault.name}: Alert acknowledged`)
}}
                >
                  {active ? 'Clear Fault' : 'Inject Fault'}
                </button>

                {active && (
                  <button
                    type="button"
                    style={buttonStyle}
                    disabled={isAcknowledged}
                    onClick={() => {
                      setAcknowledged((previous) => [
                        ...previous,
                        fault.id,
                      ])
                      logEvent(`${fault.name}: Alert acknowledged`)
                    }}
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          style={{ ...buttonStyle, marginTop: 18 }}
          onClick={resetSystem}
        >
          Reset All Faults
        </button>
      </div>

      <div style={panelStyle}>
        <h2>Diagnostic Event History</h2>

        <button
          type="button"
          style={buttonStyle}
          onClick={() => setEvents([])}
        >
          Clear Event Log
        </button>

        <div
          style={{
            maxHeight: 250,
            overflowY: 'auto',
            marginTop: 12,
          }}
        >
          {events.length === 0 ? (
            <p style={{ color: '#a99db8', fontSize: 12 }}>
              No diagnostic events recorded yet.
            </p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                style={{
                  padding: '9px 0',
                  borderBottom:
                    '1px solid rgba(255,0,122,0.12)',
                  fontSize: 11,
                }}
              >
                <span style={{ color: '#a99db8' }}>
                  [{event.time}]
                </span>{' '}
                {event.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
