
import { useEffect, useState } from 'react'

const STAGES = [
  {
    id: 'sensors',
    number: '01',
    name: 'Sensor Acquisition',
    icon: '📷',
    color: '#22d3ee',
    description:
      'The proposed camera, IMU, GPS and microphone collect observations from the environment.',
    input: 'Environmental observations',
    output: 'Sensor readings',
  },
  {
    id: 'fusion',
    number: '02',
    name: 'Sensor Fusion',
    icon: '🔗',
    color: '#38bdf8',
    description:
      'Available sensor observations are combined into a unified context for further analysis.',
    input: 'Sensor readings',
    output: 'Fused context',
  },
  {
    id: 'relevance',
    number: '03',
    name: 'Relevance Evaluation',
    icon: '🎯',
    color: '#818cf8',
    description:
      'The system evaluates information according to the current user objective and reliability estimates.',
    input: 'Fused context',
    output: 'Relevance assessments',
  },
  {
    id: 'risk',
    number: '04',
    name: 'Risk Evaluation',
    icon: '🛡️',
    color: '#f59e0b',
    description:
      'Potential hazards and important events are assessed for urgency and priority.',
    input: 'Relevance assessments',
    output: 'Risk and priority estimates',
  },
  {
    id: 'suppression',
    number: '05',
    name: 'Suppression Engine',
    icon: '⚙️',
    color: '#d946ef',
    description:
      'Candidate feedback is kept, delayed or suppressed to reduce unnecessary notifications.',
    input: 'Candidate feedback and priority',
    output: 'Filtered feedback',
  },
  {
    id: 'output',
    number: '06',
    name: 'Feedback Output',
    icon: '🔊',
    color: '#34d399',
    description:
      'The intended output manager selects appropriate audio, haptic or visual feedback.',
    input: 'Filtered feedback',
    output: 'Selected user feedback',
  },
]

const COLORS = {
  background: 'rgba(12,7,22,0.96)',
  panel: 'rgba(20,11,32,0.94)',
  border: 'rgba(255,0,122,0.25)',
  cyan: '#00e7ee',
  magenta: '#ff007a',
  text: '#f5f0fa',
  muted: '#a99db8',
}

const STEP_INTERVAL = 1800

function StageCard({ stage, active, completed, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        width: '100%',
        minWidth: 0,
        minHeight: 106,
        padding: 14,
        borderRadius: 12,
        background: active
          ? `${stage.color}18`
          : COLORS.panel,
        border: `1px solid ${
          active ? stage.color : COLORS.border
        }`,
        color: COLORS.text,
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        overflowWrap: 'anywhere',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            color: stage.color,
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          {stage.number}
        </span>

        <span aria-hidden="true" style={{ fontSize: 22 }}>
          {stage.icon}
        </span>
      </div>

      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 7,
        }}
      >
        {stage.name}
      </div>

      <div
        style={{
          color: active
            ? stage.color
            : completed
              ? '#34d399'
              : COLORS.muted,
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {active
          ? '● ACTIVE STAGE'
          : completed
            ? '✓ PREVIOUS STAGE'
            : '○ PENDING'}
      </div>
    </button>
  )
}

