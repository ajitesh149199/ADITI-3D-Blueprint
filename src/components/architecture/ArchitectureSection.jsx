
import { useMemo, useState } from 'react'
import { ArchitectureDiagram } from './ArchitectureDiagram'

// ============================================================
// ADITI 3D BLUEPRINT — PHASE 6 COMPLETE
// System Architecture / Interactive Engineering Dashboard
// ============================================================

const LAYERS = [
  {
    id: 'sense',
    number: '01',
    title: 'SENSE',
    subtitle: 'Sensor Input Layer',
    icon: '◉',
    color: '#22d3ee',
    description:
      'Collect visual, distance, motion, location and audio observations.',
    operations: [
      'Acquire observations from available sensors',
      'Associate observations with their source',
      'Prepare sensor readings for processing',
    ],
    inputs: [
      'Environment',
      'Head movement',
      'Satellite signals',
      'Speech and ambient audio',
    ],
    outputs: [
      'Camera frames',
      'Distance readings',
      'Motion data',
      'Location estimates',
      'Audio samples',
    ],
    technical: [
      ['Role', 'Multimodal acquisition'],
      ['Hardware', 'HW02, HW20, HW18, HW19, HW07'],
      ['Verification', 'Sensor calibration, compatibility and power'],
    ],
    components: [
      {
        name: 'Camera Module 3',
        hardware: 'HW02',
        role: 'Visual scene capture',
        inputs: ['Surrounding visual scene'],
        outputs: ['Camera frames', 'Visual observations'],
        interface: 'Compatible camera interface',
        notes: 'Mounting, camera compatibility and processing latency require testing.',
      },
      {
        name: 'VL53L1X ToF',
        hardware: 'HW20',
        role: 'Nearby distance sensing',
        inputs: ['Reflected light'],
        outputs: ['Distance measurements'],
        interface: 'I2C',
        notes: 'Range, field of view and environmental limitations require testing.',
      },
      {
        name: 'IMU',
        hardware: 'HW18',
        role: 'Head motion and orientation',
        inputs: ['Head movement', 'Rotation'],
        outputs: ['Acceleration', 'Angular velocity', 'Estimated orientation'],
        interface: 'Module-dependent digital interface',
        notes: 'Calibration and orientation estimation require validation.',
      },
      {
        name: 'GNSS M10',
        hardware: 'HW19',
        role: 'Outdoor positioning',
        inputs: ['Satellite signals'],
        outputs: ['Location estimates', 'Navigation status'],
        interface: 'Module-dependent serial interface',
        notes: 'Indoor and obstructed-sky reception may be unreliable.',
      },
      {
        name: 'Microphone',
        hardware: 'HW07',
        role: 'Speech and ambient audio capture',
        inputs: ['Speech', 'Environmental sounds'],
        outputs: ['Audio samples'],
        interface: 'Module-dependent audio interface',
        notes: 'Noise handling and interface compatibility require testing.',
      },
    ],
  },
  {
    id: 'process',
    number: '02',
    title: 'PROCESS',
    subtitle: 'Edge Processing Layer',
    icon: '▣',
    color: '#38bdf8',
    description:
      'Receive and organize sensor information on the proposed edge computer.',
    operations: [
      'Receive available sensor readings',
      'Prepare observations for software modules',
      'Manage interfaces and computing resources',
    ],
    inputs: [
      'Sensor observations',
      'Peripheral signals',
      'Control events',
    ],
    outputs: [
      'Processed observations',
      'Sensor context',
      'Inputs for data fusion',
    ],
    technical: [
      ['Proposed computer', 'Raspberry Pi Zero 2 W'],
      ['Hardware', 'HW01, HW15, HW23, HW28'],
      ['Verification', 'CPU, RAM, latency, power and thermal performance'],
    ],
    components: [
      {
        name: 'Raspberry Pi Zero 2 W',
        hardware: 'HW01',
        role: 'Central edge-computing platform',
        inputs: ['Sensor observations', 'Peripheral data'],
        outputs: ['Processed observations', 'Sensor context'],
        interface: 'Compatible camera, GPIO, USB and other supported interfaces',
        notes: 'AI model performance, memory usage and thermal behavior require benchmarking.',
      },
      {
        name: 'Hardware Interfaces',
        hardware: 'HW15 / HW23 / HW28',
        role: 'Sensor and peripheral connectivity',
        inputs: ['Hardware signals'],
        outputs: ['Data delivered to the processing computer'],
        interface: 'Depends on the exact modules represented by these IDs',
        notes: 'Pin assignments, electrical levels and compatibility must be checked.',
      },
    ],
  },
  {
    id: 'decide',
    number: '03',
    title: 'DECIDE',
    subtitle: 'ADITI Decision Engine',
    icon: '◇',
    color: '#818cf8',
    description:
      'Fuse observations, evaluate relevance and risk, reduce redundant information and select feedback.',
    operations: [
      'Fuse available observations',
      'Evaluate relevance, reliability and risk',
      'Keep, delay or suppress candidate information',
      'Select appropriate output channels',
    ],
    inputs: [
      'Processed sensor context',
      'Current user objective',
      'Reliability information',
    ],
    outputs: [
      'Prioritized decisions',
      'Selected audio feedback',
      'Selected haptic feedback',
    ],
    technical: [
      ['Implementation', 'ADITI software pipeline'],
      ['Modules', 'Fusion, Relevance, Suppression, Output Manager'],
      ['Verification', 'Scenario-based accuracy, alert priority and latency'],
    ],
    components: [
      {
        name: 'Fusion Engine',
        hardware: 'Software',
        role: 'Combine available sensor context',
        inputs: ['Processed observations', 'Context'],
        outputs: ['Fused environmental context'],
        interface: 'ADITI software pipeline',
        notes: 'Fusion depends on sensor quality and synchronization.',
      },
      {
        name: 'Relevance Engine',
        hardware: 'Software',
        role: 'Evaluate relevance and reliability',
        inputs: ['Fused context', 'User objective'],
        outputs: ['Relevance', 'Reliability', 'Risk assessment'],
        interface: 'ADITI software pipeline',
        notes: 'Scoring rules require validation across representative scenarios.',
      },
      {
        name: 'Suppression Engine',
        hardware: 'Software',
        role: 'Reduce unnecessary feedback',
        inputs: ['Candidate feedback', 'Relevance and risk'],
        outputs: ['Kept, delayed or suppressed information'],
        interface: 'ADITI software pipeline',
        notes: 'Important safety alerts must remain prioritized.',
      },
      {
        name: 'Output Manager',
        hardware: 'Software',
        role: 'Select feedback channels',
        inputs: ['Approved feedback', 'Risk and objective context'],
        outputs: ['Audio commands', 'Haptic commands', 'Status commands'],
        interface: 'ADITI software-to-output integration',
        notes: 'Physical output performance must be tested independently.',
      },
    ],
  },
  {
    id: 'act',
    number: '04',
    title: 'ACT',
    subtitle: 'Feedback Output Layer',
    icon: '◈',
    color: '#34d399',
    description:
      'Deliver selected guidance through proposed audio, haptic and status hardware.',
    operations: [
      'Receive selected feedback commands',
      'Drive audio and haptic devices',
      'Provide user controls and status indication',
    ],
    inputs: [
      'Audio commands',
      'Haptic commands',
      'Status commands',
    ],
    outputs: [
      'Spoken guidance',
      'Vibration feedback',
      'Device status',
    ],
    technical: [
      ['Feedback', 'Audio, haptic and indicators'],
      ['Hardware', 'HW08, HW09, HW22, HW21, HW10–HW12'],
      ['Verification', 'Electrical compatibility, comfort and alert clarity'],
    ],
    components: [
      {
        name: 'Audio Amplifier',
        hardware: 'HW08',
        role: 'Amplify the audio signal',
        inputs: ['Audio signal'],
        outputs: ['Amplified audio'],
        interface: 'Compatible audio and power connections',
        notes: 'Electrical compatibility must be verified.',
      },
      {
        name: 'Bone-Conduction Transducer',
        hardware: 'HW09',
        role: 'Deliver spoken guidance',
        inputs: ['Amplified audio'],
        outputs: ['Bone-conduction audio'],
        interface: 'Audio driver connection',
        notes: 'Safe listening levels, comfort and clarity require testing.',
      },
      {
        name: 'Haptic Driver',
        hardware: 'HW22',
        role: 'Control vibration feedback',
        inputs: ['Haptic commands'],
        outputs: ['Actuator drive signals'],
        interface: 'Compatible control and actuator connections',
        notes: 'Driver and actuator must be electrically compatible.',
      },
      {
        name: 'Haptic Actuator',
        hardware: 'HW21',
        role: 'Provide tactile feedback',
        inputs: ['Actuator drive signals'],
        outputs: ['Vibration'],
        interface: 'Haptic driver connection',
        notes: 'Intensity and placement require usability testing.',
      },
      {
        name: 'Buttons and Indicators',
        hardware: 'HW10 / HW11 / HW12',
        role: 'User controls and status',
        inputs: ['Button actions', 'Status commands'],
        outputs: ['Control events', 'Visible status'],
        interface: 'Suitable GPIO or control interface',
        notes: 'Exact assignments will be defined during integration.',
      },
    ],
  },
]

