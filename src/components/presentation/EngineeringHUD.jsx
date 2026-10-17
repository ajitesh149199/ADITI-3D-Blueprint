
import './EngineeringHUD.css'

const CONFIGS = [
  {
    label: 'ASSISTIVE SYSTEM OVERVIEW',
    nodes: ['CAMERA', 'IMU / GPS', 'ADITI CORE', 'AI DECISION', 'USER FEEDBACK'],
    note: 'Context-aware multimodal assistance',
  },
  {
    label: 'INFORMATION PRIORITIZATION',
    nodes: ['RAW ALERTS', 'CONTEXT', 'RELEVANCE', 'PRIORITY', 'USEFUL ALERT'],
    note: 'Reduce unnecessary feedback',
  },
  {
    label: 'PROPOSED SOLUTION',
    nodes: ['SENSORS', 'DATA FUSION', 'RISK ANALYSIS', 'SUPPRESSION', 'FEEDBACK'],
    note: 'Modular decision-making architecture',
  },
  {
    label: 'SOFTWARE PIPELINE',
    nodes: ['INPUT', 'FUSION', 'RELEVANCE', 'SUPPRESSION', 'OUTPUT'],
    note: 'Simulation processing sequence',
  },
  {
    label: 'HARDWARE TOPOLOGY',
    nodes: ['CAMERA', 'IMU / GPS', 'PROCESSOR', 'POWER', 'AUDIO / HAPTIC'],
    note: 'Proposed physical subsystem layout',
  },
  {
    label: 'COMPONENT INSPECTION',
    nodes: ['3D MODEL', 'COMPONENT', 'CONNECTIONS', 'POWER DATA', 'INSPECTION'],
    note: 'Interactive hardware blueprint',
  },
  {
    label: 'MISSION EXECUTION',
    nodes: ['SCENARIO', 'SENSOR DATA', 'AI DECISION', 'FEEDBACK', 'EVENT LOG'],
    note: 'Simulated mission processing',
  },
  {
    label: 'PERFORMANCE ANALYSIS',
    nodes: ['EXECUTION', 'LATENCY', 'RESOURCES', 'EVENTS', 'SUMMARY'],
    note: 'Software-derived performance estimates',
  },
  {
    label: 'VALIDATION SYSTEM',
    nodes: ['TEST CASE', 'EXPECTED', 'ACTUAL', 'COMPARE', 'REPORT'],
    note: 'Scenario-based decision evaluation',
  },
  {
    label: 'DEVELOPMENT ROADMAP',
    nodes: ['SIMULATOR', '3D DESIGN', 'PROTOTYPE', 'MEASUREMENT', 'VALIDATION'],
    note: 'Physical verification remains future work',
  },
  {
    label: 'ADITI PROJECT SUMMARY',
    nodes: ['HARDWARE', 'SOFTWARE', 'SIMULATION', 'EVALUATION', 'ADITI'],
    note: 'Artificially Driven Data, Information and Tech Integration',
  },
]

export default function EngineeringHUD({ slideIndex = 0 }) {
  const config = CONFIGS[slideIndex] ?? CONFIGS[0]

  const positions = [
    [65, 55],
    [65, 155],
    [190, 105],
    [315, 55],
    [315, 155],
  ]

  const connections = [
    'M110 55 H125 V105 H145',
    'M110 155 H125 V105',
    'M235 105 H255 V55 H270',
    'M235 105 H255 V155 H270',
  ]

  return (
    <div className="aditi-engineering-hud">
      <div className="aditi-engineering-hud-header">
        <span>ADITI / {config.label}</span>
        <span className="aditi-hud-indicator">
          VISUAL MODEL
        </span>
      </div>

      <div className="aditi-engineering-diagram">
        <svg
          viewBox="0 0 380 210"
          role="img"
          aria-label={`${config.label}: ${config.nodes.join(' to ')}`}
        >
          <defs>
            <filter id="aditi-node-glow">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>

          <g
            fill="none"
            stroke="#ff007a"
            strokeWidth="1.5"
            strokeDasharray="5 6"
            className="aditi-engineering-connections"
          >
            {connections.map((path, i) => (
              <path key={i} d={path} />
            ))}
          </g>

          {positions.map(([x, y], i) => {
            const center = i === 2

            return (
              <g key={`${config.nodes[i]}-${i}`}>
                <rect
                  x={x - 45}
                  y={y - 22}
                  width="90"
                  height="44"
                  rx="6"
                  fill={center ? '#18283a' : '#101324'}
                  stroke={center ? '#ff007a' : '#00e7ee'}
                  strokeWidth={center ? 2 : 1}
                />

                <text
                  x={x}
                  y={y + 4}
                  fill={center ? '#ff8dc2' : '#c8fbff'}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight={center ? 'bold' : 'normal'}
                >
                  {config.nodes[i]}
                </text>

                <circle
                  cx={x + 40}
                  cy={y - 17}
                  r="2"
                  fill="#00e7ee"
                />
              </g>
            )
          })}
        </svg>
      </div>

      <div className="aditi-engineering-hud-bottom">
        <span>{config.note}</span>
        <span>
          {String(slideIndex + 1).padStart(2, '0')} / 11
        </span>
      </div>
    </div>
  )
}
