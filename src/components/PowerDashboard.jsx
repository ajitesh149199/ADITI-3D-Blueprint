
import { useMemo, useState } from 'react'

import {
  POWER_COMPONENTS,
  POWER_PROFILES,
  DEFAULT_BATTERY,
} from '../data/powerData'

import {
  calculatePower,
  calculateBattery,
  calculateSavings,
} from '../utils/powerCalculations'

const panel = {
  padding: 18,
  borderRadius: 12,
  border: '1px solid rgba(148,163,184,0.24)',
  background: 'rgba(13,18,35,0.92)',
  minWidth: 0,
}

const field = {
  width: '100%',
  boxSizing: 'border-box',
  padding: 9,
  borderRadius: 8,
  background: '#100e20',
  color: '#f8fafc',
  border: '1px solid #475569',
}

const button = (active = false) => ({
  padding: '9px 13px',
  borderRadius: 8,
  cursor: 'pointer',
  background: active ? 'rgba(34,211,238,0.18)' : '#1c1930',
  color: active ? '#67e8f9' : '#f8fafc',
  border: `1px solid ${active ? '#22d3ee' : '#475569'}`,
})

function Metric({ label, value, note }) {
  return (
    <div style={panel}>
      <div style={{ color: '#94a3b8', fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>
        {value}
      </div>
      {note && (
        <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 6 }}>
          {note}
        </div>
      )}
    </div>
  )
}