// ============================================================
// PROPOSED LOGICAL RELATIONSHIPS
// ============================================================

const RELATIONSHIPS = [
  ['Camera Module 3', 'Raspberry Pi Zero 2 W', 'Camera frames'],
  ['VL53L1X ToF', 'Hardware Interfaces', 'Distance readings'],
  ['IMU', 'Hardware Interfaces', 'Motion readings'],
  ['GNSS M10', 'Hardware Interfaces', 'Location estimates'],
  ['Microphone', 'Hardware Interfaces', 'Audio samples'],
  ['Hardware Interfaces', 'Raspberry Pi Zero 2 W', 'Peripheral data'],
  ['Raspberry Pi Zero 2 W', 'Fusion Engine', 'Processed observations'],
  ['Fusion Engine', 'Relevance Engine', 'Fused context'],
  ['Relevance Engine', 'Suppression Engine', 'Relevance and risk assessments'],
  ['Suppression Engine', 'Output Manager', 'Approved feedback'],
  ['Output Manager', 'Audio Amplifier', 'Audio signal'],
  ['Audio Amplifier', 'Bone-Conduction Transducer', 'Amplified audio'],
  ['Output Manager', 'Haptic Driver', 'Haptic commands'],
  ['Haptic Driver', 'Haptic Actuator', 'Drive signals'],
  ['Output Manager', 'Buttons and Indicators', 'Status commands'],
  ['Buttons and Indicators', 'Raspberry Pi Zero 2 W', 'Control events'],
]

const CONNECTIONS = [
  {
    id: 'sense-process',
    from: 'sense',
    to: 'process',
    title: 'Sensor Data',
    payloads: ['Visual', 'Distance', 'Motion', 'Location', 'Audio'],
  },
  {
    id: 'process-decide',
    from: 'process',
    to: 'decide',
    title: 'Processed Context',
    payloads: ['Observations', 'Context', 'Fusion inputs'],
  },
  {
    id: 'decide-act',
    from: 'decide',
    to: 'act',
    title: 'Feedback Commands',
    payloads: ['Audio', 'Haptic', 'Status'],
  },
]

const TRACE_TARGETS = [
  'Bone-Conduction Transducer',
  'Haptic Actuator',
  'Buttons and Indicators',
]

