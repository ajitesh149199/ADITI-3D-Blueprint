
import { useState } from 'react'
import { ArchitectureFlowSimulator } from './ArchitectureFlowSimulator'

const MODULES = [
  {
    id: 'camera',
    name: 'Camera',
    icon: '📷',
    group: 'input',
    description:
      'Captures visual information for object recognition, text reading, and scene analysis.',
  },
  {
    id: 'imu',
    name: 'IMU',
    icon: '🧭',
    group: 'input',
    description:
      'Provides acceleration and rotation information for motion and orientation awareness.',
  },
  {
    id: 'gps',
    name: 'GPS',
    icon: '📍',
    group: 'input',
    description:
      'Provides location information for navigation-related assistance.',
  },
  {
    id: 'microphone',
    name: 'Microphone',
    icon: '🎤',
    group: 'input',
    description:
      'Captures audio events and voice input.',
  },
  {
    id: 'fusion',
    name: 'Sensor Fusion',
    icon: '🔗',
    group: 'processing',
    description:
      'Combines relevant sensor observations into a unified context.',
  },
  {
    id: 'relevance',
    name: 'Relevance Engine',
    icon: '🎯',
    group: 'processing',
    description:
      'Evaluates observations against the current user objective.',
  },
  {
    id: 'risk',
    name: 'Risk Evaluation',
    icon: '🛡️',
    group: 'processing',
    description:
      'Estimates the importance and urgency of detected events.',
  },
  {
    id: 'suppression',
    name: 'Suppression Engine',
    icon: '⚙️',
    group: 'processing',
    description:
      'Filters unnecessary information and reduces redundant feedback.',
  },
  {
    id: 'audio',
    name: 'Audio Output',
    icon: '🔊',
    group: 'output',
    description:
      'Delivers spoken feedback through text-to-speech.',
  },
  {
    id: 'haptic',
    name: 'Haptic Output',
    icon: '📳',
    group: 'output',
    description:
      'Provides vibration-based feedback for selected alerts.',
  },
  {
    id: 'visual',
    name: 'Visual Output',
    icon: '🖥️',
    group: 'output',
    description:
      'Displays information on a connected screen or future visual interface.',
  },
]

const CONNECTIONS = [
  {
    id: 'sensor-fusion',
    name: 'Sensor Data Transfer',
    from: 'Sensor Inputs',
    to: 'Sensor Fusion',
    description:
      'Available sensor observations are delivered to the processing pipeline for context interpretation.',
    payloads: [
      'Camera frames',
      'Motion readings',
      'Location estimates',
      'Audio observations',
    ],
  },
  {
    id: 'fusion-relevance',
    name: 'Context Evaluation',
    from: 'Sensor Fusion',
    to: 'Relevance Engine',
    description:
      'Fused observations are evaluated against the current user objective and available confidence information.',
    payloads: [
      'Fused context',
      'User objective',
      'Reliability information',
    ],
  },
  {
    id: 'relevance-risk',
    name: 'Risk Assessment',
    from: 'Relevance Engine',
    to: 'Risk Evaluation',
    description:
      'Relevant observations are assessed for potential urgency and importance.',
    payloads: [
      'Relevant observations',
      'Reliability estimates',
      'Risk-related context',
    ],
  },
  {
    id: 'risk-suppression',
    name: 'Feedback Filtering',
    from: 'Risk Evaluation',
    to: 'Suppression Engine',
    description:
      'Candidate information is prioritized, delayed, kept, or suppressed according to the intended decision policy.',
    payloads: [
      'Risk assessments',
      'Feedback candidates',
      'Priority information',
    ],
  },
  {
    id: 'suppression-output',
    name: 'Feedback Distribution',
    from: 'Suppression Engine',
    to: 'Output Channels',
    description:
      'Selected feedback is routed to the intended audio, haptic, or visual output channel.',
    payloads: [
      'Spoken feedback requests',
      'Haptic alert requests',
      'Visual status information',
    ],
  },
]

const C = {
  cyan: '#67e8f9',
  magenta: '#ff007a',
  text: '#e8f4ff',
  muted: '#94a3b8',
  border: 'rgba(103,232,249,0.22)',
  background: 'rgba(8,13,29,0.94)',
  card: 'rgba(18,28,49,0.95)',
}

const sectionStyle = {
  minWidth: 0,
  padding: 16,
  borderRadius: 16,
  background: C.background,
  border: `1px solid ${C.border}`,
  boxSizing: 'border-box',
}