export default function PowerDashboard() {
  const [profileKey, setProfileKey] = useState('obstacle')
  const [components, setComponents] = useState(POWER_COMPONENTS)
  const [battery, setBattery] = useState(DEFAULT_BATTERY)
  const [enabled, setEnabled] = useState(
    POWER_PROFILES.obstacle.enabled
  )

  const profile = POWER_PROFILES[profileKey]

  const result = useMemo(
    () => calculatePower(
      components,
      enabled,
      profile.processingFactor
    ),
    [components, enabled, profile.processingFactor]
  )

  const batteryResult = useMemo(
    () => calculateBattery(battery, result.totalWatts),
    [battery, result.totalWatts]
  )

  const comparisons = Object.entries(POWER_PROFILES).map(
    ([key, value]) => ({
      key,
      name: value.name,
      watts: calculatePower(
        components,
        value.enabled,
        value.processingFactor
      ).totalWatts,
    })
  )

  const generalWatts =
    comparisons.find((item) => item.key === 'general')?.watts || 0

  const savings = calculateSavings(
    generalWatts,
    result.totalWatts
  )

  const updateBattery = (key, value) => {
    setBattery((previous) => ({
      ...previous,
      [key]: Number(value),
    }))
  }

  const updateWatts = (id, value) => {
    setComponents((previous) =>
      previous.map((component) =>
        component.id === id
          ? { ...component, watts: Math.max(0, Number(value) || 0) }
          : component
      )
    )
  }

  const chooseProfile = (key) => {
    setProfileKey(key)
    setEnabled([...POWER_PROFILES[key].enabled])
  }

  const maxComparison = Math.max(
    1,
    ...comparisons.map((item) => item.watts)
  )

  return (
    <div style={{ display: 'grid', gap: 18, color: '#f8fafc' }}>
      <div style={panel}>
        <div style={{ color: '#22d3ee', fontSize: 11, fontWeight: 800 }}>
          ADITI / PHASE 10.5.14H
        </div>

        <h2 style={{ margin: '10px 0' }}>
          Energy Management Simulator
        </h2>

        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>
          Explore a conceptual power model for ADITI.
          Component loads, runtime, and savings are estimates,
          not measured prototype performance.
        </p>
      </div>

      <div style={panel}>
        <h3>Operating Mode</h3>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(POWER_PROFILES).map(([key, value]) => (
            <button
              key={key}
              type="button"
              style={button(profileKey === key)}
              onClick={() => chooseProfile(key)}
            >
              {value.name}
            </button>
          ))}
        </div>

        <p style={{ color: '#94a3b8', fontSize: 12 }}>
          {profile.description}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        <Metric
          label="Estimated Load"
          value={`${result.totalWatts.toFixed(2)} W`}
        />

        <Metric
          label="Available Battery Energy"
          value={`${batteryResult.availableWh.toFixed(2)} Wh`}
        />

        <Metric
          label="Estimated Runtime"
          value={
            batteryResult.runtimeHours === null
              ? 'N/A'
              : `${batteryResult.runtimeHours.toFixed(2)} h`
          }
        />

        <Metric
          label="Mode-Based Savings"
          value={`${savings.toFixed(1)}%`}
          note="Relative to the general-assistance profile"
        />
      </div>

      <div style={panel}>
        <h3>H.1 — Conceptual Power Distribution</h3>

        <div
          style={{
            textAlign: 'center',
            padding: 14,
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid #22c55e',
            borderRadius: 10,
          }}
        >
          Battery System
        </div>

        <div style={{ textAlign: 'center', padding: 10, color: '#22d3ee' }}>
          ↓
        </div>

        <div
          style={{
            textAlign: 'center',
            padding: 14,
            borderRadius: 10,
            border: '1px solid #a78bfa',
          }}
        >
          Protection & Voltage Regulation
        </div>

        <div style={{ textAlign: 'center', padding: 10, color: '#22d3ee' }}>
          ↓
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 10,
          }}
        >
          {['Processing', 'Input', 'Output', 'Controls'].map((group) => {
            const watts = result.breakdown
              .filter((component) => component.group === group)
              .reduce((sum, component) => sum + component.effectiveWatts, 0)

            return (
              <div
                key={group}
                style={{
                  ...panel,
                  textAlign: 'center',
                  padding: 12,
                }}
              >
                <strong>{group}</strong>
                <p style={{ color: '#67e8f9', marginBottom: 0 }}>
                  {watts.toFixed(2)} W
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div style={panel}>
        <h3>H.2 — Component Power Consumption</h3>

        <p style={{ color: '#94a3b8', fontSize: 12 }}>
          Change provisional wattages and enable or disable modules.
          The Raspberry Pi processing factor varies by operating mode.
          Intermittent loads are simplified as enabled loads; actual
          duty cycles have not yet been measured.
        </p>

        <div style={{ display: 'grid', gap: 10 }}>
          {components
            .filter((component) => component.id !== 'battery')
            .map((component) => {
              const active = enabled.includes(component.id)
              const effective = result.breakdown.find(
                (item) => item.id === component.id
              )?.effectiveWatts || 0

              return (
                <div
                  key={component.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(125px, 1fr) 90px 80px',
                    gap: 10,
                    alignItems: 'center',
                    paddingBottom: 10,
                    borderBottom: '1px solid rgba(148,163,184,0.15)',
                  }}
                >
                  <label style={{ fontSize: 12 }}>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(event) => {
                        setEnabled((previous) =>
                          event.target.checked
                            ? [...previous, component.id]
                            : previous.filter((id) => id !== component.id)
                        )
                      }}
                    />{' '}
                    {component.name}
                  </label>

                  <input
                    aria-label={`${component.name} watts`}
                    type="number"
                    min="0"
                    step="0.05"
                    value={component.watts}
                    onChange={(event) =>
                      updateWatts(component.id, event.target.value)
                    }
                    style={field}
                  />

                  <strong style={{ textAlign: 'right', fontSize: 12 }}>
                    {effective.toFixed(2)} W
                  </strong>
                </div>
              )
            })}
        </div>
      </div>

      <div style={panel}>
        <h3>H.3–H.4 — Battery Configuration & Runtime</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
          }}
        >
          {[
            ['capacityMah', 'Capacity (mAh)', 100, 100000],
            ['voltage', 'Nominal voltage (V)', 1, 30],
            ['usablePercent', 'Usable capacity (%)', 0, 100],
            ['efficiencyPercent', 'Conversion efficiency (%)', 0, 100],
          ].map(([key, label, min, max]) => (
            <label key={key} style={{ fontSize: 12 }}>
              {label}
              <input
                type="number"
                min={min}
                max={max}
                step={key === 'voltage' ? 0.1 : 1}
                value={battery[key]}
                onChange={(event) =>
                  updateBattery(
                    key,
                    Math.min(max, Math.max(min, Number(event.target.value) || 0))
                  )
                }
                style={{ ...field, marginTop: 6 }}
              />
            </label>
          ))}
        </div>

        <p style={{ color: '#94a3b8', fontSize: 12 }}>
          Nominal energy: {batteryResult.nominalWh.toFixed(2)} Wh
        </p>

        <p style={{ color: '#67e8f9', fontSize: 13 }}>
          Estimated available energy: {batteryResult.availableWh.toFixed(2)} Wh
        </p>

        <p style={{ color: '#94a3b8', fontSize: 12 }}>
          Runtime = available energy ÷ estimated average system load.
          Real runtime also depends on workload, battery discharge
          characteristics, temperature, and power conversion losses.
        </p>
      </div>

      <div style={panel}>
        <h3>H.5–H.6 — Operating Mode Comparison</h3>

        <div style={{ display: 'grid', gap: 15 }}>
          {comparisons.map((item) => (
            <div key={item.key}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                <span>{item.name}</span>
                <strong>{item.watts.toFixed(2)} W</strong>
              </div>

              <div
                style={{
                  height: 12,
                  background: '#1e293b',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(item.watts / maxComparison) * 100}%`,
                    height: '100%',
                    background: item.key === profileKey
                      ? '#22d3ee'
                      : '#a78bfa',
                    borderRadius: 10,
                    transition: 'width 250ms ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 18 }}>
          These comparisons use the defined mode profiles. Manual
          checkbox changes affect the current load, but do not
          redefine the saved comparison profiles.
        </p>
      </div>

      <div style={panel}>
        <h3>H.7 — Engineering Validation Status</h3>

        <p style={{ fontSize: 12, lineHeight: 1.8, color: '#cbd5e1' }}>
          <strong>Model status:</strong> Conceptual
          <br />
          <strong>Power data:</strong> Provisional
          <br />
          <strong>Battery model:</strong> Simplified energy estimate
          <br />
          <strong>Physical measurements:</strong> Pending
          <br />
          <strong>Component compatibility:</strong> Pending final hardware selection
        </p>

        <button
          type="button"
          style={button()}
          onClick={() => {
            setComponents(POWER_COMPONENTS)
            setBattery(DEFAULT_BATTERY)
            chooseProfile('obstacle')
          }}
        >
          ↺ Reset Energy Model
        </button>
      </div>
    </div>
  )
}
