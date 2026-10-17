
import { useMemo, useState } from 'react'
import { useUnifiedSystem } from '../state/UnifiedSystemContext'

const COLORS = {
  background: '#120b1f',
  cyan: '#00e7ee',
  pink: '#ff007a',
  green: '#34d399',
  yellow: '#fbbf24',
  text: '#f5f0fa',
  muted: '#a99db8',
}

const EVENT_TYPES = {
  mission: {
    label: 'MISSION',
    color: COLORS.cyan,
    icon: '▶',
  },
  diagnostic: {
    label: 'DIAGNOSTIC',
    color: COLORS.yellow,
    icon: '⚙',
  },
  validation: {
    label: 'VALIDATION',
    color: COLORS.green,
    icon: '✓',
  },
  error: {
    label: 'ERROR',
    color: COLORS.pink,
    icon: '!',
  },
}

function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A'

  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) return 'N/A'

  return date.toLocaleString()
}

function EventItem({ event, isLast }) {
  const config = EVENT_TYPES[event.type] ?? {
    label: 'SYSTEM',
    color: COLORS.cyan,
    icon: '●',
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '32px minmax(0, 1fr)',
        gap: 14,
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: COLORS.background,
            border: `1px solid ${config.color}`,
            color: config.color,
            fontSize: 13,
            zIndex: 1,
          }}
        >
          {config.icon}
        </div>

        {!isLast && (
          <div
            style={{
              width: 1,
              flex: 1,
              minHeight: 20,
              background: 'rgba(255,255,255,0.15)',
            }}
          />
        )}
      </div>

      <div
        style={{
          padding: 14,
          marginBottom: 14,
          background: 'rgba(12,9,22,0.85)',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.07)',
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span
            style={{
              color: config.color,
              fontSize: 10,
              letterSpacing: 1.5,
              fontWeight: 700,
            }}
          >
            {config.label}
          </span>

          <time
            dateTime={event.timestamp}
            style={{
              color: COLORS.muted,
              fontSize: 11,
            }}
          >
            {formatTimestamp(event.timestamp)}
          </time>
        </div>

        <p
          style={{
            color: COLORS.text,
            fontSize: 13,
            marginTop: 10,
            marginBottom: 0,
            overflowWrap: 'anywhere',
          }}
        >
          {event.message}
        </p>

        {event.details !== null &&
          event.details !== undefined && (
            <details style={{ marginTop: 12 }}>
              <summary
                style={{
                  cursor: 'pointer',
                  color: COLORS.cyan,
                  fontSize: 11,
                }}
              >
                View Event Details
              </summary>

              <pre
                style={{
                  padding: 12,
                  marginTop: 8,
                  background: COLORS.background,
                  borderRadius: 8,
                  fontSize: 11,
                  color: COLORS.muted,
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                }}
              >
                {JSON.stringify(event.details, null, 2)}
              </pre>
            </details>
          )}
      </div>
    </div>
  )
}

export default function LiveEventTimeline() {
  const { telemetryEvents, clearTelemetryHistory } =
    useUnifiedSystem()

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const events = telemetryEvents ?? []

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase()

    return events.filter((event) => {
      const matchesType =
        filter === 'all' || event.type === filter

      const matchesSearch =
        !query ||
        String(event.message ?? '')
          .toLowerCase()
          .includes(query) ||
        String(event.type ?? '')
          .toLowerCase()
          .includes(query)

      return matchesType && matchesSearch
    })
  }, [events, filter, search])

  const counts = useMemo(
    () => ({
      all: events.length,
      mission: events.filter(
        (event) => event.type === 'mission'
      ).length,
      diagnostic: events.filter(
        (event) => event.type === 'diagnostic'
      ).length,
      validation: events.filter(
        (event) => event.type === 'validation'
      ).length,
      error: events.filter(
        (event) => event.type === 'error'
      ).length,
    }),
    [events]
  )

  const filters = [
    ['all', 'ALL'],
    ['mission', 'MISSIONS'],
    ['diagnostic', 'DIAGNOSTICS'],
    ['validation', 'VALIDATION'],
    ['error', 'ERRORS'],
  ]

  return (
    <section
      style={{
        padding: 18,
        borderRadius: 14,
        border: '1px solid rgba(255,0,122,0.28)',
        background: 'rgba(18,11,31,0.94)',
        color: COLORS.text,
        minWidth: 0,
      }}
    >
      <header>
        <div
          style={{
            color: COLORS.cyan,
            letterSpacing: 2,
            fontSize: 11,
          }}
        >
          ADITI / PHASE M.3
        </div>

        <h2>Live System Event Timeline</h2>

        <p
          style={{
            color: COLORS.muted,
            fontSize: 12,
          }}
        >
          Chronological activity log generated by ADITI's
          shared simulation and diagnostic engines.
        </p>
      </header>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 20,
        }}
      >
        {filters.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border:
                filter === key
                  ? `1px solid ${COLORS.cyan}`
                  : '1px solid rgba(255,255,255,0.12)',
              background:
                filter === key
                  ? 'rgba(0,231,238,0.12)'
                  : COLORS.background,
              color:
                filter === key
                  ? COLORS.cyan
                  : COLORS.muted,
              fontSize: 10,
              cursor: 'pointer',
            }}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginTop: 16,
          alignItems: 'center',
        }}
      >
        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search system events..."
          aria-label="Search system events"
          style={{
            flex: '1 1 220px',
            minWidth: 0,
            padding: 11,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)',
            background: COLORS.background,
            color: COLORS.text,
            outline: 'none',
          }}
        />

        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                'Clear all telemetry snapshots and events?'
              )
            ) {
              clearTelemetryHistory()
            }
          }}
          style={{
            padding: '11px 14px',
            borderRadius: 8,
            border: `1px solid ${COLORS.pink}`,
            background: 'rgba(255,0,122,0.1)',
            color: COLORS.pink,
            cursor: 'pointer',
          }}
        >
          Clear All Events
        </button>
      </div>

      <div
        style={{
          marginTop: 20,
          maxHeight: 540,
          overflowY: 'auto',
          paddingRight: 6,
        }}
        aria-live="polite"
      >
        {filteredEvents.length === 0 ? (
          <div
            style={{
              padding: 30,
              textAlign: 'center',
              color: COLORS.muted,
              border: '1px dashed rgba(255,255,255,0.12)',
              borderRadius: 10,
              fontSize: 12,
            }}
          >
            {events.length === 0
              ? 'No events recorded. Run a mission or change a diagnostic fault.'
              : 'No events match the selected filters.'}
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <EventItem
              key={event.id}
              event={event}
              isLast={index === filteredEvents.length - 1}
            />
          ))
        )}
      </div>

      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 14,
          marginTop: 12,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          color: COLORS.muted,
          fontSize: 11,
        }}
      >
        <span>
          Displaying {filteredEvents.length} of {events.length} events
        </span>

        <span>
          Newest first · Maximum 100 stored events
        </span>
      </footer>
    </section>
  )
}
