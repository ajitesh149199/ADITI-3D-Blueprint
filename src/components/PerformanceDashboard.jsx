
import { useUnifiedSystem } from '../state/UnifiedSystemContext'

const panel = {
  padding: 18,
  borderRadius: 14,
  border: '1px solid rgba(255,0,122,0.28)',
  background: 'rgba(18,11,31,0.92)',
  minWidth: 0,
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: 12,
}

const button = {
  padding: '11px 16px',
  borderRadius: 9,
  border: '1px solid rgba(0,231,238,0.45)',
  background: 'rgba(0,231,238,0.1)',
  color: '#00e7ee',
  cursor: 'pointer',
}

function formatNumber(value, digits = 1) {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toFixed(digits)
    : 'N/A'
}

function Metric({ label, value, note }) {
  return (
    <div
      style={{
        padding: 16,
        background: '#120d20',
        borderRadius: 10,
        minWidth: 0,
      }}
    >
      <div style={{ color: '#a99db8', fontSize: 11 }}>
        {label}
      </div>

      <strong
        style={{
          display: 'block',
          color: '#00e7ee',
          fontSize: 23,
          marginTop: 8,
          overflowWrap: 'anywhere',
        }}
      >
        {value}
      </strong>

      {note && (
        <p style={{ color: '#a99db8', fontSize: 11 }}>
          {note}
        </p>
      )}
    </div>
  )
}