function ModuleCard({ module, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(module.id)}
      aria-pressed={selected}
      style={{
        width: '100%',
        minWidth: 0,
        minHeight: 96,
        padding: '13px 10px',
        borderRadius: 12,
        border: `1px solid ${
          selected ? C.cyan : C.border
        }`,
        background: selected
          ? 'rgba(20,74,96,0.65)'
          : C.card,
        color: C.text,
        cursor: 'pointer',
        font: 'inherit',
        textAlign: 'center',
        overflowWrap: 'anywhere',
      }}
    >
      <div
        aria-hidden="true"
        style={{ fontSize: 25, marginBottom: 8 }}
      >
        {module.icon}
      </div>

      <div style={{ fontSize: 12, fontWeight: 700 }}>
        {module.name}
      </div>
    </button>
  )
}

function ModuleGroup({
  title,
  subtitle,
  modules,
  selectedId,
  onSelect,
}) {
  return (
    <section style={sectionStyle}>
      <h3
        style={{
          color: C.cyan,
          fontSize: 12,
          letterSpacing: 1,
          margin: '0 0 6px',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: C.muted,
          fontSize: 12,
          lineHeight: 1.6,
          margin: '0 0 15px',
        }}
      >
        {subtitle}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 115px), 1fr))',
          gap: 10,
        }}
      >
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            selected={selectedId === module.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}

function FlowConnection({
  connection,
  selected,
  onSelect,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 7,
        padding: '7px 0',
        minWidth: 0,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 2,
          height: 19,
          background: selected ? C.magenta : C.cyan,
          opacity: 0.85,
        }}
      />

      <button
        type="button"
        onClick={() => onSelect(connection.id)}
        aria-pressed={selected}
        aria-label={`Inspect ${connection.name}`}
        style={{
          width: 'min(100%, 280px)',
          minHeight: 44,
          borderRadius: 10,
          border: `1px solid ${
            selected ? C.magenta : C.border
          }`,
          background: selected
            ? 'rgba(255,0,122,0.15)'
            : 'rgba(15,23,42,0.9)',
          color: selected ? '#ff7bb8' : C.cyan,
          fontSize: 11,
          fontWeight: 700,
          fontFamily: 'inherit',
          cursor: 'pointer',
          padding: '10px 12px',
          overflowWrap: 'anywhere',
        }}
      >
        ↓ {connection.name}
      </button>

      <div
        aria-hidden="true"
        style={{
          width: 2,
          height: 19,
          background: selected ? C.magenta : C.cyan,
          opacity: 0.85,
        }}
      />
    </div>
  )
}