const HARDWARE_MAPPING = [
  {
    name: 'Sensor acquisition',
    software: 'Sensor capture and input handling',
    hardware: ['Camera Module 3', 'VL53L1X ToF', 'IMU', 'GNSS M10', 'Microphone'],
  },
  {
    name: 'Edge processing',
    software: 'Sensor preprocessing and runtime execution',
    hardware: ['Raspberry Pi Zero 2 W', 'Hardware Interfaces'],
  },
  {
    name: 'ADITI decision pipeline',
    software: 'Fusion, relevance, suppression and output selection',
    hardware: ['Raspberry Pi Zero 2 W'],
  },
  {
    name: 'Audio feedback',
    software: 'Output Manager and audio delivery',
    hardware: ['Audio Amplifier', 'Bone-Conduction Transducer'],
  },
  {
    name: 'Haptic feedback',
    software: 'Output Manager and vibration control',
    hardware: ['Haptic Driver', 'Haptic Actuator'],
  },
  {
    name: 'Controls and status',
    software: 'Input handling and status management',
    hardware: ['Buttons and Indicators'],
  },
]

const TABS = [
  ['overview', 'Overview'],
  ['components', 'Components'],
  ['flow', 'Data Flow'],
  ['technical', 'Technical'],
]

const MODES = [
  ['inspector', 'Inspector'],
  ['trace', 'Flow Tracing'],
  ['mapping', 'HW / SW Mapping'],
  ['validation', 'Validation'],
  ['dashboard', 'Dashboard'],
]


const C = {
  // ADITI Companion backgrounds
  bg: 'rgba(12,7,22,0.96)',
  panel: 'rgba(20,11,32,0.94)',

  // Magenta panel borders
  border: 'rgba(255,0,122,0.24)',

  // Typography
  text: '#f5f0fa',
  muted: '#a99db8',

  // Technical indicators
  cyan: '#00e7ee',
  green: '#34d399',
  amber: '#fbbf24',
  magenta: '#ff007a',
}


const panel = {
  background: C.bg,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: 18,
  minWidth: 0,
}

const smallLabel = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1.1,
  textTransform: 'uppercase',
  color: C.muted,
}

const buttonBase = {
  borderRadius: 8,
  padding: '9px 12px',
  cursor: 'pointer',
  fontSize: 11,
  fontWeight: 700,
  transition: 'background 150ms ease, border-color 150ms ease',
}

function lookup(name) {
  for (const layer of LAYERS) {
    const component = layer.components.find(x => x.name === name)
    if (component) return { layer, component }
  }
  return null
}

function unique(items) {
  return [...new Set(items)]
}

function getNeighbors(name, direction) {
  return RELATIONSHIPS
    .filter(r => direction === 'up' ? r[1] === name : r[0] === name)
    .map(r => ({
      name: direction === 'up' ? r[0] : r[1],
      data: r[2],
    }))
}

// Shortest directed logical path.
// Cycles are handled using a visited set.
function findPath(start, target) {
  if (!lookup(start) || !lookup(target)) return []
  if (start === target) return [start]

  const queue = [[start]]
  const visited = new Set([start])

  while (queue.length) {
    const path = queue.shift()
    const current = path[path.length - 1]

    for (const next of getNeighbors(current, 'down')) {
      if (visited.has(next.name)) continue

      const newPath = [...path, next.name]
      if (next.name === target) return newPath

      visited.add(next.name)
      queue.push(newPath)
    }
  }

  return []
}

function validateArchitecture() {
  const issues = []
  const names = LAYERS.flatMap(l => l.components.map(c => c.name))
  const nameSet = new Set(names)

  if (nameSet.size !== names.length) {
    issues.push('Duplicate component names detected.')
  }

  for (const layer of LAYERS) {
    if (!layer.components.length) {
      issues.push(`${layer.title} has no defined components.`)
    }

    for (const component of layer.components) {
      if (!component.inputs.length || !component.outputs.length) {
        issues.push(`${component.name} has missing input/output metadata.`)
      }
      if (!component.hardware || !component.interface) {
        issues.push(`${component.name} has incomplete component metadata.`)
      }
    }
  }

  const edgeKeys = new Set()

  for (const [from, to] of RELATIONSHIPS) {
    if (!nameSet.has(from)) {
      issues.push(`Unknown source component: ${from}`)
    }
    if (!nameSet.has(to)) {
      issues.push(`Unknown destination component: ${to}`)
    }
    if (from === to) {
      issues.push(`Self-reference: ${from}`)
    }

    const key = `${from}→${to}`
    if (edgeKeys.has(key)) {
      issues.push(`Duplicate relationship: ${key}`)
    }
    edgeKeys.add(key)
  }

  for (const connection of CONNECTIONS) {
    if (!LAYERS.some(l => l.id === connection.from)) {
      issues.push(`Unknown source layer: ${connection.from}`)
    }
    if (!LAYERS.some(l => l.id === connection.to)) {
      issues.push(`Unknown destination layer: ${connection.to}`)
    }
  }

  const unreachable = names.filter(name => {
    const inbound = getNeighbors(name, 'up')
    const outbound = getNeighbors(name, 'down')
    return inbound.length === 0 && outbound.length === 0
  })

  for (const name of unreachable) {
    issues.push(`Unconnected component: ${name}`)
  }

  const warnings = []

  if (!nameSet.has('Power Management')) {
    warnings.push(
      'Power management (HW05 / HW06) is referenced but not yet represented as a dedicated component.'
    )
  }

  warnings.push(
    'Logical consistency checks do not verify wiring, hardware compatibility, runtime accuracy or assistive safety.'
  )

  return {
    issues: unique(issues),
    warnings,
    layers: LAYERS.length,
    components: names.length,
    relationships: RELATIONSHIPS.length,
  }
}

// ============================================================
// SHARED UI
// ============================================================

function Heading({ children, color = C.muted }) {
  return (
    <div style={{ ...smallLabel, color, margin: '19px 0 10px' }}>
      {children}
    </div>
  )
}

