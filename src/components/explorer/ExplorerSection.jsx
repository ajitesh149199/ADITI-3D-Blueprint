
import { useMemo, useRef, useState } from 'react'
import { ContactShadows } from '@react-three/drei'

import { GltfAsset } from '../../models/GltfAsset'
import {
  CATEGORY_META,
  COMPONENTS,
  getComponent,
  modelUrl,
} from '../../models/registry'

import { useApp } from '../../state/AppContext'
import { ErrorBoundary } from '../viewer/ErrorBoundary'
import {
  FitOnLoad,
  ViewerControls,
  ExplorerCamera,
} from '../viewer/FramedModel'
import { SceneCanvas } from '../viewer/SceneCanvas'
import { TechnicalInfoPanel } from './TechnicalInfoPanel'
import HardwareInteractionDashboard from '../HardwareInteractionDashboard'

// ============================================================
// ADITI 3D BLUEPRINT
// PHASE 7 — CONSOLIDATED HARDWARE INTEGRATION
//
// All connections and power paths are proposed logical
// relationships, not verified electrical wiring.
// ============================================================


const COLORS = {
  // ADITI Companion theme
  magenta: '#ff007a',
  cyan: '#00e7ee',
  blue: '#ff007a',
  green: '#34d399',
  amber: '#fbbf24',
  purple: '#c084fc',

  // Typography
  text: '#f5f0fa',
  muted: '#a99db8',

  // Panels and borders
  border: 'rgba(255,0,122,0.24)',
  panel: 'rgba(12,7,22,0.96)',
  card: 'rgba(20,11,32,0.94)',
}


const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  ...Object.entries(CATEGORY_META).map(([id, meta]) => ({
    id,
    label: meta.label,
  })),
]

const CAMERA_VIEWS = [
  { id: 'default', label: '3D' },
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'left', label: 'Left' },
  { id: 'right', label: 'Right' },
  { id: 'top', label: 'Top' },
  { id: 'bottom', label: 'Bottom' },
]

const BLUEPRINT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'connections', label: 'Connections' },
  { id: 'power', label: 'Power' },
  { id: 'tracing', label: 'Sensor Paths' },
  { id: 'validation', label: 'Validation' },
]

// ============================================================
// PROPOSED COMPONENT RELATIONSHIPS
//
// The IDs refer to actual entries in src/models/registry.js.
// Grouped GLBs remain grouped.
// ============================================================

const CONNECTIONS = [
  {
    from: 'hw02',
    to: 'hw01',
    type: 'data',
    label: 'Camera frames',
    interface: 'Compatible camera connection',
  },
  {
    from: 'hw20',
    to: 'hw15_23_28',
    type: 'data',
    label: 'Distance readings',
    interface: 'Proposed I2C connection',
  },
  {
    from: 'hw19',
    to: 'hw15_23_28',
    type: 'data',
    label: 'GNSS location data',
    interface: 'Module-dependent serial connection',
  },
  {
    from: 'hw18_21_22',
    to: 'hw15_23_28',
    type: 'data',
    label: 'IMU motion data',
    interface: 'Module-dependent digital connection',
  },
  {
    from: 'hw07_08_09',
    to: 'hw15_23_28',
    type: 'data',
    label: 'Microphone input',
    interface: 'Compatible audio input',
  },
  {
    from: 'hw15_23_28',
    to: 'hw01',
    type: 'data',
    label: 'Peripheral observations',
    interface: 'Compatible host interfaces',
  },
  {
    from: 'hw01',
    to: 'hw07_08_09',
    type: 'feedback',
    label: 'Audio output commands',
    interface: 'Compatible audio output and amplifier',
  },
  {
    from: 'hw01',
    to: 'hw18_21_22',
    type: 'feedback',
    label: 'Haptic output commands',
    interface: 'Compatible haptic driver control',
  },
  {
    from: 'hw10_11_12',
    to: 'hw01',
    type: 'control',
    label: 'User button events',
    interface: 'Suitable digital input',
  },
  {
    from: 'hw01',
    to: 'hw10_11_12',
    type: 'control',
    label: 'Status indication',
    interface: 'Suitable digital output',
  },
  {
    from: 'hw05_06',
    to: 'hw01',
    type: 'power',
    label: 'Regulated computing supply',
    interface: 'Voltage/current to be verified',
  },
  {
    from: 'hw05_06',
    to: 'hw02',
    type: 'power',
    label: 'Camera power',
    interface: 'Power requirements to be verified',
  },
  {
    from: 'hw05_06',
    to: 'hw15_23_28',
    type: 'power',
    label: 'Interface supply',
    interface: 'Voltage compatibility to be verified',
  },
  {
    from: 'hw05_06',
    to: 'hw19',
    type: 'power',
    label: 'GNSS supply',
    interface: 'Module requirements to be verified',
  },
  {
    from: 'hw05_06',
    to: 'hw20',
    type: 'power',
    label: 'ToF supply',
    interface: 'Module requirements to be verified',
  },
  {
    from: 'hw05_06',
    to: 'hw18_21_22',
    type: 'power',
    label: 'IMU and haptic supply',
    interface: 'Driver and sensor rails to be verified',
  },
  {
    from: 'hw05_06',
    to: 'hw07_08_09',
    type: 'power',
    label: 'Audio subsystem supply',
    interface: 'Amplifier requirements to be verified',
  },
  {
    from: 'hw05_06',
    to: 'hw10_11_12',
    type: 'power',
    label: 'Indicator supply',
    interface: 'LED and control requirements to be verified',
  },
]

