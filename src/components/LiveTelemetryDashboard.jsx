
import { useMemo } from 'react'
import { useUnifiedSystem } from '../state/UnifiedSystemContext'

const colors = {
  cyan: '#00e7ee',
  pink: '#ff007a',
  green: '#34d399',
  muted: '#a99db8',
  white: '#f5f0fa',
  background: '#120b1f',
  border: 'rgba(255,0,122,0.25)',
}

const panelStyle = {
  background: 'rgba(18,11,31,0.94)',
  border: `1px solid ${colors.border}`,
  borderRadius: 14,
  padding: 18,
  minWidth: 0,
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(175px, 1fr))',
  gap: 12,
}

function formatValue(value, unit = '', digits = 1) {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value)
  ) {
    return 'N/A'
  }

  return `${value.toFixed(digits)}${unit}`
}

function formatTime(timestamp) {
  if (!timestamp) return 'N/A'

  const date = new Date(timestamp)

  return Number.isNaN(date.getTime())
    ? 'N/A'
    : date.toLocaleTimeString()
}

function TelemetryCard({ title, value, subtitle, accent }) {
  return (
    <div
      style={{
        padding: 16,
        background: colors.background,
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10,
        minWidth: 0,
      }}
    >
      <div
        style={{
          color: colors.muted,
          fontSize: 11,
          letterSpacing: 1,
        }}
      >
        {title}
      </div>

      <strong
        style={{
          display: 'block',
          fontSize: 22,
          marginTop: 10,
          color: accent ?? colors.cyan,
          overflowWrap: 'anywhere',
        }}
      >
        {value ?? 'N/A'}
      </strong>

      {subtitle && (
        <div
          style={{
            color: colors.muted,
            fontSize: 11,
            marginTop: 7,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  )
}

function TelemetryChart({ history }) {
  const chart = useMemo(() => {
    const points = history
      .filter(
        (entry) =>
          typeof entry.performance
            ?.estimatedLatencyMs === 'number' &&
          Number.isFinite(
            entry.performance.estimatedLatencyMs
          )
      )
      .slice()
      .reverse()
      .slice(-30)

    if (points.length === 0) return null

    const width = 600
    const height = 180
    const padding = 20

    const values = points.map(
      (entry) => entry.performance.estimatedLatencyMs
    )

    const maximum = Math.max(...values, 1)

    const coordinates = values.map((value, index) => {
      const x =
        padding +
        (index / Math.max(values.length - 1, 1)) *
          (width - padding * 2)

      const y =
        height -
        padding -
        (value / maximum) *
          (height - padding * 2)

      return `${x},${y}`
    })

    return {
      coordinates: coordinates.join(' '),
      latest: values[values.length - 1],
      maximum,
      count: values.length,
    }
  }, [history])

  return (
    <section style={panelStyle}>
      <h3>Estimated Processing Latency</h3>

      <p
        style={{
          color: colors.muted,
          fontSize: 12,
        }}
      >
        Trend from recorded simulation snapshots
      </p>

      {!chart ? (
        <p style={{ color: colors.muted }}>
          Run a mission to generate latency telemetry.
        </p>
      ) : (
        <>
          <svg
            viewBox="0 0 600 180"
            role="img"
            aria-label="Estimated latency trend"
            style={{
              width: '100%',
              height: 'auto',
              background: '#0c0916',
              borderRadius: 10,
            }}
          >
            {[40, 80, 120, 160].map((y) => (
              <line
                key={y}
                x1="20"
                y1={y}
                x2="580"
                y2={y}
                stroke="rgba(255,255,255,0.08)"
              />
            ))}

            <polyline
              points={chart.coordinates}
              fill="none"
              stroke={colors.cyan}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p
            style={{
              color: colors.muted,
              fontSize: 11,
            }}
          >
            Latest: {formatValue(chart.latest, ' ms')} |
            Peak: {formatValue(chart.maximum, ' ms')} |
            Samples: {chart.count}
          </p>
        </>
      )}
    </section>
  )
}

export default function LiveTelemetryDashboard() {
  const {
    telemetrySnapshot,
    telemetryHistory,
    telemetryEvents,
    clearTelemetryHistory,
  } = useUnifiedSystem()

  const snapshot = telemetrySnapshot
  const history = telemetryHistory ?? []
  const events = telemetryEvents ?? []

  return (
    <div
      style={{
        display: 'grid',
        gap: 18,
        color: colors.white,
        minWidth: 0,
      }}
    >
      <header style={panelStyle}>
        <div
          style={{
            color: colors.cyan,
            letterSpacing: 2,
            fontSize: 11,
          }}
        >
          ADITI / PHASE M.2
        </div>

        <h2>Live System Telemetry</h2>

        <p
          style={{
            color: colors.muted,
            fontSize: 12,
          }}
        >
          Event-driven visualization of ADITI's
          software simulation and diagnostic state.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <span
            style={{
              color: colors.green,
              fontSize: 12,
            }}
          >
            ● SIMULATION CONNECTED
          </span>

          <button
            type="button"
            onClick={clearTelemetryHistory}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(255,0,122,0.1)',
              border:
                '1px solid rgba(255,0,122,0.4)',
              color: colors.pink,
              cursor: 'pointer',
            }}
          >
            Clear Telemetry History
          </button>
        </div>
      </header>

      <section style={panelStyle}>
        <h3>01 / Current Simulation State</h3>

        <div style={gridStyle}>
          <TelemetryCard
            title="MISSION STATUS"
            value={snapshot.missionStatus}
          />

          <TelemetryCard
            title="AI RISK"
            value={snapshot.ai.risk}
          />

          <TelemetryCard
            title="SUPPRESSION"
            value={snapshot.ai.suppression}
          />

          <TelemetryCard
            title="FEEDBACK"
            value={snapshot.ai.feedback}
          />

          <TelemetryCard
            title="ACTIVE FAULTS"
            value={snapshot.diagnostics.activeFaultCount}
            accent={
              snapshot.diagnostics.activeFaultCount > 0
                ? colors.pink
                : colors.green
            }
          />

          <TelemetryCard
            title="LAST UPDATE"
            value={formatTime(snapshot.timestamp)}
          />
        </div>
      </section>

      <section style={panelStyle}>
        <h3>02 / Estimated System Performance</h3>

        <div style={gridStyle}>
          <TelemetryCard
            title="ESTIMATED LATENCY"
            value={formatValue(
              snapshot.performance.estimatedLatencyMs,
              ' ms'
            )}
          />

          <TelemetryCard
            title="ESTIMATED POWER"
            value={formatValue(
              snapshot.performance.estimatedPowerWatts,
              ' W',
              2
            )}
          />

          <TelemetryCard
            title="VALIDATION MATCH RATE"
            value={formatValue(
              snapshot.performance.validationMatchRate,
              '%'
            )}
          />

          <TelemetryCard
            title="RECORDED SNAPSHOTS"
            value={history.length}
          />
        </div>
      </section>

      <TelemetryChart history={history} />

      <section style={panelStyle}>
        <h3>03 / Recent Telemetry Snapshots</h3>

        {history.length === 0 ? (
          <p style={{ color: colors.muted }}>
            No snapshots recorded yet.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                minWidth: 650,
                borderCollapse: 'collapse',
                fontSize: 12,
              }}
            >
              <thead>
                <tr
                  style={{
                    color: colors.cyan,
                    textAlign: 'left',
                  }}
                >
                  <th style={{ padding: 10 }}>Time</th>
                  <th style={{ padding: 10 }}>Mission</th>
                  <th style={{ padding: 10 }}>Risk</th>
                  <th style={{ padding: 10 }}>Latency</th>
                  <th style={{ padding: 10 }}>Power</th>
                  <th style={{ padding: 10 }}>Faults</th>
                </tr>
              </thead>

              <tbody>
                {history.slice(0, 12).map((entry, index) => (
                  <tr
                    key={`${entry.timestamp}-${index}`}
                    style={{
                      borderTop:
                        '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <td style={{ padding: 10 }}>
                      {formatTime(entry.timestamp)}
                    </td>

                    <td style={{ padding: 10 }}>
                      {entry.scenarioId ?? 'Idle'}
                    </td>

                    <td style={{ padding: 10 }}>
                      {entry.ai.risk}
                    </td>

                    <td style={{ padding: 10 }}>
                      {formatValue(
                        entry.performance.estimatedLatencyMs,
                        ' ms'
                      )}
                    </td>

                    <td style={{ padding: 10 }}>
                      {formatValue(
                        entry.performance.estimatedPowerWatts,
                        ' W',
                        2
                      )}
                    </td>

                    <td style={{ padding: 10 }}>
                      {entry.diagnostics.activeFaultCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <h3>04 / Latest Simulation Events</h3>

        {events.length === 0 ? (
          <p style={{ color: colors.muted }}>
            No simulation events recorded yet.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {events.slice(0, 8).map((event) => (
              <div
                key={event.id}
                style={{
                  padding: 12,
                  background: '#0c0916',
                  borderRadius: 8,
                  borderLeft: `3px solid ${
                    event.type === 'error'
                      ? colors.pink
                      : colors.cyan
                  }`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <strong style={{ fontSize: 12 }}>
                    {event.message}
                  </strong>

                  <span
                    style={{
                      color: colors.muted,
                      fontSize: 11,
                    }}
                  >
                    {formatTime(event.timestamp)}
                  </span>
                </div>

                <div
                  style={{
                    color: colors.muted,
                    fontSize: 10,
                    marginTop: 6,
                  }}
                >
                  {event.type.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
