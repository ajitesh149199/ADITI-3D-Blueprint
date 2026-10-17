
import { useEffect, useState } from 'react'

const COLORS = {
  background: '#110b1b',
  panel: '#1b1129',
  border: '#51355e',
  cyan: '#22d3ee',
  pink: '#f472b6',
  green: '#34d399',
  yellow: '#fbbf24',
  red: '#fb7185',
  text: '#f5f0fa',
  muted: '#b7a9c6',
}

const DEFAULTS = {
  capacity: 3000,
  voltage: 3.7,
  power: 4.45,
  efficiency: 85,
  reserve: 10,
}

// One real second represents one simulated minute.
const SIMULATED_MINUTES_PER_SECOND = 1

function formatTime(hours) {
  if (!Number.isFinite(hours) || hours <= 0) {
    return '0h 0m'
  }

  const minutes = Math.ceil(hours * 60)
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return `${h}h ${m}m`
}

function Metric({ label, value, color }) {
  return (
    <div
      style={{
        padding: 15,
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 11,
        minWidth: 0,
      }}
    >
      <div
        style={{
          color: COLORS.muted,
          fontSize: 11,
          marginBottom: 9,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: color || COLORS.text,
          fontSize: 'clamp(18px, 4vw, 25px)',
          fontWeight: 800,
          overflowWrap: 'anywhere',
        }}
      >
        {value}
      </div>
    </div>
  )
}

function ActionButton({
  children,
  onClick,
  disabled = false,
  active = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: 44,
        flex: '1 1 110px',
        padding: '11px 14px',
        borderRadius: 9,
        border: `1px solid ${
          active ? COLORS.cyan : COLORS.border
        }`,
        background: active
          ? 'rgba(34,211,238,0.13)'
          : COLORS.panel,
        color: active ? COLORS.cyan : COLORS.text,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {children}
    </button>
  )
}

