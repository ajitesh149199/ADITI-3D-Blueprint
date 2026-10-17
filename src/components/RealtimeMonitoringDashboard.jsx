
import { useState } from 'react'

import { useUnifiedSystem } from '../state/UnifiedSystemContext'
import LiveTelemetryDashboard from './LiveTelemetryDashboard'
import PerformanceDashboard from './PerformanceDashboard'
import LiveEventTimeline from './LiveEventTimeline'
import EvaluationReportDashboard from './EvaluationReportDashboard'

const TABS = [
  { id: 'telemetry', label: 'LIVE TELEMETRY' },
  { id: 'performance', label: 'PERFORMANCE' },
  { id: 'events', label: 'EVENT TIMELINE' },
  { id: 'evaluation', label: 'EVALUATION REPORTS' },
]

const COLORS = {
  cyan: '#00e7ee',
  pink: '#ff007a',
  green: '#34d399',
  muted: '#a99db8',
  text: '#f5f0fa',
  background: '#120b1f',
}

function StatusItem({ label, value, color }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        flexWrap: 'wrap',
        fontSize: 11,
      }}
    >
      <span style={{ color: COLORS.muted }}>
        {label}
      </span>

      <strong style={{ color: color ?? COLORS.text }}>
        {value}
      </strong>
    </div>
  )
}

export default function RealtimeMonitoringDashboard() {
  const [activeTab, setActiveTab] = useState('telemetry')

  const {
    telemetrySnapshot,
    telemetryHistory,
    telemetryEvents,
    performanceAnalytics,
  } = useUnifiedSystem()

  const faults =
    telemetrySnapshot?.diagnostics?.activeFaultCount ?? 0

  const matchRate =
    performanceAnalytics?.validation?.matchRate

  return (
    <section
      style={{
        display: 'grid',
        gap: 16,
        minWidth: 0,
        color: COLORS.text,
      }}
    >
      <header
        style={{
          padding: 18,
          borderRadius: 14,
          border: '1px solid rgba(255,0,122,0.3)',
          background: 'rgba(18,11,31,0.95)',
        }}
      >
        <div
          style={{
            color: COLORS.cyan,
            fontSize: 11,
            letterSpacing: 2,
          }}
        >
          ADITI / PHASE M.4
        </div>

        <h2>Real-Time System Monitoring</h2>

        <p
          style={{
            color: COLORS.muted,
            fontSize: 12,
          }}
        >
          Unified monitoring for simulated AI decisions,
          diagnostics, performance, and system events.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 18,
            marginTop: 16,
          }}
        >
          <StatusItem
            label="SYSTEM"
            value="SIMULATION READY"
            color={COLORS.green}
          />

          <StatusItem
            label="MISSION"
            value={
              telemetrySnapshot?.missionStatus ?? 'Idle'
            }
            color={COLORS.cyan}
          />

          <StatusItem
            label="FAULTS"
            value={faults}
            color={
              faults > 0 ? COLORS.pink : COLORS.green
            }
          />

          <StatusItem
            label="MATCH RATE"
            value={
              typeof matchRate === 'number'
                ? `${matchRate.toFixed(1)}%`
                : 'N/A'
            }
          />

          <StatusItem
            label="SNAPSHOTS"
            value={telemetryHistory?.length ?? 0}
          />

          <StatusItem
            label="EVENTS"
            value={telemetryEvents?.length ?? 0}
          />
        </div>
      </header>

      <nav
        aria-label="Real-time monitoring views"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
            style={{
              padding: '12px 16px',
              borderRadius: 9,
              border:
                activeTab === tab.id
                  ? `1px solid ${COLORS.cyan}`
                  : '1px solid rgba(255,255,255,0.12)',
              background:
                activeTab === tab.id
                  ? 'rgba(0,231,238,0.12)'
                  : COLORS.background,
              color:
                activeTab === tab.id
                  ? COLORS.cyan
                  : COLORS.muted,
              fontSize: 11,
              letterSpacing: 1,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div
        role="region"
        aria-label={`${activeTab} monitoring panel`}
        style={{ minWidth: 0 }}
      >
        {activeTab === 'telemetry' && (
          <LiveTelemetryDashboard />
        )}

        {activeTab === 'performance' && (
          <PerformanceDashboard />
        )}

        {activeTab === 'events' && (
          <LiveEventTimeline />
        )}

        {activeTab === 'evaluation' && (
          <EvaluationReportDashboard />
        )}
      </div>
    </section>
  )
}
