
import { useState } from 'react'

const COMPONENTS = [
  {
    id: 'battery',
    name: 'Battery Pack',
    category: 'Power Source',
    icon: '🔋',
    description:
      'Stores electrical energy for the proposed ADITI glasses system.',
    note: 'Capacity, cell chemistry, and protection circuitry will be selected during hardware planning.',
  },
  {
    id: 'management',
    name: 'Power Management',
    category: 'Power Regulation',
    icon: '⚡',
    description:
      'Represents battery protection, regulated voltage rails, and safe power distribution.',
    note: 'Actual regulator and protection requirements depend on the selected hardware.',
  },
  {
    id: 'compute',
    name: 'Computing Unit',
    category: 'Main Load',
    icon: '🖥️',
    description:
      'Provides electrical power demand for onboard processing and AI workloads.',
    note: 'Power consumption depends on the selected processor and workload.',
  },
  {
    id: 'camera',
    name: 'Camera',
    category: 'Sensor',
    icon: '📷',
    description:
      'Captures visual information for the proposed vision pipeline.',
    note: 'Power requirements depend on the camera module and operating mode.',
  },
  {
    id: 'imu',
    name: 'IMU',
    category: 'Sensor',
    icon: '🧭',
    description:
      'Measures acceleration and rotational motion.',
    note: 'Power consumption depends on sampling rate and sensor configuration.',
  },
  {
    id: 'gps',
    name: 'GPS Module',
    category: 'Sensor',
    icon: '📍',
    description:
      'Provides satellite-based positioning information.',
    note: 'Power demand varies with acquisition and tracking modes.',
  },
  {
    id: 'microphone',
    name: 'Microphone',
    category: 'Sensor',
    icon: '🎤',
    description:
      'Captures audio signals for supported assistance features.',
    note: 'Actual consumption depends on the microphone and audio interface.',
  },
  {
    id: 'audio',
    name: 'Audio Output',
    category: 'Feedback',
    icon: '🔊',
    description:
      'Delivers spoken feedback and other audio notifications.',
    note: 'Power demand varies with volume, amplifier, and speaker selection.',
  },
  {
    id: 'haptic',
    name: 'Haptic Output',
    category: 'Feedback',
    icon: '📳',
    description:
      'Provides vibration-based notifications.',
    note: 'A suitable driver and supply must be selected for the actuator.',
  },
  {
    id: 'visual',
    name: 'Visual Output',
    category: 'Feedback',
    icon: '👁️',
    description:
      'Represents an optional visual interface or external display.',
    note: 'An external phone or laptop may have its own separate power supply.',
  },
]

const C = {
  background: '#110b1b',
  panel: '#1b1129',
  border: '#51355e',
  cyan: '#22d3ee',
  pink: '#f472b6',
  green: '#34d399',
  text: '#f5f0fa',
  muted: '#b7a9c6',
}

function ComponentCard({ component, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(component.id)}
      aria-pressed={selected}
      style={{
        width: '100%',
        minWidth: 0,
        minHeight: 94,
        padding: 13,
        borderRadius: 12,
        background: selected
          ? 'rgba(34,211,238,0.12)'
          : C.panel,
        border: `1px solid ${
          selected ? C.cyan : C.border
        }`,
        color: C.text,
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontSize: 23, marginBottom: 9 }}>
        {component.icon}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 5,
        }}
      >
        {component.name}
      </div>
      <div style={{ fontSize: 10, color: C.muted }}>
        {component.category}
      </div>
    </button>
  )
}

function Arrow({ label }) {
  return (
    <div
      aria-label={label}
      style={{
        textAlign: 'center',
        color: C.cyan,
        padding: '9px 0',
        fontSize: 20,
      }}
    >
      ↓
    </div>
  )
}

function Group({ title, ids, selectedId, onSelect }) {
  return (
    <div
      style={{
        border: `1px solid ${C.border}`,
        borderRadius: 13,
        padding: 13,
        minWidth: 0,
      }}
    >
      <div
        style={{
          color: C.pink,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 1,
          marginBottom: 12,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 145px), 1fr))',
          gap: 10,
        }}
      >
        {ids.map((id) => {
          const component = COMPONENTS.find(
            (item) => item.id === id
          )

          return (
            <ComponentCard
              key={id}
              component={component}
              selected={selectedId === id}
              onSelect={onSelect}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function PowerDiagram() {
  const [selectedId, setSelectedId] = useState('battery')

  const selected = COMPONENTS.find(
    (component) => component.id === selectedId
  )

  return (
    <section
      style={{
        background: C.background,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: 'clamp(12px, 3vw, 22px)',
        color: C.text,
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            color: C.pink,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1.2,
          }}
        >
          ADITI / POWER SYSTEM
        </div>

        <h2
          style={{
            fontSize: 'clamp(18px, 4vw, 25px)',
            margin: '10px 0',
          }}
        >
          Power Distribution Architecture
        </h2>

        <p
          style={{
            fontSize: 12,
            lineHeight: 1.7,
            color: C.muted,
          }}
        >
          Explore the proposed electrical power path.
          Select any component to inspect its role.
        </p>
      </div>

      <Group
        title="01 / POWER SOURCE"
        ids={['battery']}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <Arrow label="Power flows to management stage" />

      <Group
        title="02 / POWER MANAGEMENT"
        ids={['management']}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <Arrow label="Regulated power is distributed to loads" />

      <Group
        title="03 / COMPUTING SYSTEM"
        ids={['compute']}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <Arrow label="Other regulated power branches" />

      <Group
        title="04 / SENSOR MODULES"
        ids={['camera', 'imu', 'gps', 'microphone']}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <Arrow label="Other regulated power branches" />

      <Group
        title="05 / FEEDBACK MODULES"
        ids={['audio', 'haptic', 'visual']}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <div
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 12,
          background: C.panel,
          border: `1px solid ${C.cyan}70`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: C.cyan,
            marginBottom: 10,
          }}
        >
          SELECTED COMPONENT
        </div>

        <h3 style={{ fontSize: 17, margin: '0 0 10px' }}>
          {selected.icon} {selected.name}
        </h3>

        <p
          style={{
            fontSize: 12,
            lineHeight: 1.7,
            color: C.text,
          }}
        >
          {selected.description}
        </p>

        <div
          style={{
            padding: 12,
            borderRadius: 9,
            background: C.background,
            fontSize: 11,
            lineHeight: 1.7,
            color: C.muted,
          }}
        >
          {selected.note}
        </div>
      </div>

      <p
        style={{
          marginTop: 18,
          color: C.muted,
          fontSize: 11,
          lineHeight: 1.7,
        }}
      >
        Conceptual diagram only. Actual wiring,
        voltage regulation, battery protection,
        and power requirements must be validated
        against the selected hardware specifications.
        Computing, sensor, and feedback loads are
        separate branches of the regulated power
        system; the vertical layout does not imply
        they are electrically connected in series.
      </p>
    </section>
  )
}
