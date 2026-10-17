
import { useMemo, useState } from 'react'

import { useUnifiedSystem } from '../state/UnifiedSystemContext'

import {
  HARDWARE_COMPONENTS,
  buildHardwareOverview,
} from '../utils/hardwareInteractionEngine'

const COLORS = {
  cyan: '#00e7ee',
  pink: '#ff007a',
  green: '#34d399',
  muted: '#a99db8',
  text: '#f5f0fa',
  background: '#120b1f',
}

const panel = {
  padding: 18,
  background: 'rgba(18,11,31,0.94)',
  border: '1px solid rgba(255,0,122,0.28)',
  borderRadius: 14,
  minWidth: 0,
}

function StatusBadge({ status }) {
  const isFault = status === 'Simulated Fault'
  const isBlocked = status === 'Mission Blocked'

  const color =
    isFault || isBlocked
      ? COLORS.pink
      : COLORS.green

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '6px 10px',
        borderRadius: 8,
        color,
        background: `${color}18`,
        border: `1px solid ${color}55`,
        fontSize: 11,
      }}
    >
      {status}
    </span>
  )
}

export default function HardwareInteractionDashboard({
  selectedHardwareId,
  onSelectHardware,
}) {
  const [localSelectedId, setLocalSelectedId] = useState('camera')

  const selectedId = selectedHardwareId ?? localSelectedId

  function selectHardware(id) {
    setLocalSelectedId(id)
    onSelectHardware?.(id)
  }
  const {
    faultIds,
    telemetrySnapshot,
    latestResult,
  } = useUnifiedSystem()

  const components = useMemo(
    () =>
      buildHardwareOverview(
        faultIds,
        telemetrySnapshot
      ),
    [faultIds, telemetrySnapshot]
  )

  const selected =
    components.find(
      (component) => component.id === selectedId
    ) ?? components[0]

  const faultCount = components.filter(
    (component) =>
      component.status === 'Simulated Fault'
  ).length

  return (
    <div
      style={{
        display: 'grid',
        gap: 18,
        color: COLORS.text,
        minWidth: 0,
      }}
    >
      <header style={panel}>
        <div
          style={{
            color: COLORS.cyan,
            fontSize: 11,
            letterSpacing: 2,
          }}
        >
          ADITI / PHASE N
        </div>

        <h2>3D Hardware Interaction</h2>

        <p
          style={{
            color: COLORS.muted,
            fontSize: 12,
          }}
        >
          Select conceptual hardware components and
          inspect their functions, simulated diagnostic
          state, and connection to ADITI's AI pipeline.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 18,
            fontSize: 12,
          }}
        >
          <span>
            Components: {HARDWARE_COMPONENTS.length}
          </span>

          <span style={{ color: COLORS.pink }}>
            Matched Component Faults: {faultCount}
          </span>

          <span style={{ color: COLORS.cyan }}>
            Mission: {
              telemetrySnapshot?.missionStatus ?? 'Idle'
            }
          </span>
        </div>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(290px, 1fr))',
          gap: 16,
        }}
      >
        <section style={panel}>
          <h3>01 / Hardware Components</h3>

          <div
            style={{
              display: 'grid',
              gap: 9,
            }}
          >
            {components.map((component) => {
              const active =
                component.id === selectedId

              return (
                <button
                  key={component.id}
                  type="button"
                  onClick={() => selectHardware(component.id)}
                  
                  style={{
                    textAlign: 'left',
                    padding: 13,
                    borderRadius: 9,
                    cursor: 'pointer',
                    background: active
                      ? 'rgba(0,231,238,0.1)'
                      : COLORS.background,
                    border: active
                      ? `1px solid ${COLORS.cyan}`
                      : '1px solid rgba(255,255,255,0.1)',
                    color: COLORS.text,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 10,
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    <strong>
                      {component.name}
                    </strong>

                    <span
                      style={{
                        color: COLORS.muted,
                        fontSize: 10,
                      }}
                    >
                      {component.category}
                    </span>
                  </div>

                  <div
                    style={{
                      color:
                        component.status ===
                        'Simulated Fault'
                          ? COLORS.pink
                          : COLORS.green,
                      fontSize: 11,
                      marginTop: 7,
                    }}
                  >
                    {component.status}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section style={panel}>
          <h3>02 / Selected Component</h3>

          {selected && (
            <>
              <div
                style={{
                  color: COLORS.cyan,
                  fontSize: 11,
                  letterSpacing: 1,
                }}
              >
                {selected.category.toUpperCase()}
              </div>

              <h2>{selected.name}</h2>

              <StatusBadge status={selected.status} />

              <p
                style={{
                  color: COLORS.muted,
                  fontSize: 13,
                  lineHeight: 1.7,
                }}
              >
                {selected.description}
              </p>

              <h4>Component Functions</h4>

              <ul
                style={{
                  paddingLeft: 20,
                  color: COLORS.muted,
                  fontSize: 12,
                  lineHeight: 1.9,
                }}
              >
                {selected.functions.map(
                  (functionName) => (
                    <li key={functionName}>
                      {functionName}
                    </li>
                  )
                )}
              </ul>

              <div
                style={{
                  padding: 13,
                  marginTop: 18,
                  background: COLORS.background,
                  borderRadius: 9,
                  fontSize: 12,
                }}
              >
                <div style={{ color: COLORS.muted }}>
                  Current Mission
                </div>

                <strong style={{ color: COLORS.cyan }}>
                  {latestResult?.scenarioId ??
                    'No mission executed'}
                </strong>
              </div>
            </>
          )}
        </section>
      </div>

      <section style={panel}>
        <h3>03 / Hardware-to-AI Pipeline</h3>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
            fontSize: 12,
          }}
        >
          {[
            'SENSORS',
            'DATA FUSION',
            'AI DECISION',
            'SUPPRESSION',
            'FEEDBACK',
          ].map((stage, index) => (
            <div
              key={stage}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: COLORS.background,
                  border:
                    '1px solid rgba(0,231,238,0.25)',
                  color: COLORS.cyan,
                }}
              >
                {stage}
              </span>

              {index < 4 && (
                <span style={{ color: COLORS.pink }}>
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        <p
          style={{
            color: COLORS.muted,
            fontSize: 11,
            marginTop: 14,
          }}
        >
          Conceptual processing architecture. This
          visualization does not indicate actual
          physical sensor connectivity.
        </p>
      </section>
    </div>
  )
}