// ============================================================
// PROPOSED SENSOR-TO-FEEDBACK PATHS
// ============================================================

const SENSOR_PATHS = [
  {
    id: 'vision',
    title: 'Vision → Audio Guidance',
    source: 'hw02',
    destination: 'hw07_08_09',
    objective: 'Object recognition and text reading',
    stages: [
      'Camera Module 3',
      'Raspberry Pi Zero 2 W',
      'Fusion Engine',
      'Relevance Engine',
      'Suppression Engine',
      'Output Manager',
      'Audio Subsystem',
    ],
    note: 'The decision stages are software modules. This is a proposed execution path, not a live inference trace.',
  },
  {
    id: 'obstacle',
    title: 'Distance → Haptic Feedback',
    source: 'hw20',
    destination: 'hw18_21_22',
    objective: 'Obstacle awareness',
    stages: [
      'VL53L1X Time-of-Flight',
      'Hardware Interfaces',
      'Raspberry Pi Zero 2 W',
      'Fusion Engine',
      'Relevance Engine',
      'Suppression Engine',
      'Output Manager',
      'Haptic Driver',
      'Haptic Actuator',
    ],
    note: 'Obstacle warnings require independent real-world reliability and latency testing.',
  },
  {
    id: 'motion',
    title: 'Motion → Context Processing',
    source: 'hw18_21_22',
    destination: 'hw01',
    objective: 'Head movement and orientation awareness',
    stages: [
      'IMU',
      'Hardware Interfaces',
      'Raspberry Pi Zero 2 W',
      'Fusion Engine',
      'Relevance Engine',
    ],
    note: 'The IMU shares a GLB with haptic hardware; its physical interface is not verified.',
  },
  {
    id: 'navigation',
    title: 'GNSS → Audio Guidance',
    source: 'hw19',
    destination: 'hw07_08_09',
    objective: 'Location-aware assistance',
    stages: [
      'GNSS M10 + Antenna',
      'Hardware Interfaces',
      'Raspberry Pi Zero 2 W',
      'Fusion Engine',
      'Relevance Engine',
      'Output Manager',
      'Audio Subsystem',
    ],
    note: 'GNSS is unsuitable as the sole source of precise obstacle avoidance.',
  },
  {
    id: 'voice',
    title: 'Microphone → Processing',
    source: 'hw07_08_09',
    destination: 'hw01',
    objective: 'Voice and audio input',
    stages: [
      'Microphone',
      'Hardware Interfaces',
      'Raspberry Pi Zero 2 W',
      'ADITI Context Processing',
    ],
    note: 'Audio input and output share one grouped GLB in the registry.',
  },
]

// ============================================================
// POWER DESIGN — NO UNVERIFIED NUMERIC VALUES
// ============================================================

const POWER_REQUIREMENTS = [
  {
    id: 'hw01',
    supply: 'Regulated computing power',
    concern: 'Peak processing current and thermal performance',
  },
  {
    id: 'hw02',
    supply: 'Camera-compatible supply',
    concern: 'Camera and host interface compatibility',
  },
  {
    id: 'hw20',
    supply: 'ToF-module-compatible supply',
    concern: 'I2C logic voltage and module requirements',
  },
  {
    id: 'hw19',
    supply: 'GNSS-module-compatible supply',
    concern: 'Receiver and antenna module requirements',
  },
  {
    id: 'hw18_21_22',
    supply: 'IMU and haptic-driver supplies',
    concern: 'Actuator current and sensor logic compatibility',
  },
  {
    id: 'hw07_08_09',
    supply: 'Audio subsystem supply',
    concern: 'Amplifier load and peak audio current',
  },
  {
    id: 'hw10_11_12',
    supply: 'Controls and indicators supply',
    concern: 'LED current limiting and input compatibility',
  },
  {
    id: 'hw15_23_28',
    supply: 'Interface-dependent power',
    concern: 'Voltage conversion and signal compatibility',
  },
]

// ============================================================
// SHARED UTILITIES
// ============================================================

function componentName(id) {
  return getComponent(id)?.name ?? id
}

function connectionColor(type) {
  if (type === 'power') return COLORS.green
  if (type === 'feedback') return COLORS.purple
  if (type === 'control') return COLORS.amber
  return COLORS.cyan
}

function getRelationships(id, type = 'all') {
  return CONNECTIONS.filter((connection) => {
    const matchingType =
      type === 'all' || connection.type === type

    return matchingType &&
      (connection.from === id || connection.to === id)
  })
}