export default function BatteryStatus({
  externalPower = null,
}) {
  const [capacity, setCapacity] = useState(
    DEFAULTS.capacity
  )
  const [voltage, setVoltage] = useState(
    DEFAULTS.voltage
  )
  const [power, setPower] = useState(
    DEFAULTS.power
  )
  const [efficiency, setEfficiency] = useState(
    DEFAULTS.efficiency
  )
  const [reserve, setReserve] = useState(
    DEFAULTS.reserve
  )

  const [level, setLevel] = useState(100)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (
      externalPower !== null &&
      Number.isFinite(Number(externalPower)) &&
      Number(externalPower) > 0
    ) {
      setPower(Number(externalPower))
    }
  }, [externalPower])

  const nominalEnergy =
    (capacity * voltage) / 1000

  const usableEnergy =
    nominalEnergy *
    (efficiency / 100) *
    (1 - reserve / 100)

  const remainingEnergy =
    usableEnergy * (level / 100)

  const remainingHours =
    power > 0 ? remainingEnergy / power : 0

  const dischargePerSecond =
    usableEnergy > 0 && power > 0
      ? (power / 60 / usableEnergy) * 100 *
        SIMULATED_MINUTES_PER_SECOND
      : 0

  useEffect(() => {
    if (!running || dischargePerSecond <= 0) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setLevel((previous) =>
        Math.max(0, previous - dischargePerSecond)
      )
    }, 1000)

    return () => window.clearInterval(interval)
  }, [running, dischargePerSecond])

  useEffect(() => {
    if (level <= 0 && running) {
      setRunning(false)
    }
  }, [level, running])

  function resetSimulation() {
    setRunning(false)
    setLevel(100)
  }

  const batteryColor =
    level > 50
      ? COLORS.green
      : level > 20
        ? COLORS.yellow
        : COLORS.red

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
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            color: COLORS.pink,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1.2,
            marginBottom: 8,
          }}
        >
          ADITI / BATTERY SIMULATION
        </div>

        <h2
          style={{
            fontSize: 'clamp(18px, 4vw, 25px)',
            margin: '0 0 10px',
          }}
        >
          Simulated Battery Status
        </h2>

        <p
          style={{
            color: COLORS.muted,
            fontSize: 12,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Watch an illustrative battery discharge
          based on estimated power consumption.
          One real second represents one simulated minute.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 14,
          marginBottom: 24,
        }}
      >
        <div
          role="progressbar"
          aria-label="Simulated battery level"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(level)}
          style={{
            width: 'min(100%, 340px)',
            height: 110,
            padding: 9,
            border: `3px solid ${batteryColor}`,
            borderRadius: 17,
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: `${level}%`,
              height: '100%',
              background: batteryColor,
              borderRadius: 7,
              transition: 'width 450ms linear',
              opacity: 0.85,
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 29,
              fontWeight: 900,
              color: '#fff',
              textShadow: '0 2px 6px #000',
            }}
          >
            {level.toFixed(0)}%
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: batteryColor,
            letterSpacing: 1,
          }}
        >
          {level <= 0
            ? 'SIMULATED BATTERY DEPLETED'
            : running
              ? 'SIMULATION RUNNING'
              : 'SIMULATION PAUSED'}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 170px), 1fr))',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <Metric
          label="Estimated Remaining Energy"
          value={`${remainingEnergy.toFixed(2)} Wh`}
          color={COLORS.cyan}
        />

        <Metric
          label="Estimated Time Remaining"
          value={formatTime(remainingHours)}
          color={COLORS.green}
        />

        <Metric
          label="Assumed System Power"
          value={`${power.toFixed(2)} W`}
          color={COLORS.pink}
        />

        <Metric
          label="Usable Energy at Full Charge"
          value={`${usableEnergy.toFixed(2)} Wh`}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 22,
        }}
      >
        <ActionButton
          active={running}
          disabled={level <= 0}
          onClick={() =>
            setRunning((previous) => !previous)
          }
        >
          {running ? 'Ⅱ Pause' : '▶ Start'}
        </ActionButton>

        <ActionButton onClick={resetSimulation}>
          ↺ Reset
        </ActionButton>
      </div>

      <div
        style={{
          padding: 15,
          borderRadius: 11,
          background: COLORS.panel,
          border: `1px solid ${COLORS.border}`,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: COLORS.pink,
            marginBottom: 14,
          }}
        >
          SIMULATION PARAMETERS
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 170px), 1fr))',
            gap: 12,
          }}
        >
          {[
            {
              label: 'Capacity (mAh)',
              value: capacity,
              set: setCapacity,
              min: 100,
              max: 100000,
            },
            {
              label: 'Nominal Voltage (V)',
              value: voltage,
              set: setVoltage,
              min: 0.1,
              max: 60,
            },
            {
              label: 'Average Power (W)',
              value: power,
              set: setPower,
              min: 0.01,
              max: 500,
            },
            {
              label: 'Efficiency (%)',
              value: efficiency,
              set: setEfficiency,
              min: 1,
              max: 100,
            },
            {
              label: 'Reserve (%)',
              value: reserve,
              set: setReserve,
              min: 0,
              max: 99,
            },
          ].map((field) => (
            <label
              key={field.label}
              style={{
                display: 'block',
                fontSize: 11,
                color: COLORS.muted,
              }}
            >
              {field.label}

              <input
                type="number"
                min={field.min}
                max={field.max}
                step="any"
                value={field.value}
                onChange={(event) => {
                  const value = Number(event.target.value)

                  if (
                    event.target.value !== '' &&
                    Number.isFinite(value) &&
                    value >= field.min &&
                    value <= field.max
                  ) {
                    field.set(value)
                  }
                }}
                style={{
                  display: 'block',
                  marginTop: 7,
                  width: '100%',
                  minHeight: 44,
                  padding: 10,
                  borderRadius: 8,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.background,
                  color: COLORS.text,
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
              />
            </label>
          ))}
        </div>
      </div>

      <p
        style={{
          fontSize: 11,
          lineHeight: 1.7,
          color: COLORS.muted,
          margin: 0,
        }}
      >
        This is a conceptual simulation, not live
        battery monitoring. Actual runtime depends
        on the selected battery, hardware load,
        temperature, and electrical losses.
        The displayed level represents remaining
        modeled usable energy, not physical cell
        state of charge.
      </p>
    </section>
  )
}