function ControlButton({
  children,
  onClick,
  active = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: '1 1 120px',
        minHeight: 44,
        padding: '11px 14px',
        borderRadius: 9,
        border: `1px solid ${
          active ? COLORS.cyan : COLORS.border
        }`,
        background: active
          ? 'rgba(0,231,238,0.12)'
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

export function ArchitectureFlowSimulator() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  const activeStage = STAGES[activeIndex]

  useEffect(() => {
    if (!playing) return undefined

    const interval = window.setInterval(() => {
      setActiveIndex((previous) => {
        if (previous >= STAGES.length - 1) {
          return 0
        }

        return previous + 1
      })
    }, STEP_INTERVAL)

    return () => window.clearInterval(interval)
  }, [playing])

  function nextStep() {
    setPlaying(false)
    setActiveIndex((previous) =>
      Math.min(previous + 1, STAGES.length - 1)
    )
  }

  function previousStep() {
    setPlaying(false)
    setActiveIndex((previous) =>
      Math.max(previous - 1, 0)
    )
  }

  function resetSimulation() {
    setPlaying(false)
    setActiveIndex(0)
  }

  function selectStage(index) {
    setPlaying(false)
    setActiveIndex(index)
  }

  return (
    <section
      style={{
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        padding: 'clamp(12px, 3vw, 20px)',
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.background,
        color: COLORS.text,
        fontFamily: 'inherit',
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            color: COLORS.magenta,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1.2,
            marginBottom: 8,
          }}
        >
          ADITI / CONCEPTUAL SIMULATION
        </div>

        <h2
          style={{
            fontSize: 'clamp(18px, 4vw, 25px)',
            margin: '0 0 8px',
          }}
        >
          Interactive Data-Flow Simulator
        </h2>

        <p
          style={{
            fontSize: 12,
            lineHeight: 1.7,
            color: COLORS.muted,
            margin: 0,
          }}
        >
          Visualize the proposed sequence of sensor processing,
          decision-making and feedback generation.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 9,
          marginBottom: 20,
        }}
      >
        <ControlButton
          active={playing}
          onClick={() => setPlaying((previous) => !previous)}
        >
          {playing ? 'Ⅱ Pause' : '▶ Play'}
        </ControlButton>

        <ControlButton
          onClick={previousStep}
          disabled={activeIndex === 0}
        >
          ← Previous
        </ControlButton>

        <ControlButton
          onClick={nextStep}
          disabled={activeIndex === STAGES.length - 1}
        >
          Next →
        </ControlButton>

        <ControlButton onClick={resetSimulation}>
          ↺ Reset
        </ControlButton>
      </div>

      <div
        style={{
          marginBottom: 18,
          fontSize: 11,
          color: COLORS.cyan,
          fontWeight: 700,
        }}
      >
        STAGE {activeIndex + 1} OF {STAGES.length}
      </div>

      <div
        style={{
          height: 7,
          borderRadius: 10,
          overflow: 'hidden',
          background: 'rgba(148,163,184,0.16)',
          marginBottom: 22,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${((activeIndex + 1) / STAGES.length) * 100}%`,
            background:
              'linear-gradient(90deg, #00e7ee, #ff007a)',
            transition: 'width 300ms ease',
          }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 170px), 1fr))',
          gap: 10,
          marginBottom: 20,
        }}
      >
        {STAGES.map((stage, index) => (
          <StageCard
            key={stage.id}
            stage={stage}
            active={index === activeIndex}
            completed={index < activeIndex}
            onClick={() => selectStage(index)}
          />
        ))}
      </div>

      <div
        aria-live="polite"
        style={{
          padding: 16,
          borderRadius: 12,
          border: `1px solid ${activeStage.color}65`,
          background: `${activeStage.color}0c`,
        }}
      >
        <div
          style={{
            color: activeStage.color,
            fontSize: 11,
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          CURRENT PROCESSING STAGE
        </div>

        <h3
          style={{
            margin: '0 0 10px',
            fontSize: 18,
          }}
        >
          {activeStage.icon} {activeStage.name}
        </h3>

        <p
          style={{
            color: COLORS.text,
            fontSize: 12,
            lineHeight: 1.8,
            margin: '0 0 18px',
          }}
        >
          {activeStage.description}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: 10,
          }}
        >
          <div
            style={{
              padding: 12,
              background: COLORS.panel,
              borderRadius: 9,
            }}
          >
            <div
              style={{
                color: COLORS.muted,
                fontSize: 10,
                marginBottom: 7,
              }}
            >
              INPUT
            </div>
            <div style={{ fontSize: 12 }}>
              {activeStage.input}
            </div>
          </div>

          <div
            style={{
              padding: 12,
              background: COLORS.panel,
              borderRadius: 9,
            }}
          >
            <div
              style={{
                color: COLORS.muted,
                fontSize: 10,
                marginBottom: 7,
              }}
            >
              OUTPUT
            </div>
            <div style={{ fontSize: 12 }}>
              {activeStage.output}
            </div>
          </div>
        </div>
      </div>

      <p
        style={{
          marginTop: 18,
          marginBottom: 0,
          color: COLORS.muted,
          fontSize: 11,
          lineHeight: 1.7,
        }}
      >
        This is a timed educational visualization using
        predefined stages. It does not execute ADITI's actual
        decision engines or represent live hardware telemetry.
      </p>
    </section>
  )
}

export default ArchitectureFlowSimulator