function validateBlueprint() {
  const issues = []
  const warnings = []
  const ids = COMPONENTS.map((item) => item.id)
  const known = new Set(ids)
  const edgeKeys = new Set()

  if (known.size !== ids.length) {
    issues.push('Duplicate hardware registry IDs found.')
  }

  for (const item of COMPONENTS) {
    if (!item.fileId || !modelUrl(item.fileId)) {
      issues.push(`${item.name}: missing model registry reference.`)
    }

    if (!item.hardwareId) {
      issues.push(`${item.name}: missing hardware identification.`)
    }
  }

  for (const connection of CONNECTIONS) {
    if (!known.has(connection.from)) {
      issues.push(`Unknown connection source: ${connection.from}`)
    }

    if (!known.has(connection.to)) {
      issues.push(`Unknown connection destination: ${connection.to}`)
    }

    if (connection.from === connection.to) {
      issues.push(`Self-referencing connection: ${connection.from}`)
    }

    const key =
      `${connection.from}:${connection.to}:${connection.type}`

    if (edgeKeys.has(key)) {
      issues.push(`Duplicate connection: ${key}`)
    }

    edgeKeys.add(key)
  }

  for (const item of COMPONENTS) {
    if (item.id === 'glasses') continue

    if (!getRelationships(item.id).length) {
      issues.push(`${item.name}: no logical relationships defined.`)
    }
  }

  for (const path of SENSOR_PATHS) {
    if (!known.has(path.source) || !known.has(path.destination)) {
      issues.push(`${path.title}: invalid hardware reference.`)
    }

    if (!path.stages.length) {
      issues.push(`${path.title}: empty trace.`)
    }
  }

  for (const item of POWER_REQUIREMENTS) {
    if (!known.has(item.id)) {
      issues.push(`Unknown power consumer: ${item.id}`)
    }
  }

  warnings.push(
    'GLB asset existence and individual mesh identity are not verified by these checks.'
  )

  warnings.push(
    'Electrical wiring, battery capacity, regulator suitability and operating temperature require physical validation.'
  )

  warnings.push(
    'Grouped GLBs do not guarantee that every internal part can be selected separately.'
  )

  return {
    issues: [...new Set(issues)],
    warnings,
    hardware: COMPONENTS.length,
    connections: CONNECTIONS.length,
    paths: SENSOR_PATHS.length,
    powerConsumers: POWER_REQUIREMENTS.length,
  }
}

// ============================================================
// REUSABLE UI
// ============================================================

const panelStyle = {
  background: COLORS.panel,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 12,
  padding: 15,
  color: COLORS.text,
}

const labelStyle = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1,
  textTransform: 'uppercase',
  color: COLORS.muted,
}

function SectionTitle({ children, color = COLORS.cyan }) {
  return (
    <div
      style={{
        ...labelStyle,
        color,
        margin: '18px 0 10px',
      }}
    >
      {children}
    </div>
  )
}

function BlueprintButton({
  children,
  onClick,
  active = false,
  color = COLORS.cyan,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: '8px 11px',
        borderRadius: 8,
        background: active ? `${color}18` : COLORS.card,
        border: `1px solid ${
          active ? color : COLORS.border
        }`,
        color: active ? color : COLORS.text,
        fontSize: 10,
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function InfoCard({ title, children, color = COLORS.cyan }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 9,
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        marginBottom: 9,
      }}
    >
      <div
        style={{
          color,
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 7,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: COLORS.muted,
          fontSize: 11,
          lineHeight: 1.75,
        }}
      >
        {children}
      </div>
    </div>
  )
}