function Distribution({ title, data }) {
  const entries = Object.entries(data ?? {})
  const total = entries.reduce(
    (sum, [, count]) => sum + count,
    0
  )

  return (
    <section style={panel}>
      <h3>{title}</h3>

      {entries.length === 0 ? (
        <p style={{ color: '#a99db8', fontSize: 12 }}>
          No data available yet.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {entries.map(([name, count]) => {
            const percentage =
              total > 0 ? (count / total) * 100 : 0

            return (
              <div key={name}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    fontSize: 12,
                    marginBottom: 7,
                  }}
                >
                  <span>{name}</span>
                  <span>
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>

                <div
                  style={{
                    height: 9,
                    borderRadius: 99,
                    background: '#241630',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background:
                        'linear-gradient(90deg, #ff007a, #00e7ee)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default function PerformanceDashboard() {
  const {
    performanceAnalytics,
    batchResults,
    batchError,
    batchRunning,
    runBatchValidation,
  } = useUnifiedSystem()

  const analytics = performanceAnalytics

  const validation = analytics.validation
  const decisions = analytics.decisions
  const missions = analytics.missions
  const diagnostics = analytics.diagnostics

  function handleValidation() {
    try {
      runBatchValidation()
    } catch (error) {
      console.error('Performance validation failed:', error)
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 18,
        color: '#f5f0fa',
        minWidth: 0,
      }}
    >
      <header style={panel}>
        <div
          style={{
            color: '#00e7ee',
            fontSize: 11,
            letterSpacing: 2,
          }}
        >
          ADITI / PHASE L.3
        </div>

        <h1>Integrated System Performance</h1>

        <p style={{ color: '#a99db8', fontSize: 12 }}>
          Analytics generated from ADITI's existing
          simulation engine, mission history, and official
          scenario validation.
        </p>

        <button
          type="button"
          style={button}
          disabled={batchRunning}
          onClick={handleValidation}
        >
          {batchRunning
            ? 'Running Validation...'
            : '▶ Run Performance Validation'}
        </button>

        {batchError && (
          <p role="alert" style={{ color: '#fb7185' }}>
            {batchError}
          </p>
        )}
      </header>

      <section style={panel}>
        <h2>01 / System Performance Overview</h2>

        <div style={grid}>
          <Metric
            label="Scenarios Tested"
            value={validation.total}
          />

          <Metric
            label="Scenarios Matched"
            value={validation.passed}
          />

          <Metric
            label="Decision Match Rate"
            value={
              validation.matchRate === null
                ? 'N/A'
                : `${formatNumber(validation.matchRate)}%`
            }
            note="Agreement with predefined expectations"
          />

          <Metric
            label="Mismatched Scenarios"
            value={validation.mismatched}
          />

          <Metric
            label="Recorded Missions"
            value={missions.total}
          />

          <Metric
            label="Active Simulated Faults"
            value={diagnostics.activeFaultCount}
          />
        </div>

        <p style={{ color: '#a99db8', fontSize: 11 }}>
          Last validation:{' '}
          {validation.lastValidationTime
            ? new Date(
                validation.lastValidationTime
              ).toLocaleString()
            : 'Not yet executed'}
        </p>
      </section>

      <section style={panel}>
        <h2>02 / Decision Matching</h2>

        <div style={grid}>
          {['risk', 'suppression', 'feedback'].map(
            (key) => (
              <Metric
                key={key}
                label={`${key.toUpperCase()} Matches`}
                value={
                  validation.total > 0
                    ? `${validation.decisionMatches[key]}/${validation.total}`
                    : 'N/A'
                }
              />
            )
          )}
        </div>
      </section>

      <section>
        <h2>03 / AI Decision Distributions</h2>

        <div style={grid}>
          <Distribution
            title="Risk Levels"
            data={decisions.riskDistribution}
          />

          <Distribution
            title="Suppression Decisions"
            data={decisions.suppressionDistribution}
          />

          <Distribution
            title="Feedback Selection"
            data={decisions.feedbackDistribution}
          />
        </div>
      </section>

      <section style={panel}>
        <h2>04 / Mission Performance Estimates</h2>

        <div style={grid}>
          <Metric
            label="Average Estimated Latency"
            value={
              missions.estimatedAverageLatencyMs === null
                ? 'N/A'
                : `${formatNumber(
                    missions.estimatedAverageLatencyMs
                  )} ms`
            }
          />

          <Metric
            label="Average Estimated Power"
            value={
              missions.estimatedAveragePowerWatts === null
                ? 'N/A'
                : `${formatNumber(
                    missions.estimatedAveragePowerWatts,
                    2
                  )} W`
            }
          />
        </div>

        <p style={{ color: '#a99db8', fontSize: 11 }}>
          Latency and power are simulated estimates, not
          measurements from physical smart glasses.
        </p>
      </section>

      <Distribution
        title="05 / Mission Status Distribution"
        data={missions.statuses}
      />

      <section style={panel}>
        <h2>06 / Official Scenario Results</h2>

        {!batchResults ? (
          <p style={{ color: '#a99db8', fontSize: 12 }}>
            Run performance validation to display the
            official scenario results.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                minWidth: 560,
                borderCollapse: 'collapse',
                fontSize: 12,
              }}
            >
              <thead>
                <tr
                  style={{
                    color: '#00e7ee',
                    textAlign: 'left',
                  }}
                >
                  <th style={{ padding: 12 }}>Scenario</th>
                  <th style={{ padding: 12 }}>Risk</th>
                  <th style={{ padding: 12 }}>Suppression</th>
                  <th style={{ padding: 12 }}>Feedback</th>
                  <th style={{ padding: 12 }}>Result</th>
                </tr>
              </thead>

              <tbody>
                {analytics.scenarioResults.map((entry) => (
                  <tr
                    key={entry.id}
                    style={{
                      borderTop:
                        '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <td style={{ padding: 12 }}>
                      {entry.name}
                    </td>

                    {['risk', 'suppression', 'feedback'].map(
                      (key) => (
                        <td
                          key={key}
                          style={{
                            padding: 12,
                            color: entry.comparison?.[key]
                              ? '#34d399'
                              : '#fb7185',
                          }}
                        >
                          {entry.actual?.[key] ?? 'N/A'}
                        </td>
                      )
                    )}

                    <td
                      style={{
                        padding: 12,
                        color: entry.matched
                          ? '#34d399'
                          : '#fb7185',
                      }}
                    >
                      {entry.matched ? 'MATCH' : 'MISMATCH'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p style={{ color: '#a99db8', fontSize: 11 }}>
        ADITI Performance Dashboard — software simulation
        results only. Decision match rate is not a measure
        of real-world recognition accuracy, reliability,
        or obstacle-avoidance safety.
      </p>
    </div>
  )
}