function DetailsPanel({ module, connection }) {
  if (!module && !connection) return null

  return (
    <section
      aria-live="polite"
      style={{
        ...sectionStyle,
        marginTop: 18,
        borderColor: 'rgba(255,0,122,0.45)',
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: C.magenta,
          letterSpacing: 1.2,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        {module ? 'SELECTED MODULE' : 'SELECTED CONNECTION'}
      </div>

      {module && (
        <>
          <h3
            style={{
              color: C.text,
              fontSize: 18,
              margin: '0 0 10px',
            }}
          >
            {module.icon} {module.name}
          </h3>

          <p
            style={{
              color: '#cbd5e1',
              fontSize: 13,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {module.description}
          </p>
        </>
      )}

      {connection && (
        <>
          <h3
            style={{
              color: C.text,
              fontSize: 18,
              margin: '0 0 12px',
            }}
          >
            {connection.name}
          </h3>

          <div
            style={{
              color: C.cyan,
              fontSize: 12,
              lineHeight: 1.7,
              marginBottom: 12,
              overflowWrap: 'anywhere',
            }}
          >
            {connection.from} → {connection.to}
          </div>

          <p
            style={{
              color: '#cbd5e1',
              fontSize: 13,
              lineHeight: 1.7,
              margin: '0 0 16px',
            }}
          >
            {connection.description}
          </p>

          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.magenta,
              marginBottom: 10,
            }}
          >
            INFORMATION TRANSFERRED
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {connection.payloads.map((payload) => (
              <span
                key={payload}
                style={{
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '8px 10px',
                  color: C.cyan,
                  background: C.card,
                  fontSize: 11,
                  overflowWrap: 'anywhere',
                }}
              >
                {payload}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export function ArchitectureDiagram() {
  const [selectedModuleId, setSelectedModuleId] =
    useState('fusion')

  const [showSimulator, setShowSimulator] = useState(false)

  const [selectedConnectionId, setSelectedConnectionId] =
    useState(null)

  const selectedModule = MODULES.find(
    (module) => module.id === selectedModuleId
  )

  const selectedConnection = CONNECTIONS.find(
    (connection) => connection.id === selectedConnectionId
  )

  const inputs = MODULES.filter(
    (module) => module.group === 'input'
  )

  const processing = MODULES.filter(
    (module) => module.group === 'processing'
  )

  const outputs = MODULES.filter(
    (module) => module.group === 'output'
  )

  function selectModule(id) {
    setSelectedModuleId(id)
    setSelectedConnectionId(null)
  }

  function selectConnection(id) {
    setSelectedConnectionId(id)
    setSelectedModuleId(null)
  }

  return (
    <div
      style={{
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        color: C.text,
        fontFamily: 'inherit',
      }}
    >
      <header style={{ marginBottom: 20 }}>
        <h2
          style={{
            margin: '0 0 8px',
            fontSize: 'clamp(20px, 4vw, 28px)',
          }}
        >
          ADITI System Architecture
        </h2>

        <p
          style={{
            color: C.muted,
            fontSize: 13,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Explore ADITI's proposed sensor-to-feedback pipeline.
          Select a module or connection to inspect its role.
        </p>
      </header>

      <div style={{ display: 'grid', gap: 6 }}>
        <ModuleGroup
          title="01 — SENSOR INPUT"
          subtitle="Hardware modules that collect environmental information"
          modules={inputs}
          selectedId={selectedModuleId}
          onSelect={selectModule}
        />

        <FlowConnection
          connection={CONNECTIONS[0]}
          selected={selectedConnectionId === CONNECTIONS[0].id}
          onSelect={selectConnection}
        />

        <ModuleGroup
          title="02 — ADITI PROCESSING"
          subtitle="Context interpretation, filtering, and decision logic"
          modules={processing}
          selectedId={selectedModuleId}
          onSelect={selectModule}
        />

        <div
          style={{
            ...sectionStyle,
            borderColor: 'rgba(103,232,249,0.12)',
          }}
        >
          <div
            style={{
              color: C.muted,
              fontSize: 11,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            INTERNAL PROCESSING SEQUENCE
          </div>

          <div
            style={{
              display: 'grid',
              gap: 6,
            }}
          >
            {CONNECTIONS.slice(1, 4).map((connection) => (
              <FlowConnection
                key={connection.id}
                connection={connection}
                selected={
                  selectedConnectionId === connection.id
                }
                onSelect={selectConnection}
              />
            ))}
          </div>
        </div>

        <FlowConnection
          connection={CONNECTIONS[4]}
          selected={selectedConnectionId === CONNECTIONS[4].id}
          onSelect={selectConnection}
        />

        <ModuleGroup
          title="03 — FEEDBACK OUTPUT"
          subtitle="Selected information delivered to the user"
          modules={outputs}
          selectedId={selectedModuleId}
          onSelect={selectModule}
        />
      </div>

      <DetailsPanel
        module={selectedModule}
        connection={selectedConnection}
      />

      
<div
  style={{
    marginTop: 24,
    marginBottom: 18,
    width: '100%',
    minWidth: 0,
  }}
>
  <button
    type="button"
    onClick={() => setShowSimulator((previous) => !previous)}
    aria-expanded={showSimulator}
    style={{
      width: '100%',
      minHeight: 48,
      padding: '12px 16px',
      borderRadius: 11,
      border: '1px solid #00e7ee',
      background: showSimulator
        ? 'rgba(0,231,238,0.16)'
        : 'rgba(20,11,32,0.94)',
      color: '#00e7ee',
      fontSize: 12,
      fontWeight: 700,
      fontFamily: 'inherit',
      cursor: 'pointer',
    }}
  >
    {showSimulator
      ? '▲ Hide Data-Flow Simulator'
      : '▶ Launch Data-Flow Simulator'}
  </button>

  {showSimulator && (
    <div style={{ marginTop: 14 }}>
      <ArchitectureFlowSimulator />
    </div>
  )}
</div>


      <p
        style={{
          color: '#64748b',
          fontSize: 11,
          lineHeight: 1.7,
          marginTop: 16,
        }}
      >
        This is a conceptual information-flow diagram.
        Connections do not represent verified physical wiring,
        measured performance, or live sensor telemetry.
      </p>
    </div>
  )
}

export default ArchitectureDiagram