function HardwareLink({ id, onSelect, detail }) {
  const item = getComponent(id)
  if (!item) return null

  const color =
    CATEGORY_META[item.category]?.color ?? COLORS.cyan

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      style={{
        display: 'block',
        width: '100%',
        padding: 11,
        textAlign: 'left',
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 9,
        cursor: 'pointer',
        marginBottom: 7,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <strong style={{ color: COLORS.text, fontSize: 11 }}>
          {item.name}
        </strong>

        <span style={{ color, fontSize: 10 }}>
          {item.hardwareId}
        </span>
      </div>

      <div
        style={{
          color: COLORS.muted,
          fontSize: 10,
          lineHeight: 1.6,
          marginTop: 5,
        }}
      >
        {detail ?? item.role}
      </div>

      <div
        style={{
          color,
          fontSize: 10,
          fontWeight: 700,
          marginTop: 7,
        }}
      >
        VIEW 3D MODEL →
      </div>
    </button>
  )
}

// ============================================================
// PHASE 7.1 / 7.2 / 7.3 — INTEGRATION OVERVIEW
// ============================================================

function OverviewTab({ spec, onSelect }) {
  const related = getRelationships(spec.id)

  return (
    <>
      <div style={{ ...labelStyle, color: COLORS.cyan }}>
        PHASE 7 / HARDWARE INTEGRATION
      </div>

      <h3 style={{ fontSize: 18, margin: '9px 0' }}>
        {spec.name}
      </h3>

      <p
        style={{
          color: COLORS.muted,
          fontSize: 11,
          lineHeight: 1.8,
        }}
      >
        {spec.details}
      </p>

      <InfoCard title="Hardware Identification">
        <strong style={{ color: COLORS.text }}>
          {spec.hardwareId}
        </strong>
        {' · '}
        {spec.systemRole ?? spec.role}
      </InfoCard>

      <SectionTitle>ADITI Functions</SectionTitle>

      {(spec.functions ?? []).map((item, index) => (
        <div
          key={index}
          style={{
            padding: '8px 0',
            color: COLORS.text,
            fontSize: 11,
            lineHeight: 1.7,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <span style={{ color: COLORS.green }}>✓ </span>
          {item}
        </div>
      ))}

      {spec.grouped && (
        <>
          <SectionTitle>Grouped GLB Components</SectionTitle>

          {(spec.groupedParts ?? []).map((part) => (
            <InfoCard key={part.id} title={part.name}>
              {part.role}
            </InfoCard>
          ))}
        </>
      )}

      <SectionTitle>
        Related Hardware ({related.length})
      </SectionTitle>

      {related.length ? (
        related.map((connection, index) => {
          const other =
            connection.from === spec.id
              ? connection.to
              : connection.from

          return (
            <HardwareLink
              key={`${connection.type}-${index}`}
              id={other}
              detail={`${connection.type.toUpperCase()}: ${connection.label}`}
              onSelect={onSelect}
            />
          )
        })
      ) : (
        <p style={{ color: COLORS.muted, fontSize: 11 }}>
          The assembly is a structural model rather than
          a separate electronic data-flow node.
        </p>
      )}
    </>
  )
}

// ============================================================
// PHASE 7.4 — CONNECTION MAPPING
// ============================================================

function ConnectionsTab({ spec, onSelect }) {
  const [filter, setFilter] = useState('all')

  const relationships = getRelationships(spec.id, filter)

  return (
    <>
      <div style={{ ...labelStyle, color: COLORS.cyan }}>
        PHASE 7 / CONNECTION MAPPING
      </div>

      <h3 style={{ fontSize: 18 }}>
        Proposed Hardware Connections
      </h3>

      <p
        style={{
          color: COLORS.muted,
          fontSize: 11,
          lineHeight: 1.8,
        }}
      >
        Explore incoming and outgoing logical connections
        for {spec.name}. These do not establish verified
        pin assignments or electrical compatibility.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          margin: '15px 0',
        }}
      >
        {['all', 'data', 'feedback', 'control', 'power'].map(
          (type) => (
            <BlueprintButton
              key={type}
              active={filter === type}
              onClick={() => setFilter(type)}
              color={connectionColor(type)}
            >
              {type.toUpperCase()}
            </BlueprintButton>
          )
        )}
      </div>

      {relationships.map((connection, index) => {
        const outgoing = connection.from === spec.id
        const other = outgoing
          ? connection.to
          : connection.from

        return (
          <div key={`${connection.type}-${index}`}>
            <InfoCard
              title={`${outgoing ? 'OUTGOING' : 'INCOMING'} · ${connection.type.toUpperCase()}`}
              color={connectionColor(connection.type)}
            >
              <strong style={{ color: COLORS.text }}>
                {componentName(connection.from)}
              </strong>

              <div
                style={{
                  textAlign: 'center',
                  padding: 9,
                  color: connectionColor(connection.type),
                }}
              >
                ↓ {connection.label}
              </div>

              <strong style={{ color: COLORS.text }}>
                {componentName(connection.to)}
              </strong>

              <div style={{ marginTop: 10 }}>
                Proposed interface: {connection.interface}
              </div>
            </InfoCard>

            <HardwareLink
              id={other}
              onSelect={onSelect}
              detail="Inspect connected hardware"
            />
          </div>
        )
      })}

      {!relationships.length && (
        <InfoCard title="No Matching Connections" color={COLORS.amber}>
          No connections match this component and filter.
          Try another connection type.
        </InfoCard>
      )}
    </>
  )
}

// ============================================================
// PHASE 7.5 — POWER DISTRIBUTION
// ============================================================

function PowerTab({ onSelect }) {
  return (
    <>
      <div style={{ ...labelStyle, color: COLORS.green }}>
        PHASE 7 / POWER DISTRIBUTION
      </div>

      <h3 style={{ fontSize: 18 }}>
        Proposed Power Architecture
      </h3>

      <InfoCard title="Power System — HW05 / HW06" color={COLORS.green}>
        The power-system GLB represents the proposed
        battery and power-management subsystem.
        Its exact electrical configuration has not
        yet been established.
      </InfoCard>

      <div
        style={{
          padding: 14,
          borderRadius: 10,
          textAlign: 'center',
          border: `1px solid ${COLORS.green}`,
          background: `${COLORS.green}10`,
        }}
      >
        <strong style={{ color: COLORS.green, fontSize: 12 }}>
          HW05 / HW06 — POWER SYSTEM
        </strong>

        <div
          style={{
            color: COLORS.muted,
            fontSize: 10,
            marginTop: 6,
          }}
        >
          Battery / protection / regulation design pending
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          color: COLORS.green,
          padding: 12,
        }}
      >
        ↓ PROPOSED DISTRIBUTION
      </div>

      {POWER_REQUIREMENTS.map((item) => (
        <div key={item.id}>
          <HardwareLink
            id={item.id}
            onSelect={onSelect}
            detail={item.supply}
          />

          <div
            style={{
              color: COLORS.muted,
              fontSize: 10,
              lineHeight: 1.6,
              margin: '0 0 12px 5px',
            }}
          >
            Verify: {item.concern}
          </div>
        </div>
      ))}

      <SectionTitle color={COLORS.amber}>
        Required Hardware Verification
      </SectionTitle>

      <InfoCard title="Electrical Design Pending" color={COLORS.amber}>
        Confirm each module's operating voltage,
        maximum current, compatible signal levels,
        regulator capacity, thermal behavior, and
        suitable battery protection before physical
        integration.
      </InfoCard>

      <InfoCard title="Battery Runtime" color={COLORS.amber}>
        Runtime cannot be estimated reliably until
        the battery's usable capacity and the system's
        measured power consumption are known.
      </InfoCard>
    </>
  )
}

