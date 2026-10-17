
import { useState } from 'react'

const INITIAL_COMPONENTS = [
  {
    id: 'compute',
    name: 'Computing Unit',
    icon: '🖥️',
    watts: 3.0,
    enabled: true,
  },
  {
    id: 'camera',
    name: 'Camera',
    icon: '📷',
    watts: 0.6,
    enabled: true,
  },
  {
    id: 'imu',
    name: 'IMU',
    icon: '🧭',
    watts: 0.05,
    enabled: true,
  },
  {
    id: 'gps',
    name: 'GPS Module',
    icon: '📍',
    watts: 0.15,
    enabled: true,
  },
  {
    id: 'microphone',
    name: 'Microphone',
    icon: '🎤',
    watts: 0.05,
    enabled: true,
  },
  {
    id: 'audio',
    name: 'Audio Output',
    icon: '🔊',
    watts: 0.4,
    enabled: true,
  },
  {
    id: 'haptic',
    name: 'Haptic Output',
    icon: '📳',
    watts: 0.2,
    enabled: true,
  },
  {
    id: 'visual',
    name: 'Visual Output',
    icon: '👁️',
    watts: 0.8,
    enabled: false,
  },
]

const COLORS = {
  background: '#110b1b',
  panel: '#1b1129',
  border: '#51355e',
  cyan: '#22d3ee',
  pink: '#f472b6',
  green: '#34d399',
  text: '#f5f0fa',
  muted: '#b7a9c6',
}

export default function PowerConsumption({
  onPowerChange,
}) {
  const [components, setComponents] = useState(
    INITIAL_COMPONENTS
  )

  const totalPower = components.reduce(
    (sum, component) =>
      sum + (component.enabled ? component.watts : 0),
    0
  )

  const enabledCount = components.filter(
    (component) => component.enabled
  ).length

  function updatePower(id, value) {
    const number = Number(value)

    if (
      value === '' ||
      !Number.isFinite(number) ||
      number < 0 ||
      number > 500
    ) {
      return
    }

    setComponents((previous) =>
      previous.map((component) =>
        component.id === id
          ? { ...component, watts: number }
          : component
      )
    )
  }

  function toggleComponent(id) {
    setComponents((previous) =>
      previous.map((component) =>
        component.id === id
          ? {
              ...component,
              enabled: !component.enabled,
            }
          : component
      )
    )
  }

  function resetValues() {
    setComponents(
      INITIAL_COMPONENTS.map((component) => ({
        ...component,
      }))
    )
  }

  function sendTotal() {
    onPowerChange?.(Number(totalPower.toFixed(3)))
  }

  return (
    <section
      style={{
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        padding: 'clamp(12px, 3vw, 22px)',
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.background,
        color: COLORS.text,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            color: COLORS.pink,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1.2,
            marginBottom: 8,
          }}
        >
          ADITI / POWER ANALYSIS
        </div>

        <h2
          style={{
            fontSize: 'clamp(18px, 4vw, 25px)',
            margin: '0 0 10px',
          }}
        >
          Component Power Consumption
        </h2>

        <p
          style={{
            fontSize: 12,
            lineHeight: 1.7,
            color: COLORS.muted,
            margin: 0,
          }}
        >
          Adjust estimated power requirements and
          enable or disable individual modules.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {components.map((component) => (
          <div
            key={component.id}
            style={{
              padding: 14,
              borderRadius: 12,
              border: `1px solid ${
                component.enabled
                  ? COLORS.border
                  : 'rgba(148,163,184,0.2)'
              }`,
              background: COLORS.panel,
              opacity: component.enabled ? 1 : 0.6,
              minWidth: 0,
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 14,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={component.enabled}
                onChange={() =>
                  toggleComponent(component.id)
                }
                style={{
                  width: 18,
                  height: 18,
                  accentColor: COLORS.cyan,
                }}
              />

              <span style={{ fontSize: 20 }}>
                {component.icon}
              </span>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {component.name}
              </span>
            </label>

            <label
              style={{
                display: 'block',
                color: COLORS.muted,
                fontSize: 11,
              }}
            >
              Estimated Power (W)

              <input
                type="number"
                min="0"
                max="500"
                step="0.05"
                value={component.watts}
                disabled={!component.enabled}
                onChange={(event) =>
                  updatePower(
                    component.id,
                    event.target.value
                  )
                }
                style={{
                  display: 'block',
                  marginTop: 8,
                  width: '100%',
                  minHeight: 44,
                  padding: 10,
                  boxSizing: 'border-box',
                  borderRadius: 8,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.background,
                  color: COLORS.text,
                  fontSize: 14,
                }}
              />
            </label>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: 18,
          borderRadius: 12,
          border: `1px solid ${COLORS.cyan}70`,
          background: COLORS.panel,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            color: COLORS.muted,
            fontSize: 11,
            marginBottom: 8,
          }}
        >
          ESTIMATED TOTAL SYSTEM POWER
        </div>

        <div
          style={{
            color: COLORS.cyan,
            fontSize: 'clamp(26px, 5vw, 36px)',
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          {totalPower.toFixed(2)} W
        </div>

        <div
          style={{
            color: COLORS.muted,
            fontSize: 12,
          }}
        >
          {enabledCount} of {components.length} modules enabled
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 22,
        }}
      >
        <button
          type="button"
          onClick={resetValues}
          style={{
            minHeight: 44,
            padding: '11px 16px',
            borderRadius: 9,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.panel,
            color: COLORS.text,
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          ↺ Reset Values
        </button>

        <button
          type="button"
          onClick={sendTotal}
          disabled={!onPowerChange || totalPower <= 0}
          style={{
            minHeight: 44,
            padding: '11px 16px',
            borderRadius: 9,
            border: `1px solid ${COLORS.cyan}`,
            background: 'rgba(34,211,238,0.12)',
            color: COLORS.cyan,
            cursor: onPowerChange
              ? 'pointer'
              : 'not-allowed',
            fontWeight: 700,
            opacity: onPowerChange ? 1 : 0.5,
          }}
        >
          Use Total in Battery Estimator →
        </button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: COLORS.pink,
            marginBottom: 12,
          }}
        >
          POWER DISTRIBUTION BREAKDOWN
        </div>

        {components
          .filter((component) => component.enabled)
          .map((component) => {
            const percentage =
              totalPower > 0
                ? (component.watts / totalPower) * 100
                : 0

            return (
              <div
                key={component.id}
                style={{ marginBottom: 13 }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 10,
                    fontSize: 11,
                    marginBottom: 6,
                  }}
                >
                  <span>{component.name}</span>
                  <span>
                    {component.watts.toFixed(2)} W
                    {' · '}
                    {percentage.toFixed(1)}%
                  </span>
                </div>

                <div
                  style={{
                    height: 8,
                    borderRadius: 8,
                    background: 'rgba(148,163,184,0.16)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      borderRadius: 8,
                      background:
                        'linear-gradient(90deg, #22d3ee, #f472b6)',
                      transition: 'width 250ms ease',
                    }}
                  />
                </div>
              </div>
            )
          })}
      </div>

      <p
        style={{
          fontSize: 11,
          lineHeight: 1.7,
          color: COLORS.muted,
          margin: 0,
        }}
      >
        Values are illustrative engineering assumptions,
        not measured ADITI hardware consumption.
        External devices may use separate power sources.
        The estimate does not automatically account for
        every regulator, cable, driver, or conversion loss.
      </p>
    </section>
  )
}