function Chips({ items, color = C.cyan }) {
  return (
    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          style={{
            padding: '7px 10px',
            borderRadius: 7,
            fontSize: 10,
            lineHeight: 1.5,
            color,
            background: `${color}12`,
            border: `1px solid ${color}35`,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function ItemList({ items, color = C.cyan }) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {items.map((item, i) => (
        <div
          key={`${i}-${item}`}
          style={{
            display: 'flex',
            gap: 12,
            padding: 11,
            borderRadius: 9,
            background: C.panel,
            border: `1px solid ${C.border}`,
            color: C.text,
            fontSize: 12,
            lineHeight: 1.7,
          }}
        >
          <span style={{ color, fontWeight: 700 }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          {item}
        </div>
      ))}
    </div>
  )
}

function ActionButton({
  children,
  onClick,
  active = false,
  color = C.cyan,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      style={{
        ...buttonBase,
        background: active ? `${color}18` : C.panel,
        border: `1px solid ${active ? color : C.border}`,
        color: active ? color : C.text,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function ComponentCard({
  name,
  onClick,
  selected = false,
  detail,
}) {
  const result = lookup(name)
  if (!result) return null

  const { component, layer } = result

  return (
    <button
      type="button"
      onClick={() => onClick(name)}
      aria-pressed={selected}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: 12,
        borderRadius: 9,
        background: selected ? `${layer.color}20` : C.panel,
        border: `1px solid ${selected ? layer.color : C.border}`,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <strong style={{ color: C.text, fontSize: 12 }}>
          {component.name}
        </strong>
        <span style={{ color: layer.color, fontSize: 10 }}>
          {component.hardware}
        </span>
      </div>

      <div
        style={{
          color: C.muted,
          fontSize: 11,
          lineHeight: 1.6,
          marginTop: 6,
        }}
      >
        {detail || component.role}
      </div>

      <div
        style={{
          color: layer.color,
          fontSize: 10,
          fontWeight: 700,
          marginTop: 8,
        }}
      >
        {layer.title} · INSPECT →
      </div>
    </button>
  )
}

// ============================================================
// COMPONENT INSPECTOR WITH RELATIONSHIPS
// ============================================================

function ComponentDetails({ name, onBack, onNavigate, onTrace }) {
  const result = lookup(name)
  if (!result) return null

  const { layer, component } = result
  const upstream = getNeighbors(name, 'up')
  const downstream = getNeighbors(name, 'down')

  return (
    <div>
      <ActionButton onClick={onBack} color={layer.color}>
        ← Back to Components
      </ActionButton>

      <div
        style={{
          marginTop: 15,
          padding: 15,
          borderRadius: 11,
          background: `${layer.color}12`,
          border: `1px solid ${layer.color}55`,
        }}
      >
        <div style={{ ...smallLabel, color: layer.color }}>
          COMPONENT DETAIL INSPECTOR
        </div>

        <h3 style={{ color: C.text, fontSize: 18, margin: '9px 0' }}>
          {component.name}
        </h3>

        <Chips
          items={[component.hardware, `${layer.title} SUBSYSTEM`]}
          color={layer.color}
        />
      </div>

      <Heading>Primary Function</Heading>
      <p style={{ color: C.text, fontSize: 12, lineHeight: 1.8 }}>
        {component.role}
      </p>

      <Heading>Intended Inputs</Heading>
      <Chips items={component.inputs} color={layer.color} />

      <Heading>Intended Outputs</Heading>
      <Chips items={component.outputs} color={layer.color} />

      <Heading>Proposed Interface</Heading>
      <p style={{ color: C.text, fontSize: 12, lineHeight: 1.8 }}>
        {component.interface}
      </p>

      <Heading>Engineering Considerations</Heading>
      <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.8 }}>
        {component.notes}
      </p>

      <Heading color={C.cyan}>
        ↑ Upstream Dependencies ({upstream.length})
      </Heading>

      <div style={{ display: 'grid', gap: 8 }}>
        {upstream.length ? upstream.map(item => (
          <ComponentCard
            key={item.name}
            name={item.name}
            detail={`Provides: ${item.data}`}
            onClick={onNavigate}
          />
        )) : (
          <p style={{ color: C.muted, fontSize: 11 }}>
            No upstream component defined.
          </p>
        )}
      </div>

      <Heading color={C.cyan}>
        ↓ Downstream Connections ({downstream.length})
      </Heading>

      <div style={{ display: 'grid', gap: 8 }}>
        {downstream.length ? downstream.map(item => (
          <ComponentCard
            key={item.name}
            name={item.name}
            detail={`Receives: ${item.data}`}
            onClick={onNavigate}
          />
        )) : (
          <p style={{ color: C.muted, fontSize: 11 }}>
            No downstream component defined.
          </p>
        )}
      </div>

      <div style={{ marginTop: 18 }}>
        <ActionButton onClick={() => onTrace(name)} active>
          ◎ Trace Data Flow From Here →
        </ActionButton>
      </div>

      <p
        style={{
          color: C.muted,
          fontSize: 11,
          lineHeight: 1.7,
          marginTop: 18,
        }}
      >
        Relationships describe intended logical dependencies,
        not verified physical connections.
      </p>
    </div>
  )
}

// ============================================================
// TABBED SUBSYSTEM INSPECTOR
// ============================================================

function SubsystemInspector({
  layer,
  tab,
  setTab,
  selectedComponent,
  onSelectComponent,
  onBack,
  onTrace,
}) {
  return (
    <>
      <div style={{ ...smallLabel, color: layer.color }}>
        ADITI / SUBSYSTEM INSPECTOR
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16 }}>
        <div
          style={{
            width: 46,
            height: 46,
            flexShrink: 0,
            borderRadius: 10,
            background: `${layer.color}14`,
            border: `1px solid ${layer.color}40`,
            color: layer.color,
            display: 'grid',
            placeItems: 'center',
            fontSize: 25,
          }}
        >
          {layer.icon}
        </div>

        <div>
          <div style={{ ...smallLabel, color: layer.color }}>
            LAYER {layer.number}
          </div>
          <h3 style={{ color: C.text, margin: '4px 0', fontSize: 19 }}>
            {layer.title}
          </h3>
          <div style={{ color: C.muted, fontSize: 11 }}>
            {layer.subtitle}
          </div>
        </div>
      </div>

      <div
        role="tablist"
        aria-label={`${layer.title} inspector tabs`}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          margin: '18px 0 12px',
          paddingBottom: 12,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {TABS.map(([id, label]) => (
          <ActionButton
            key={id}
            active={tab === id}
            color={layer.color}
            onClick={() => setTab(id)}
          >
            {label}
          </ActionButton>
        ))}
      </div>

      <div role="tabpanel" aria-label={tab}>
        {tab === 'overview' && (
          <>
            <Heading>Subsystem Purpose</Heading>
            <p style={{ color: C.text, fontSize: 12, lineHeight: 1.8 }}>
              {layer.description}
            </p>
            <Heading>Responsibilities</Heading>
            <ItemList items={layer.operations} color={layer.color} />
            <Heading>Intended Outputs</Heading>
            <Chips items={layer.outputs} color={layer.color} />
          </>
        )}

        {tab === 'components' && (
          selectedComponent ? (
            <ComponentDetails
              name={selectedComponent}
              onBack={onBack}
              onNavigate={onSelectComponent}
              onTrace={onTrace}
            />
          ) : (
            <>
              <Heading>
                Associated Components ({layer.components.length})
              </Heading>
              <div style={{ display: 'grid', gap: 8 }}>
                {layer.components.map(component => (
                  <ComponentCard
                    key={component.name}
                    name={component.name}
                    onClick={onSelectComponent}
                  />
                ))}
              </div>
            </>
          )
        )}

        {tab === 'flow' && (
          <>
            <Heading>Incoming Information</Heading>
            <Chips items={layer.inputs} color={layer.color} />
            <Heading>Intended Operations</Heading>
            <ItemList items={layer.operations} color={layer.color} />
            <Heading>Outgoing Information</Heading>
            <Chips items={layer.outputs} color={layer.color} />
          </>
        )}

        {tab === 'technical' && (
          <>
            <Heading>Technical Design Information</Heading>
            <div style={{ display: 'grid', gap: 8 }}>
              {layer.technical.map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    padding: 12,
                    borderRadius: 9,
                    background: C.panel,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ ...smallLabel, color: layer.color }}>
                    {label}
                  </div>
                  <p
                    style={{
                      color: C.text,
                      fontSize: 12,
                      lineHeight: 1.7,
                      marginBottom: 0,
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

// ============================================================
// ANIMATED CONNECTIONS
// ============================================================

function DataFlowConnection({
  connection,
  highlighted,
  visible,
  playing,
  onClick,
}) {
  if (!visible) {
    return <div aria-hidden="true" style={{ height: 18 }} />
  }

  const color = highlighted ? C.cyan : '#64748b'

  return (
    <button
      type="button"
      onClick={() => onClick(connection.id)}
      aria-label={`Inspect ${connection.title} connection`}
      style={{
        width: '100%',
        minHeight: 128,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        opacity: highlighted ? 1 : 0.65,
      }}
    >
      <div
        style={{
          width: 30,
          height: 76,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 15,
          background: C.panel,
          border: `1px solid ${color}66`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 6,
            bottom: 6,
            width: 2,
            transform: 'translateX(-50%)',
            background: `linear-gradient(transparent,${color},transparent)`,
          }}
        />

        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="aditi-flow-particle"
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              marginLeft: -6,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: highlighted ? '#a5f3fc' : '#94a3b8',
              boxShadow: highlighted ? `0 0 12px ${C.cyan}` : 'none',
              animationDelay: `${i * -0.55}s`,
              animationPlayState: playing ? 'running' : 'paused',
            }}
          />
        ))}
      </div>

      <span style={{ color, fontSize: 18 }}>▼</span>
      <strong style={{ color, fontSize: 11 }}>
        {connection.title}
      </strong>
      <span
        style={{
          color: playing ? C.green : C.amber,
          fontSize: 9,
          fontWeight: 700,
        }}
      >
        {playing ? '● FLOWING' : 'Ⅱ PAUSED'}
      </span>
    </button>
  )
}

function ConnectionInspector({ connection, onDestination }) {
  return (
    <>
      <div style={{ ...smallLabel, color: C.cyan }}>
        ADITI / CONNECTION INSPECTOR
      </div>

      <h3 style={{ color: C.text, fontSize: 19 }}>
        {connection.title}
      </h3>

      <Chips
        items={[
          connection.from.toUpperCase(),
          '→',
          connection.to.toUpperCase(),
        ]}
      />

      <Heading>Intended Information Flow</Heading>
      <Chips items={connection.payloads} />

      <div style={{ marginTop: 22 }}>
        <ActionButton onClick={onDestination} active>
          Inspect Destination Layer →
        </ActionButton>
      </div>
    </>
  )
}

// ============================================================
// DATA-FLOW TRACING
// ============================================================

function TraceInspector({
  source,
  target,
  setSource,
  setTarget,
  path,
  onNavigate,
}) {
  const names = LAYERS.flatMap(layer =>
    layer.components.map(component => component.name)
  )

  const selectStyle = {
    width: '100%',
    padding: 11,
    borderRadius: 8,
    background: '#0f172a',
    border: `1px solid ${C.border}`,
    color: C.text,
    fontSize: 12,
  }

  return (
    <>
      <div style={{ ...smallLabel, color: C.cyan }}>
        ADITI / DATA-FLOW TRACER
      </div>

      <h3 style={{ color: C.text, fontSize: 19 }}>
        Trace Component Information
      </h3>

      <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.8 }}>
        Select a source and destination to visualize the
        shortest proposed directed information path.
      </p>

      <Heading>Source Component</Heading>
      <select
        value={source}
        onChange={e => setSource(e.target.value)}
        style={selectStyle}
      >
        {names.map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>

      <Heading>Destination Component</Heading>
      <select
        value={target}
        onChange={e => setTarget(e.target.value)}
        style={selectStyle}
      >
        {names.map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>

      <Heading>Trace Result</Heading>

      <div
        style={{
          padding: 12,
          borderRadius: 9,
          background: C.panel,
          border: `1px solid ${C.border}`,
          color: path.length ? C.green : C.amber,
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {path.length
          ? `● PATH FOUND — ${path.length} components`
          : '● NO DIRECTED PATH FOUND'}
      </div>

      {path.length > 0 && (
        <div style={{ display: 'grid', gap: 7, marginTop: 16 }}>
          {path.map((name, i) => {
            const result = lookup(name)
            const edge = i > 0
              ? RELATIONSHIPS.find(
                  r => r[0] === path[i - 1] && r[1] === name
                )
              : null

            return (
              <div key={`${name}-${i}`}>
                {edge && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '7px 0',
                      color: C.muted,
                      fontSize: 10,
                    }}
                  >
                    ↓ {edge[2]}
                  </div>
                )}

                <ComponentCard
                  name={name}
                  selected
                  detail={`${result.layer.title} · Stage ${i + 1}`}
                  onClick={onNavigate}
                />
              </div>
            )
          })}
        </div>
      )}

      <p
        style={{
          marginTop: 18,
          color: C.muted,
          fontSize: 11,
          lineHeight: 1.7,
        }}
      >
        This trace is derived from the proposed relationship
        graph. It does not represent live sensor telemetry,
        measured latency or guaranteed execution order.
      </p>
    </>
  )
}

// ============================================================
// HARDWARE / SOFTWARE MAPPING
// ============================================================

function MappingInspector({ onNavigate }) {
  return (
    <>
      <div style={{ ...smallLabel, color: C.cyan }}>
        ADITI / HARDWARE–SOFTWARE MAPPING
      </div>

      <h3 style={{ color: C.text, fontSize: 19 }}>
        Subsystem Dependencies
      </h3>

      <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.8 }}>
        Explore the proposed hardware supporting each
        software function. These are conceptual associations,
        not confirmed wiring assignments.
      </p>

      <div style={{ display: 'grid', gap: 13 }}>
        {HARDWARE_MAPPING.map(entry => (
          <div
            key={entry.name}
            style={{
              padding: 13,
              borderRadius: 11,
              background: C.panel,
              border: `1px solid ${C.border}`,
            }}
          >
            <strong style={{ color: C.cyan, fontSize: 12 }}>
              {entry.name}
            </strong>

            <p
              style={{
                color: C.muted,
                fontSize: 11,
                lineHeight: 1.7,
              }}
            >
              {entry.software}
            </p>

            <div style={{ display: 'grid', gap: 7 }}>
              {entry.hardware.map(name => (
                <ComponentCard
                  key={name}
                  name={name}
                  onClick={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Heading>Power Support</Heading>
      <p style={{ color: C.muted, fontSize: 11, lineHeight: 1.7 }}>
        HW05 / HW06 power-management elements are referenced
        in the overall design but remain outside the current
        component relationship graph.
      </p>
    </>
  )
}

// ============================================================
// ARCHITECTURE VALIDATION
// ============================================================

function ValidationInspector({ result }) {
  return (
    <>
      <div style={{ ...smallLabel, color: C.cyan }}>
        ADITI / ARCHITECTURE VALIDATION
      </div>

      <h3 style={{ color: C.text, fontSize: 19 }}>
        Logical Consistency Checks
      </h3>

      <div
        style={{
          padding: 16,
          borderRadius: 11,
          background: result.issues.length
            ? 'rgba(251,191,36,0.08)'
            : 'rgba(52,211,153,0.08)',
          border: `1px solid ${
            result.issues.length ? C.amber : C.green
          }55`,
        }}
      >
        <strong
          style={{
            color: result.issues.length ? C.amber : C.green,
            fontSize: 13,
          }}
        >
          {result.issues.length
            ? `${result.issues.length} consistency issue(s) found`
            : '✓ Defined architecture consistency checks passed'}
        </strong>
      </div>

      <Heading>Checks Performed</Heading>
      <ItemList
        color={C.cyan}
        items={[
          'Layer and component definitions',
          'Duplicate component identifiers',
          'Missing input/output metadata',
          'Relationship source and destination references',
          'Duplicate and self-referencing relationships',
          'Disconnected component detection',
          'Layer connection references',
        ]}
      />

      <Heading>Detected Issues</Heading>

      {result.issues.length ? (
        <ItemList items={result.issues} color={C.amber} />
      ) : (
        <p style={{ color: C.green, fontSize: 12 }}>
          No issues detected by the implemented checks.
        </p>
      )}

      <Heading>Engineering Warnings</Heading>
      <ItemList items={result.warnings} color={C.amber} />

      <p
        style={{
          color: C.muted,
          fontSize: 11,
          lineHeight: 1.7,
          marginTop: 18,
        }}
      >
        A passing result does not establish physical safety,
        correct electrical wiring, real-time performance,
        accessibility or readiness for unsupervised use.
      </p>
    </>
  )
}

// ============================================================
// FINAL ARCHITECTURE DASHBOARD
// ============================================================

function DashboardInspector({ validation, onNavigate }) {
  const stats = [
    ['Architecture Layers', validation.layers],
    ['Defined Components', validation.components],
    ['Logical Relationships', validation.relationships],
    ['Consistency Issues', validation.issues.length],
  ]

  return (
    <>
      <div style={{ ...smallLabel, color: C.cyan }}>
        ADITI / PHASE 6 DASHBOARD
      </div>

      <h3 style={{ color: C.text, fontSize: 19 }}>
        Architecture Summary
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 9,
        }}
      >
        {stats.map(([label, value]) => (
          <div
            key={label}
            style={{
              padding: 13,
              borderRadius: 10,
              background: C.panel,
              border: `1px solid ${C.border}`,
            }}
          >
            <div style={{ color: C.cyan, fontSize: 24, fontWeight: 800 }}>
              {value}
            </div>
            <div style={{ color: C.muted, fontSize: 10 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <Heading>Subsystem Breakdown</Heading>

      {LAYERS.map(layer => (
        <div
          key={layer.id}
          style={{
            padding: 12,
            borderRadius: 9,
            background: C.panel,
            border: `1px solid ${C.border}`,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              color: layer.color,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {layer.number} / {layer.title}
          </div>
          <div style={{ color: C.text, fontSize: 11, marginTop: 6 }}>
            {layer.subtitle}
          </div>
          <div style={{ color: C.muted, fontSize: 10, marginTop: 6 }}>
            {layer.components.length} components
          </div>
        </div>
      ))}

      <Heading>Architecture Entry Points</Heading>

      <div style={{ display: 'grid', gap: 8 }}>
        {['Camera Module 3', 'Fusion Engine', 'Output Manager'].map(name => (
          <ComponentCard
            key={name}
            name={name}
            onClick={onNavigate}
          />
        ))}
      </div>

      <Heading>Project Status</Heading>
      <Chips
        items={[
          'Conceptual architecture',
          'Interactive inspection',
          'Logical tracing',
          'Component mapping',
          'Consistency validation',
        ]}
        color={C.green}
      />
    </>
  )
}

// ============================================================
// MAIN ARCHITECTURE SECTION
// ============================================================

export function ArchitectureDashboard() {
  const [selectedLayer, setSelectedLayer] = useState('sense')
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const [mode, setMode] = useState('inspector')
  const [showConnections, setShowConnections] = useState(true)
  const [animationPlaying, setAnimationPlaying] = useState(true)

  const [traceSource, setTraceSource] = useState('Camera Module 3')
  const [traceTarget, setTraceTarget] = useState(
    'Bone-Conduction Transducer'
  )

  const validation = useMemo(() => validateArchitecture(), [])

  const tracePath = useMemo(
    () => findPath(traceSource, traceTarget),
    [traceSource, traceTarget]
  )

  const traceLayers = new Set(
    tracePath.map(name => lookup(name)?.layer.id).filter(Boolean)
  )

  const activeLayer =
    LAYERS.find(layer => layer.id === selectedLayer) || LAYERS[0]

  const activeConnection =
    CONNECTIONS.find(c => c.id === selectedConnection) || null

  function selectLayer(id) {
    setSelectedLayer(id)
    setSelectedConnection(null)
    setSelectedComponent(null)
    setActiveTab('overview')
    setMode('inspector')
  }

  function selectConnection(id) {
    setSelectedConnection(id)
    setSelectedComponent(null)
    setMode('inspector')
  }

  function navigateToComponent(name) {
    const result = lookup(name)
    if (!result) return

    setSelectedLayer(result.layer.id)
    setSelectedComponent(name)
    setSelectedConnection(null)
    setActiveTab('components')
    setMode('inspector')
  }

  function traceFromComponent(name) {
    setTraceSource(name)
    setTraceTarget(
      TRACE_TARGETS.find(target => findPath(name, target).length > 0) ||
      name
    )
    setSelectedConnection(null)
    setMode('trace')
  }

  function highlightedConnection(connection) {
    if (mode === 'trace' && tracePath.length) {
      return (
        traceLayers.has(connection.from) &&
        traceLayers.has(connection.to)
      )
    }

    if (selectedConnection && mode === 'inspector') {
      return connection.id === selectedConnection
    }

    return (
      connection.from === selectedLayer ||
      connection.to === selectedLayer
    )
  }

  return (
    <section className="section aditi-architecture-scroll">
      <style>
        {`
          @keyframes aditiVisibleFlow {
            0% {
              transform: translateY(-16px);
              opacity: 0;
            }
            15%, 85% {
              opacity: 1;
            }
            100% {
              transform: translateY(80px);
              opacity: 0;
            }
          }

          .aditi-flow-particle {
            animation-name: aditiVisibleFlow;
            animation-duration: 1.65s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .aditi-flow-particle {
              animation: none !important;
              transform: translateY(30px);
              opacity: 1;
            }
          }
        `}
      </style>

      <div className="section-head">
        <div>
          <h2>System architecture</h2>
          <p>
            Explore ADITI's proposed SENSE → PROCESS → DECIDE → ACT
            pipeline, inspect components, trace information paths,
            and review the conceptual engineering design.
          </p>
        </div>

        <div
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            color: C.cyan,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          PHASE 6 / ARCHITECTURE
        </div>
      </div>

      {/* FEATURE NAVIGATION */}

      <div
        style={{
          ...panel,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 14,
        }}
      >
        {MODES.map(([id, label]) => (
          <ActionButton
            key={id}
            active={mode === id}
            onClick={() => {
              setMode(id)
              setSelectedConnection(null)
            }}
          >
            {label}
          </ActionButton>
        ))}
      </div>

      {/* ANIMATION CONTROLS */}

      <div
        style={{
          ...panel,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 10,
          marginBottom: 16,
        }}
      >
        <span style={{ ...smallLabel, color: C.cyan, marginRight: 'auto' }}>
          DATA-FLOW CONTROLS
        </span>

        <span
          aria-live="polite"
          style={{
            color: !showConnections
              ? C.muted
              : animationPlaying ? C.green : C.amber,
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {!showConnections
            ? '● CONNECTIONS HIDDEN'
            : animationPlaying
              ? '● ANIMATION RUNNING'
              : 'Ⅱ ANIMATION PAUSED'}
        </span>

        <ActionButton
          active={showConnections}
          onClick={() => {
            setShowConnections(value => !value)
            setSelectedConnection(null)
          }}
        >
          {showConnections ? '◉ Connections ON' : '○ Connections OFF'}
        </ActionButton>

        <ActionButton
          disabled={!showConnections}
          active={!animationPlaying}
          color={C.amber}
          onClick={() => setAnimationPlaying(value => !value)}
        >
          {animationPlaying ? 'Ⅱ Pause Animation' : '▶ Resume Animation'}
        </ActionButton>
      </div>

      {/* MAIN TWO-COLUMN ARCHITECTURE */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {/* LEFT: ARCHITECTURE DIAGRAM */}

        <div style={panel}>
          <div style={{ ...smallLabel, color: C.cyan, marginBottom: 18 }}>
            ADITI / SYSTEM DATA FLOW
          </div>

          {LAYERS.map((layer, index) => {
            const active =
              mode === 'trace'
                ? traceLayers.has(layer.id)
                : mode === 'inspector' &&
                  (
                    selectedConnection
                      ? activeConnection?.from === layer.id ||
                        activeConnection?.to === layer.id
                      : selectedLayer === layer.id
                  )

            return (
              <div key={layer.id}>
                <button
                  type="button"
                  onClick={() => selectLayer(layer.id)}
                  aria-pressed={Boolean(active)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: 16,
                    textAlign: 'left',
                    borderRadius: 11,
                    cursor: 'pointer',
                    background: active
                      ? `${layer.color}15`
                      : C.panel,
                    border: `1px solid ${
                      active ? layer.color : C.border
                    }`,
                    boxShadow: active
                      ? `0 0 20px ${layer.color}12`
                      : 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 10,
                        fontSize: 25,
                        color: layer.color,
                        background: `${layer.color}14`,
                        border: `1px solid ${layer.color}40`,
                      }}
                    >
                      {layer.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          color: layer.color,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: 1.4,
                        }}
                      >
                        {layer.number} / {layer.title}
                      </div>

                      <div
                        style={{
                          color: C.text,
                          fontSize: 14,
                          fontWeight: 700,
                          marginTop: 4,
                        }}
                      >
                        {layer.subtitle}
                      </div>
                    </div>

                    <span
                      style={{
                        color: active ? layer.color : C.muted,
                        fontSize: 18,
                      }}
                    >
                      {active ? '●' : '○'}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 10,
                      borderTop: `1px solid ${C.border}`,
                      color: C.muted,
                      fontSize: 11,
                    }}
                  >
                    {layer.components.length} defined hardware/software entries
                  </div>
                </button>

                {index < CONNECTIONS.length && (
                  <DataFlowConnection
                    connection={CONNECTIONS[index]}
                    highlighted={highlightedConnection(
                      CONNECTIONS[index]
                    )}
                    visible={showConnections}
                    playing={animationPlaying}
                    onClick={selectConnection}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* RIGHT: FEATURE INSPECTOR */}

        <div style={panel}>
          {mode === 'inspector' && (
            activeConnection && showConnections ? (
              <ConnectionInspector
                connection={activeConnection}
                onDestination={() =>
                  selectLayer(activeConnection.to)
                }
              />
            ) : (
              <SubsystemInspector
                layer={activeLayer}
                tab={activeTab}
                setTab={tab => {
                  setActiveTab(tab)
                  setSelectedComponent(null)
                }}
                selectedComponent={selectedComponent}
                onSelectComponent={navigateToComponent}
                onBack={() => setSelectedComponent(null)}
                onTrace={traceFromComponent}
              />
            )
          )}

          {mode === 'trace' && (
            <TraceInspector
              source={traceSource}
              target={traceTarget}
              setSource={setTraceSource}
              setTarget={setTraceTarget}
              path={tracePath}
              onNavigate={navigateToComponent}
            />
          )}

          {mode === 'mapping' && (
            <MappingInspector onNavigate={navigateToComponent} />
          )}

          {mode === 'validation' && (
            <ValidationInspector result={validation} />
          )}

          {mode === 'dashboard' && (
            <DashboardInspector
              validation={validation}
              onNavigate={navigateToComponent}
            />
          )}
        </div>
      </div>

      {/* ENGINEERING DISCLAIMER */}

      <div
        style={{
          marginTop: 16,
          padding: '13px 16px',
          borderRadius: 10,
          border: `1px solid ${C.border}`,
          background: 'rgba(5,12,24,0.6)',
          color: C.muted,
          fontSize: 11,
          lineHeight: 1.8,
        }}
      >
        <strong style={{ color: C.cyan }}>
          Engineering note:
        </strong>{' '}
        This dashboard represents the proposed ADITI architecture.
        Animated connections and traced paths are illustrative,
        not live telemetry. Validation checks logical consistency
        only. Electrical connections, device compatibility,
        latency, reliability and assistive safety require
        separate physical testing. Power management (HW05 / HW06)
        will require dedicated mapping during hardware integration.
      </div>
    </section>
  )
}


export function ArchitectureSection() {
  const [activeView, setActiveView] = useState('dashboard')

  const buttonStyle = (active) => ({
    padding: '11px 16px',
    minHeight: 44,
    borderRadius: 9,
    border: active
      ? '1px solid #00e7ee'
      : '1px solid rgba(255,0,122,0.3)',
    background: active
      ? 'rgba(0,231,238,0.12)'
      : 'rgba(20,11,32,0.94)',
    color: active ? '#00e7ee' : '#f5f0fa',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    flex: '1 1 145px',
  })

  return (
    <div
      style={{
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          padding: '12px 0 16px',
        }}
      >
        <button
          type="button"
          style={buttonStyle(activeView === 'dashboard')}
          aria-pressed={activeView === 'dashboard'}
          onClick={() => setActiveView('dashboard')}
        >
          Engineering Dashboard
        </button>

        <button
          type="button"
          style={buttonStyle(activeView === 'diagram')}
          aria-pressed={activeView === 'diagram'}
          onClick={() => setActiveView('diagram')}
        >
          Interactive Diagram
        </button>
      </div>

      {activeView === 'dashboard' ? (
        <ArchitectureDashboard />
      ) : (
        <ArchitectureDiagram />
      )}
    </div>
  )
}