// ============================================================
// PHASE 7.6 — SENSOR DATA PATHS
// ============================================================

function TracingTab({ onSelect }) {
  const [selectedPath, setSelectedPath] = useState('vision')

  const path =
    SENSOR_PATHS.find((item) => item.id === selectedPath) ??
    SENSOR_PATHS[0]

  return (
    <>
      <div style={{ ...labelStyle, color: COLORS.purple }}>
        PHASE 7 / SENSOR DATA PATHS
      </div>

      <h3 style={{ fontSize: 18 }}>
        Sensor-to-Feedback Tracing
      </h3>

      <p
        style={{
          color: COLORS.muted,
          fontSize: 11,
          lineHeight: 1.8,
        }}
      >
        Follow proposed sensor information through
        ADITI's hardware and software pipeline.
      </p>

      <SectionTitle>Select Scenario</SectionTitle>

      <div
        style={{
          display: 'grid',
          gap: 7,
        }}
      >
        {SENSOR_PATHS.map((item) => (
          <BlueprintButton
            key={item.id}
            active={selectedPath === item.id}
            color={COLORS.purple}
            onClick={() => setSelectedPath(item.id)}
          >
            {item.title}
          </BlueprintButton>
        ))}
      </div>

      <SectionTitle>Selected Objective</SectionTitle>

      <InfoCard title={path.title} color={COLORS.purple}>
        {path.objective}
      </InfoCard>

      <SectionTitle>Proposed Processing Sequence</SectionTitle>

      {path.stages.map((stage, index) => (
        <div key={`${stage}-${index}`}>
          {index > 0 && (
            <div
              style={{
                textAlign: 'center',
                color: COLORS.purple,
                padding: 7,
                fontSize: 15,
              }}
            >
              ↓
            </div>
          )}

          <div
            style={{
              padding: 12,
              borderRadius: 9,
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 11,
            }}
          >
            <span
              style={{
                color: COLORS.purple,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>

            <span
              style={{
                color: COLORS.text,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {stage}
            </span>
          </div>
        </div>
      ))}

      <SectionTitle>Source Hardware</SectionTitle>

      <HardwareLink
        id={path.source}
        onSelect={onSelect}
      />

      <SectionTitle>Destination Hardware</SectionTitle>

      <HardwareLink
        id={path.destination}
        onSelect={onSelect}
      />

      <InfoCard title="Trace Limitation" color={COLORS.amber}>
        {path.note}
      </InfoCard>
    </>
  )
}

// ============================================================
// PHASE 7.7 / 7.8 — VALIDATION AND DASHBOARD
// ============================================================

function ValidationTab({ validation }) {
  const metrics = [
    ['Registry Components', validation.hardware],
    ['Logical Connections', validation.connections],
    ['Sensor Paths', validation.paths],
    ['Power Consumers', validation.powerConsumers],
  ]

  return (
    <>
      <div style={{ ...labelStyle, color: COLORS.cyan }}>
        PHASE 7 / DESIGN VALIDATION
      </div>

      <h3 style={{ fontSize: 18 }}>
        Hardware Blueprint Dashboard
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 8,
          marginBottom: 15,
        }}
      >
        {metrics.map(([label, value]) => (
          <div
            key={label}
            style={{
              padding: 12,
              borderRadius: 9,
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                fontSize: 23,
                fontWeight: 800,
                color: COLORS.cyan,
              }}
            >
              {value}
            </div>

            <div
              style={{
                color: COLORS.muted,
                fontSize: 10,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <InfoCard
        title={
          validation.issues.length
            ? `${validation.issues.length} Consistency Issues`
            : 'Logical Consistency Checks Passed'
        }
        color={
          validation.issues.length
            ? COLORS.amber
            : COLORS.green
        }
      >
        {validation.issues.length
          ? 'Review the detected issues below.'
          : 'All implemented registry and relationship checks passed.'}
      </InfoCard>

      <SectionTitle>Checks Performed</SectionTitle>

      {[
        'Hardware ID uniqueness',
        'Model registry references',
        'Relationship source and destination IDs',
        'Duplicate and self-referencing connections',
        'Disconnected hardware groups',
        'Sensor-path hardware references',
        'Power-consumer registry references',
      ].map((check) => (
        <div
          key={check}
          style={{
            padding: '8px 0',
            fontSize: 11,
            color: COLORS.text,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <span style={{ color: COLORS.green }}>✓ </span>
          {check}
        </div>
      ))}

      <SectionTitle>Detected Issues</SectionTitle>

      {validation.issues.length ? (
        validation.issues.map((issue, index) => (
          <InfoCard
            key={index}
            title={`Issue ${index + 1}`}
            color={COLORS.amber}
          >
            {issue}
          </InfoCard>
        ))
      ) : (
        <p
          style={{
            color: COLORS.green,
            fontSize: 11,
          }}
        >
          No logical inconsistencies detected.
        </p>
      )}

      <SectionTitle color={COLORS.amber}>
        Engineering Warnings
      </SectionTitle>

      {validation.warnings.map((warning, index) => (
        <InfoCard
          key={index}
          title={`Warning ${index + 1}`}
          color={COLORS.amber}
        >
          {warning}
        </InfoCard>
      ))}

      <InfoCard title="Project Verification Status" color={COLORS.cyan}>
        The blueprint is a conceptual integration
        interface. Passing software checks does not
        demonstrate that the glasses are physically
        assembled, electrically verified, or ready
        for independent assistive use.
      </InfoCard>
    </>
  )
}

// ============================================================
// PHASE 7 — BLUEPRINT INSPECTOR
// ============================================================

function BlueprintPanel({ spec, onSelect }) {
  const [tab, setTab] = useState('overview')

  const validation = useMemo(
    () => validateBlueprint(),
    []
  )

  return (
    <div style={panelStyle}>
      <div
        style={{
          ...labelStyle,
          color: COLORS.cyan,
          marginBottom: 13,
        }}
      >
        ADITI / INTERACTIVE INTEGRATION BLUEPRINT
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          marginBottom: 15,
          paddingBottom: 13,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        {BLUEPRINT_TABS.map((item) => (
          <BlueprintButton
            key={item.id}
            active={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </BlueprintButton>
        ))}
      </div>

      {tab === 'overview' && (
        <OverviewTab spec={spec} onSelect={onSelect} />
      )}

      {tab === 'connections' && (
        <ConnectionsTab spec={spec} onSelect={onSelect} />
      )}

      {tab === 'power' && (
        <PowerTab onSelect={onSelect} />
      )}

      {tab === 'tracing' && (
        <TracingTab onSelect={onSelect} />
      )}

      {tab === 'validation' && (
        <ValidationTab validation={validation} />
      )}
    </div>
  )
}

// ============================================================
// EXISTING 3D VIEWER — PRESERVED
// ============================================================

function IsolatedModel({
  id,
  onInspect,
  cameraView,
  viewRequest,
  autoRotate,
}) {
  const root = useRef(null)
  const spec = getComponent(id)

  return (
    <>
      <ViewerControls />

      <ExplorerCamera
        view={cameraView}
        viewRequest={viewRequest}
        autoRotate={autoRotate}
      />

      <group ref={root}>
        <GltfAsset
          url={modelUrl(spec.fileId)}
          targetSize={1.8}
          onInspect={onInspect}
        />
      </group>

      <FitOnLoad objectRef={root} margin={1.8} />

      <ContactShadows
        opacity={0.3}
        scale={6}
        blur={2.2}
        far={3.5}
        position={[0, -1.05, 0]}
      />
    </>
  )
}

// ============================================================
// MAIN COMPONENT EXPLORER — PHASE 7 COMPLETE
// ============================================================

export function ExplorerSection() {

  // Phase N — Conceptual hardware to 3D registry mapping.
// Some conceptual components share a grouped GLB model.
const PHASE_N_HARDWARE_MAP = {
  camera: 'hw02',
  imu: 'hw18_21_22',
  gps: 'hw19',
  microphone: 'hw07_08_09',
  processor: 'hw01',
  battery: 'hw05_06',
  speaker: 'hw07_08_09',
  haptic: 'hw18_21_22',
}

  const {
    selectedId,
    setSelectedId,
    inspections,
    recordInspect,
    setModelStatus,
  } = useApp()

  const [fitKey, setFitKey] = useState(0)
  
  const reloadFraming = () => {
  setFitKey((previous) => previous + 1)
  setCameraView('default')
  setViewRequest(0)
  setAutoRotate(false)
}

  const [cameraView, setCameraView] = useState('default')
  const [viewRequest, setViewRequest] = useState(0)
  const [autoRotate, setAutoRotate] = useState(false)
  const changeCameraView = (view) => {
  setCameraView(view)

  // Trigger a camera update even if the same view is selected again
  setViewRequest((previous) => previous + 1)

  // Stop automatic rotation when selecting a fixed camera angle
  setAutoRotate(false)
}

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [showBlueprint, setShowBlueprint] = useState(false)
  const toggleBlueprint = () => {
  setShowBlueprint((previous) => !previous)
}
  // Mobile hardware library
  const [mobileLibraryOpen, setMobileLibraryOpen] = useState(false)

  const spec = getComponent(selectedId) ?? COMPONENTS[0]
  const report = inspections[spec.id]

  // ----------------------------------------------------------
  // SEARCH AND FILTER
  // ----------------------------------------------------------

  const filteredComponents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return COMPONENTS.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' ||
        item.category === activeCategory

      const searchableText = [
        item.name,
        item.shortName,
        item.role,
        item.systemRole,
        item.hardwareId,
        item.category,
        CATEGORY_META[item.category]?.label,
        item.details,
        ...(item.functions ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return (
        matchesCategory &&
        searchableText.includes(query)
      )
    })
  }, [searchQuery, activeCategory])

  // ----------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------

  const clearFilters = () => {
  setSearchQuery('')
  setActiveCategory('all')
}

  const toggleTechnicalInfo = () => {
  setShowInfoPanel((previous) => !previous)
}

  const handleSelect = (id) => {
  if (!getComponent(id)) return

  setSelectedId(id)
  setCameraView('default')
  setViewRequest(0)
  setAutoRotate(false)

  // Close the mobile library after choosing a component
  setMobileLibraryOpen(false)
}

// Phase N — Synchronize dashboard and 3D viewer
  const [phaseNSelection, setPhaseNSelection] = useState('camera')

  const handlePhaseNSelect = (hardwareId) => {
  const registryId = PHASE_N_HARDWARE_MAP[hardwareId]

  setPhaseNSelection(hardwareId)

  if (registryId && getComponent(registryId)) {
    handleSelect(registryId)
  }
}


  // ----------------------------------------------------------
  // MAIN INTERFACE
  // ----------------------------------------------------------

  return (
    <section
  className="section"
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    height: 'auto',
    minHeight: '100%',
    overflow: 'visible',
  }}
>
      <div className="section-head">
        <div>
          <h2>Component explorer</h2>

          <p>
            Explore ADITI hardware in 3D, inspect
            components, trace proposed connections,
            and examine the integrated hardware blueprint.
          </p>
        </div>

        <div className="actions">
          <button
            className="btn"
            type="button"
            onClick={reloadFraming}
          >
            Reload framing
          </button>
        </div>
      </div>

     <div
  className="stage canvas-fill"
  style={{
    height: 'clamp(520px, 70vh, 760px)',
    minHeight: 520,
    flex: 'none',
    overflow: 'hidden',
    position: 'relative',
  }}
>
        
{/* MOBILE COMPONENT SELECTOR */}
<div className="aditi-explorer-mobile-selector">
  <button
    type="button"
    className="aditi-explorer-selector-button"
    aria-expanded={mobileLibraryOpen}
    onClick={() =>
      setMobileLibraryOpen((previous) => !previous)
    }
  >
    <span className="aditi-explorer-selector-text">
      <span className="aditi-explorer-selector-label">
        SELECTED COMPONENT
      </span>

      <strong>{spec.name}</strong>
    </span>

    <span aria-hidden="true">
      {mobileLibraryOpen ? '▲' : '▼'}
    </span>
  </button>
</div>

        <div
  className="split aditi-explorer-split"
  style={{
    height: '100%',
    minHeight: 0,
    minWidth: 0,
  }}
>
          {/* ==================================================
              LEFT — HARDWARE LIBRARY
          ================================================== */}

          <div
            className={`list aditi-explorer-library ${
  mobileLibraryOpen ? 'aditi-library-open' : ''
}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              minHeight: 0,
              overflowY: 'auto',
              padding: 12,
            }}
          >
            <div
              style={{
                ...labelStyle,
                color: COLORS.cyan,
              }}
            >
              Hardware Library
            </div>

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search hardware..."
              aria-label="Search ADITI hardware"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 12px',
                borderRadius: 9,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.panel,
                color: COLORS.text,
                fontSize: 12,
                outlineColor: COLORS.cyan,
              }}
            />

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
              {FILTER_OPTIONS.map((option) => (
                <BlueprintButton
                  key={option.id}
                  active={activeCategory === option.id}
                  onClick={() =>
                    setActiveCategory(option.id)
                  }
                >
                  {option.label}
                </BlueprintButton>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
                alignItems: 'center',
                color: COLORS.muted,
                fontSize: 11,
              }}
            >
              <span>
                {filteredComponents.length} of{' '}
                {COMPONENTS.length} components
              </span>

              {(searchQuery ||
                activeCategory !== 'all') && (
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: COLORS.cyan,
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 7,
              }}
            >
              {filteredComponents.map((item) => {
                const active = spec.id === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`item ${
                      active ? 'active' : ''
                    }`}
                    onClick={() =>
                      handleSelect(item.id)
                    }
                    aria-pressed={active}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      flexShrink: 0,
                      border: active
                        ? '1px solid rgba(34,211,238,0.7)'
                        : `1px solid ${COLORS.border}`,
                      borderRadius: 9,
                      background: active
                        ? 'rgba(34,211,238,0.11)'
                        : COLORS.card,
                      padding: '11px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 12,
                          color: active
                            ? COLORS.cyan
                            : COLORS.text,
                        }}
                      >
                        {item.name}
                      </h3>

                      {active && (
                        <span
                          style={{
                            color: COLORS.cyan,
                            fontSize: 14,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        margin: '5px 0 0',
                        fontSize: 10,
                        lineHeight: 1.5,
                        color: COLORS.muted,
                      }}
                    >
                      {item.role}
                    </p>

                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: 7,
                        fontSize: 9,
                        color:
                          CATEGORY_META[item.category]
                            ?.color ?? COLORS.cyan,
                        textTransform: 'uppercase',
                        letterSpacing: 0.8,
                      }}
                    >
                      {CATEGORY_META[item.category]?.label}
                    </span>
                  </button>
                )
              })}

              {!filteredComponents.length && (
                <InfoCard title="No Matching Components">
                  No hardware matches the current filters.

                  <div style={{ marginTop: 10 }}>
                    <BlueprintButton onClick={clearFilters}>
                      Show All Components
                    </BlueprintButton>
                  </div>
                </InfoCard>
              )}
            </div>
          </div>

          {/* ==================================================
              RIGHT — 3D VIEWER + BLUEPRINT PANELS
          ================================================== */}

          <div

            className="aditi-explorer-viewer"
            style={{
              position: 'relative',
              minHeight: 0,
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            {/* TOP ACTION BUTTONS */}

            <div
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 30,
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                maxWidth: 'calc(100% - 32px)',
              }}
            >
              <BlueprintButton
                active={showBlueprint}
                onClick={toggleBlueprint}
              >
                {showBlueprint
                  ? '✕ Hide Blueprint'
                  : '◇ Integration Blueprint'}
              </BlueprintButton>

              <BlueprintButton
                active={showInfoPanel}
                onClick={toggleTechnicalInfo}
              >
                {showInfoPanel
                  ? '✕ Hide Info'
                  : '☰ Technical Info'}
              </BlueprintButton>
            </div>

            {/* TECHNICAL INFORMATION PANEL */}

            <div
              id="aditi-explorer-info-panel"
              aria-hidden={!showInfoPanel}
              style={{
                position: 'absolute',
                top: 66,
                right: 16,
                bottom: 110,
                width: 'min(350px, calc(100% - 32px))',
                zIndex: 20,
                overflowY: 'auto',
                overflowX: 'hidden',
                opacity: showInfoPanel ? 1 : 0,
                visibility: showInfoPanel
                  ? 'visible'
                  : 'hidden',
                pointerEvents: showInfoPanel
                  ? 'auto'
                  : 'none',
                transform: showInfoPanel
                  ? 'translateX(0)'
                  : 'translateX(30px)',
                transition:
                  'opacity 220ms ease, transform 220ms ease, visibility 220ms ease',
                borderRadius: 12,
                scrollbarWidth: 'thin',
              }}
            >
              <TechnicalInfoPanel
                key={spec.id}
                spec={spec}
                report={report}
              />
            </div>

            {/* PHASE 7 INTEGRATION BLUEPRINT */}

            <div
              id="aditi-integration-blueprint"
              aria-hidden={!showBlueprint}
              style={{
                position: 'absolute',
                top: 66,
                right: 16,
                bottom: 110,
                width: 'min(410px, calc(100% - 32px))',
                zIndex: 21,
                overflowY: 'auto',
                overflowX: 'hidden',
                opacity: showBlueprint ? 1 : 0,
                visibility: showBlueprint
                  ? 'visible'
                  : 'hidden',
                pointerEvents: showBlueprint
                  ? 'auto'
                  : 'none',
                transform: showBlueprint
                  ? 'translateX(0)'
                  : 'translateX(30px)',
                transition:
                  'opacity 220ms ease, transform 220ms ease, visibility 220ms ease',
                borderRadius: 12,
                scrollbarWidth: 'thin',
              }}
            >
              <BlueprintPanel
                spec={spec}
                onSelect={handleSelect}
              />
            </div>

            {/* CAMERA CONTROLS */}

            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: 10,
                width: 'max-content',
                maxWidth: 'calc(100% - 24px)',
                background: 'rgba(5,12,24,0.92)',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                backdropFilter: 'blur(12px)',
              }}
            >
              <div
                style={{
                  ...labelStyle,
                  color: COLORS.cyan,
                }}
              >
                Camera Controls
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 5,
                }}
              >
                {CAMERA_VIEWS.map((item) => (
                  <BlueprintButton
                    key={item.id}
                    active={cameraView === item.id}
                    onClick={() =>
                      changeCameraView(item.id)
                    }
                  >
                    {item.label}
                  </BlueprintButton>
                ))}
              </div>

              <BlueprintButton
                active={autoRotate}
                color={COLORS.green}
                onClick={() =>
                  setAutoRotate((previous) => !previous)
                }
              >
                {autoRotate
                  ? '⟳ Auto-Rotate ON'
                  : '⟳ Auto-Rotate OFF'}
              </BlueprintButton>
            </div>

            {/* THREE.JS CANVAS */}

            <ErrorBoundary
              key={`${spec.id}-${fitKey}`}
            >
              <SceneCanvas
                camera={{
                  position: [2.2, 1.2, 3.2],
                  fov: 40,
                }}
              >
                <IsolatedModel
                  id={spec.id}
                  cameraView={cameraView}
                  viewRequest={viewRequest}
                  autoRotate={autoRotate}
                  onInspect={(result) => {
                    recordInspect(spec.id, result)
                    setModelStatus(spec.id, 'ready')
                  }}
                />
              </SceneCanvas>
            </ErrorBoundary>
                    </div>
        </div>
      </div>

      {/* PHASE N — HARDWARE INTERACTION INTEGRATION */}
      <div
        style={{
          marginTop: 24,
          width: '100%',
          minWidth: 0,
        }}
      >
        <HardwareInteractionDashboard
  selectedHardwareId={phaseNSelection}
  onSelectHardware={handlePhaseNSelect}
/>
      </div>

    </section>
  )
}