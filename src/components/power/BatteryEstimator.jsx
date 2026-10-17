
import { useState } from 'react'

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

const FIELD_STYLE = {
  width: '100%',
  minHeight: 44,
  padding: '10px 12px',
  borderRadius: 9,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.background,
  color: COLORS.text,
  fontSize: 14,
  boxSizing: 'border-box',
}

function NumericField({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step,
}) {
  return (
    <label style={{ display: 'block', minWidth: 0 }}>
      <span
        style={{
          display: 'block',
          marginBottom: 8,
          fontSize: 12,
          color: COLORS.muted,
        }}
      >
        {label} ({unit})
      </span>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) =>
          onChange(event.target.value)
        }
        style={FIELD_STYLE}
      />
    </label>
  )
}

function ResultCard({ label, value, unit, accent }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.panel,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: COLORS.muted,
          marginBottom: 10,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 'clamp(19px, 4vw, 27px)',
          fontWeight: 800,
          color: accent,
          overflowWrap: 'anywhere',
        }}
      >
        {value}
        <span
          style={{
            fontSize: 12,
            marginLeft: 6,
            fontWeight: 500,
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  )
}

export default function BatteryEstimator({
  externalPower = null,
}) {
  const [capacity, setCapacity] = useState('3000')
  const [voltage, setVoltage] = useState('3.7')
  const [power, setPower] = useState('5')
  const [lastExternalPower, setLastExternalPower] =
  useState(null)

if (
  externalPower !== null &&
  externalPower !== lastExternalPower
) {
  setLastExternalPower(externalPower)
  setPower(String(externalPower))
}
  const [efficiency, setEfficiency] = useState('85')
  const [reserve, setReserve] = useState('10')

  const capacityValue = Number(capacity)
  const voltageValue = Number(voltage)
  const powerValue = Number(power)
  const efficiencyValue = Number(efficiency)
  const reserveValue = Number(reserve)

  const valid =
    Number.isFinite(capacityValue) &&
    capacityValue > 0 &&
    capacityValue <= 100000 &&
    Number.isFinite(voltageValue) &&
    voltageValue > 0 &&
    voltageValue <= 60 &&
    Number.isFinite(powerValue) &&
    powerValue > 0 &&
    powerValue <= 500 &&
    Number.isFinite(efficiencyValue) &&
    efficiencyValue > 0 &&
    efficiencyValue <= 100 &&
    Number.isFinite(reserveValue) &&
    reserveValue >= 0 &&
    reserveValue < 100

  const energyWh = valid
    ? (capacityValue * voltageValue) / 1000
    : 0

  const usableWh = valid
    ? energyWh *
      (efficiencyValue / 100) *
      (1 - reserveValue / 100)
    : 0

  const runtimeHours = valid
    ? usableWh / powerValue
    : 0

  const runtimeMinutes = runtimeHours * 60

  function reset() {
    setCapacity('3000')
    setVoltage('3.7')
    setPower('5')
    setEfficiency('85')
    setReserve('10')
  }

  function format(value, digits = 2) {
    return valid ? value.toFixed(digits) : '—'
  }

  return (
    <section
      style={{
        width: '100%',
        minWidth: 0,
        padding: 'clamp(12px, 3vw, 22px)',
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.background,
        color: COLORS.text,
        boxSizing: 'border-box',
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
          ADITI / POWER PLANNING
        </div>

        <h2
          style={{
            margin: '0 0 10px',
            fontSize: 'clamp(18px, 4vw, 25px)',
          }}
        >
          Battery Runtime Estimator
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: 12,
            lineHeight: 1.7,
            color: COLORS.muted,
          }}
        >
          Adjust the hypothetical battery and load values
          to estimate operating time.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <NumericField
          label="Battery Capacity"
          unit="mAh"
          value={capacity}
          onChange={setCapacity}
          min="1"
          max="100000"
          step="100"
        />

        <NumericField
          label="Nominal Battery Voltage"
          unit="V"
          value={voltage}
          onChange={setVoltage}
          min="0.1"
          max="60"
          step="0.1"
        />

        <NumericField
          label="Average System Power"
          unit="W"
          value={power}
          onChange={setPower}
          min="0.1"
          max="500"
          step="0.1"
        />

        <NumericField
          label="Conversion Efficiency"
          unit="%"
          value={efficiency}
          onChange={setEfficiency}
          min="1"
          max="100"
          step="1"
        />

        <NumericField
          label="Energy Reserve"
          unit="%"
          value={reserve}
          onChange={setReserve}
          min="0"
          max="99"
          step="1"
        />
      </div>

      {!valid && (
        <p
          role="alert"
          style={{
            color: '#fda4af',
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          Enter valid positive values within the
          indicated limits.
        </p>
      )}

      <button
        type="button"
        onClick={reset}
        style={{
          minHeight: 44,
          padding: '10px 18px',
          marginBottom: 22,
          borderRadius: 9,
          border: `1px solid ${COLORS.cyan}`,
          background: 'rgba(34,211,238,0.1)',
          color: COLORS.cyan,
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        ↺ Reset Values
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
          gap: 12,
        }}
      >
        <ResultCard
          label="Nominal Battery Energy"
          value={format(energyWh)}
          unit="Wh"
          accent={COLORS.cyan}
        />

        <ResultCard
          label="Estimated Usable Energy"
          value={format(usableWh)}
          unit="Wh"
          accent={COLORS.pink}
        />

        <ResultCard
          label="Estimated Runtime"
          value={format(runtimeHours)}
          unit="hours"
          accent={COLORS.green}
        />

        <ResultCard
          label="Estimated Runtime"
          value={format(runtimeMinutes, 0)}
          unit="minutes"
          accent={COLORS.green}
        />
      </div>

      <div
        style={{
          marginTop: 20,
          padding: 14,
          borderRadius: 11,
          background: COLORS.panel,
          fontSize: 12,
          lineHeight: 1.8,
          color: COLORS.muted,
        }}
      >
        <strong style={{ color: COLORS.text }}>
          Calculation model
        </strong>

        <div style={{ marginTop: 8 }}>
          Nominal energy = capacity × nominal voltage / 1000
        </div>

        <div>
          Usable energy = nominal energy × efficiency ×
          (1 − reserve fraction)
        </div>

        <div>
          Runtime = usable energy / average system power
        </div>
      </div>

      <p
        style={{
          marginTop: 16,
          marginBottom: 0,
          fontSize: 11,
          lineHeight: 1.7,
          color: COLORS.muted,
        }}
      >
        These results are planning estimates, not measured
        battery performance. Real runtime depends on battery
        characteristics, temperature, workload variation,
        regulator losses, and hardware configuration.
        The default values are illustrative, not confirmed
        ADITI hardware specifications.
      </p>
    </section>
  )
}
