
import { useState } from 'react'

import { MISSIONS, MISSION_FAULTS } from '../data/missionData'
import { evaluateMission } from '../utils/missionEngine'
import { useUnifiedSystem } from '../state/UnifiedSystemContext'
import RealtimeMonitoringDashboard from './RealtimeMonitoringDashboard'

const panel = {
  padding: 18,
  border: '1px solid rgba(255,0,122,0.28)',
  borderRadius: 14,
  background: 'rgba(18,11,31,0.92)',
  minWidth: 0,
}

const button = {
  padding: '10px 14px',
  border: '1px solid rgba(0,231,238,0.4)',
  borderRadius: 9,
  background: 'rgba(0,231,238,0.09)',
  color: '#00e7ee',
  cursor: 'pointer',
}

const field = {
  width: '100%',
  minWidth: 0,
  padding: 10,
  boxSizing: 'border-box',
  background: '#0c0716',
  color: '#f5f0fa',
  border: '1px solid rgba(255,0,122,0.4)',
}

const colors = {
  Completed: '#34d399',
  Degraded: '#fbbf24',
  Blocked: '#fb7185',
  Mismatch: '#fb7185',
  Error: '#fb7185',
}

const categories = [
  'All',
  'Vision',
  'Navigation',
  'Safety',
  'System',
]

const decisionKeys = ['risk', 'suppression', 'feedback']

const muted = {
  color: '#a99db8',
  fontSize: 12,
}

const responsiveGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: 12,
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        padding: 13,
        borderRadius: 10,
        background: '#120d20',
        minWidth: 0,
      }}
    >
      <div style={{ color: '#a99db8', fontSize: 11 }}>
        {label}
      </div>

      <strong
        style={{
          display: 'block',
          marginTop: 8,
          color: '#00e7ee',
          overflowWrap: 'anywhere',
        }}
      >
        {value ?? 'N/A'}
      </strong>
    </div>
  )
}

function DecisionComparison({
  expected,
  actual,
  comparison,
}) {
  if (!comparison) {
    return <p style={muted}>No decision comparison available.</p>
  }

  return (
    <div
      style={{
        padding: 14,
        border: '1px solid rgba(0,231,238,0.3)',
        borderRadius: 10,
        background: 'rgba(0,231,238,0.05)',
      }}
    >
      <h3>AI Decision Validation</h3>

      {decisionKeys.map((key) => {
        const matched = comparison[key] === true

        return (
          <div
            key={key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              padding: '9px 0',
              borderBottom:
                '1px solid rgba(255,255,255,0.08)',
              fontSize: 12,
            }}
          >
            <strong>{key.toUpperCase()}</strong>
            <span>Expected: {expected?.[key] ?? 'N/A'}</span>
            <span>Actual: {actual?.[key] ?? 'N/A'}</span>
            <strong
              style={{
                color: matched ? '#34d399' : '#fb7185',
              }}
            >
              {matched ? 'MATCH' : 'MISMATCH'}
            </strong>
          </div>
        )
      })}
    </div>
  )
}

export default function MissionControlDashboard() {
  const {
    faultIds: sharedFaultIds,
    runMission: runUnifiedMission,
    batchResults,
    batchError,
    batchRunning,
    lastValidationTime,
    runBatchValidation,
  } = useUnifiedSystem()

  const [category, setCategory] = useState('All')
  const [missionId, setMissionId] = useState(
    MISSIONS[0]?.id ?? ''
  )
  const [faultId, setFaultId] = useState('none')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')

  const filteredMissions = MISSIONS.filter(
    (item) =>
      category === 'All' || item.category === category
  )

  const mission =
    MISSIONS.find((item) => item.id === missionId) ?? null

  const summary = {
    total: history.length,
    completed: history.filter(
      (entry) => entry.status === 'Completed'
    ).length,
    degraded: history.filter(
      (entry) => entry.status === 'Degraded'
    ).length,
    blocked: history.filter(
      (entry) => entry.status === 'Blocked'
    ).length,
    mismatches: history.filter(
      (entry) => entry.status === 'Mismatch'
    ).length,
  }

  function changeCategory(nextCategory) {
    setCategory(nextCategory)

    const matches = MISSIONS.filter(
      (item) =>
        nextCategory === 'All' ||
        item.category === nextCategory
    )

    if (!matches.some((item) => item.id === missionId)) {
      setMissionId(matches[0]?.id ?? '')
    }

    setResult(null)
    setError('')
  }

  function resetConfiguration() {
    setCategory('All')
    setMissionId(MISSIONS[0]?.id ?? '')
    setFaultId('none')
    setResult(null)
    setError('')
  }

  function runMission() {
    if (!mission) return

    setError('')

    try {
      const additionalFaults =
        faultId === 'none' ? [] : [faultId]

      const unified = runUnifiedMission(
        mission.id,
        additionalFaults
      )

      const legacyEstimate = evaluateMission(
        mission,
        faultId
      )

      const actual = unified.actual
      const blocked = unified.status === 'Blocked'

      const activePower = blocked
        ? 0
        : Number(unified.power?.totalWatts ?? 0)

      const baselinePower = Number(
        mission.baselinePower ?? 0
      )

      const durationHours =
        Number(mission.duration ?? 60) / 3600

      const outputs =
        blocked || unified.feedbackUnavailable
          ? []
          : actual?.feedback &&
              actual.feedback !== 'none'
            ? [
                actual.feedback.charAt(0).toUpperCase() +
                  actual.feedback.slice(1),
              ]
            : []

      let explanation =
        'Scenario processed by the ADITI AI engine.'

      if (blocked) {
        explanation = `Required sensors unavailable: ${
          (unified.missingSensors ?? []).join(', ')
        }`
      } else if (unified.status === 'Mismatch') {
        explanation =
          'Computed AI decisions differ from one or more expected scenario results.'
      } else if (unified.status === 'Degraded') {
        explanation =
          'Mission evaluated with simulated fault or resource limitations.'
      }

      const record = {
        ...legacyEstimate,
        id: `${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString(),
        missionName: mission.name,
        status: unified.status,
        explanation,
        risk: actual?.risk ?? 'N/A',
        suppression: actual?.suppression ?? 'N/A',
        expectedFeedback:
          unified.expected?.feedback ?? 'N/A',
        outputs,
        latency: unified.estimatedLatency,
        activePower,
        activeEnergyWh: blocked
          ? 0
          : activePower * durationHours,
        baselineEnergyWh: blocked
          ? 0
          : baselinePower * durationHours,
        savingsPercent:
          blocked || baselinePower <= 0
            ? 0
            : Math.round(
                (1 - activePower / baselinePower) * 100
              ),
        stages: blocked
          ? ['Preflight Check']
          : legacyEstimate.stages,
        unified,
      }

      setResult(record)
      setHistory((previous) =>
        [record, ...previous].slice(0, 30)
      )
    } catch (caughtError) {
      console.error(
        'ADITI Mission Control execution error:',
        caughtError
      )

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'An unexpected mission error occurred.'
      )
    }
  }

  function runAllScenarios() {
    try {
      runBatchValidation()
    } catch (caughtError) {
      console.error(
        'Mission Control batch validation error:',
        caughtError
      )
    }
  }

  const matchRate =
    batchResults?.total > 0
      ? (batchResults.passed / batchResults.total) * 100
      : null

  return (
    <div
      style={{
        display: 'grid',
        gap: 18,
        color: '#f5f0fa',
        minWidth: 0,
      }}
    >
        {/* PHASE M.4 — INTEGRATED MONITORING */}
<RealtimeMonitoringDashboard />

      {/* HEADER */}

      <header style={panel}>
        <div style={{ color: '#00e7ee', fontSize: 11 }}>
          ADITI / PHASE L.1
        </div>

        <h1>Intelligent Mission Control</h1>

        <p style={muted}>
          Unified scenario evaluation using ADITI's
          existing AI processing engine. Sensor faults,
          latency and energy values are simulated.
        </p>

        <strong style={{ color: '#00e7ee' }}>
          {MISSIONS.length} SCENARIOS AVAILABLE
        </strong>
      </header>

      {/* 01 — MISSION CONFIGURATION */}

      <section style={panel}>
        <h2>01 / Mission Configuration</h2>

        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 18,
          }}
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              style={{
                ...button,
                background:
                  category === item
                    ? 'rgba(255,0,122,0.2)'
                    : button.background,
                borderColor:
                  category === item
                    ? '#ff007a'
                    : 'rgba(0,231,238,0.4)',
              }}
              onClick={() => changeCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 14,
          }}
        >
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontSize: 12 }}>
              SELECT MISSION
            </span>

            <select
              value={missionId}
              style={field}
              onChange={(event) => {
                setMissionId(event.target.value)
                setResult(null)
                setError('')
              }}
            >
              {filteredMissions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontSize: 12 }}>
              FAULT CONDITION
            </span>

            <select
              value={faultId}
              style={field}
              onChange={(event) => {
                setFaultId(event.target.value)
                setResult(null)
                setError('')
              }}
            >
              {MISSION_FAULTS.map((fault) => (
                <option key={fault.id} value={fault.id}>
                  {fault.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {mission && (
          <div
            style={{
              marginTop: 18,
              fontSize: 12,
              lineHeight: 1.8,
            }}
          >
            <p>
              <strong>Category:</strong> {mission.category}
            </p>
            <p>
              <strong>Objective:</strong> {mission.objective}
            </p>
            <p>
              <strong>Description:</strong>{' '}
              {mission.description}
            </p>
            <p>
              <strong>Required Sensors:</strong>{' '}
              {(mission.requiredSensors ?? []).join(', ')}
            </p>
            <p>
              <strong>Shared Diagnostic Faults:</strong>{' '}
              {sharedFaultIds.length
                ? sharedFaultIds.join(', ')
                : 'None'}
            </p>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            marginTop: 16,
          }}
        >
          <button
            type="button"
            style={button}
            disabled={!mission}
            onClick={runMission}
          >
            ▶ Run Mission
          </button>

          <button
            type="button"
            style={button}
            onClick={resetConfiguration}
          >
            ↺ Reset Configuration
          </button>
        </div>

        {error && (
          <p role="alert" style={{ color: '#fb7185' }}>
            Mission error: {error}
          </p>
        )}
      </section>

      {/* 02 — MISSION RESULT */}

      <section style={panel}>
        <h2>02 / Mission Result</h2>

        {!result ? (
          <p style={muted}>
            Select a scenario and click Run Mission.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            <strong
              style={{
                color:
                  colors[result.status] ?? '#f5f0fa',
                fontSize: 20,
              }}
            >
              {result.status.toUpperCase()}
            </strong>

            <p style={{ fontSize: 13 }}>
              {result.explanation}
            </p>

            <div style={responsiveGrid}>
              <Stat
                label="Computed Risk"
                value={result.risk}
              />
              <Stat
                label="Computed Suppression"
                value={result.suppression}
              />
              <Stat
                label="Expected Feedback"
                value={result.expectedFeedback}
              />
              <Stat
                label="Estimated Latency"
                value={
                  result.latency == null
                    ? 'N/A'
                    : `${result.latency} ms`
                }
              />
            </div>

            <div style={{ fontSize: 12 }}>
              <strong>Available Feedback Outputs</strong>
              <p>
                {result.outputs.length
                  ? result.outputs.join(' + ')
                  : 'None'}
              </p>
            </div>

            {result?.unified?.comparison && (
              <DecisionComparison
                expected={result.unified.expected}
                actual={result.unified.actual}
                comparison={result.unified.comparison}
              />
            )}
          </div>
        )}
      </section>

      {/* 03 — DECISION PIPELINE */}

      <section style={panel}>
        <h2>03 / Decision Pipeline</h2>

        {!result ? (
          <p style={muted}>
            Run a mission to inspect its processing stages.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(170px, 1fr))',
              gap: 10,
            }}
          >
            {(result.stages ?? []).map((stage, index) => (
              <div
                key={`${stage}-${index}`}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  border:
                    '1px solid rgba(0,231,238,0.3)',
                  background: 'rgba(0,231,238,0.06)',
                }}
              >
                <div
                  style={{
                    color: '#00e7ee',
                    fontSize: 11,
                    marginBottom: 6,
                  }}
                >
                  STAGE {index + 1}
                </div>

                <strong style={{ fontSize: 12 }}>
                  {stage}
                </strong>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 04 — ENERGY EVALUATION */}

      <section style={panel}>
        <h2>04 / Mission Energy Evaluation</h2>

        {!result ? (
          <p style={muted}>
            Run a mission to calculate estimated energy.
          </p>
        ) : result.status === 'Blocked' ? (
          <p style={{ color: '#fb7185', fontSize: 12 }}>
            Mission blocked during preflight. No mission
            energy estimate calculated.
          </p>
        ) : (
          <div style={responsiveGrid}>
            <Stat
              label="Estimated Mission Power"
              value={`${result.activePower.toFixed(2)} W`}
            />
            <Stat
              label="Mission Energy"
              value={`${result.activeEnergyWh.toFixed(4)} Wh`}
            />
            <Stat
              label="Baseline Energy"
              value={`${result.baselineEnergyWh.toFixed(4)} Wh`}
            />
            <Stat
              label="Estimated Power Difference"
              value={`${result.savingsPercent}%`}
            />
          </div>
        )}

        <p
          style={{
            ...muted,
            marginTop: 14,
            fontSize: 11,
          }}
        >
          Power and latency are illustrative estimates.
          Negative power difference indicates estimated
          consumption above the baseline.
        </p>
      </section>

      {/* 05 — MISSION HISTORY */}

      <section style={panel}>
        <h2>05 / Mission Evaluation History</h2>

        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 14,
            fontSize: 12,
          }}
        >
          <span>Total: {summary.total}</span>
          <span>Completed: {summary.completed}</span>
          <span>Degraded: {summary.degraded}</span>
          <span>Blocked: {summary.blocked}</span>
          <span>Mismatches: {summary.mismatches}</span>
        </div>

        <button
          type="button"
          style={button}
          onClick={() => setHistory([])}
        >
          Clear History
        </button>

        <div
          style={{
            display: 'grid',
            gap: 8,
            marginTop: 14,
          }}
        >
          {history.length === 0 ? (
            <p style={muted}>
              No mission evaluations recorded.
            </p>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                style={{
                  padding: 12,
                  border:
                    '1px solid rgba(255,0,122,0.18)',
                  borderRadius: 9,
                  fontSize: 12,
                }}
              >
                <strong>{entry.missionName}</strong>

                <div
                  style={{
                    marginTop: 6,
                    color:
                      colors[entry.status] ?? '#f5f0fa',
                  }}
                >
                  {entry.status}
                </div>

                <div
                  style={{
                    marginTop: 5,
                    color: '#a99db8',
                    fontSize: 11,
                  }}
                >
                  {entry.time} · Fault:{' '}
                  {entry.unified?.faults?.length
                    ? entry.unified.faults.join(', ')
                    : 'None'}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 06 — FULL SCENARIO VALIDATION */}

      <section style={panel}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                color: '#00e7ee',
                fontSize: 11,
              }}
            >
              PHASE L.1 / SHARED VALIDATION
            </div>
            <h2>06 / Full Scenario Validation</h2>
          </div>

          <button
            type="button"
            style={button}
            disabled={batchRunning}
            onClick={runAllScenarios}
          >
            {batchRunning
              ? 'Validating...'
              : `▶ Run All ${MISSIONS.length} Scenarios`}
          </button>
        </div>

        <p style={muted}>
          Runs every official ADITI scenario through the
          existing AI processing engine and compares risk,
          suppression and feedback against predefined
          expectations. This batch uses normal operation,
          without injected faults.
        </p>

        {lastValidationTime && (
          <p style={{ color: '#00e7ee', fontSize: 11 }}>
            Last validation:{' '}
            {new Date(lastValidationTime).toLocaleString()}
          </p>
        )}

        {batchError && (
          <p
            role="alert"
            style={{
              color: '#fb7185',
              fontSize: 12,
            }}
          >
            Validation error: {batchError}
          </p>
        )}

        {!batchResults ? (
          <p style={{ ...muted, marginTop: 18 }}>
            No batch validation has been executed yet.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: 18 }}>
            <div style={responsiveGrid}>
              <Stat
                label="Scenarios Tested"
                value={batchResults.total}
              />
              <Stat
                label="Fully Matched"
                value={batchResults.passed}
              />
              <Stat
                label="Mismatched"
                value={batchResults.mismatches}
              />
              <Stat
                label="Match Rate"
                value={
                  matchRate == null
                    ? 'N/A'
                    : `${matchRate.toFixed(1)}%`
                }
              />
            </div>

            <div
              style={{
                width: '100%',
                height: 9,
                borderRadius: 99,
                overflow: 'hidden',
                background: '#21152f',
              }}
            >
              <div
                style={{
                  width: `${matchRate ?? 0}%`,
                  height: '100%',
                  background: '#34d399',
                }}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  minWidth: 750,
                  borderCollapse: 'collapse',
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr
                    style={{
                      color: '#00e7ee',
                      textAlign: 'left',
                      borderBottom:
                        '1px solid rgba(0,231,238,0.3)',
                    }}
                  >
                    {[
                      'Scenario',
                      'Risk',
                      'Suppression',
                      'Feedback',
                      'Result',
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{ padding: 12 }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {(batchResults.results ?? []).map(
                    (entry) => (
                      <tr
                        key={entry.id}
                        style={{
                          borderBottom:
                            '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        <td style={{ padding: 12 }}>
                          <strong>{entry.name}</strong>
                        </td>

                        {decisionKeys.map((key) => (
                          <td
                            key={key}
                            style={{ padding: 12 }}
                          >
                            <div
                              style={{
                                color:
                                  entry.comparison?.[key]
                                    ? '#34d399'
                                    : '#fb7185',
                                marginBottom: 4,
                              }}
                            >
                              {entry.comparison?.[key]
                                ? '✓ MATCH'
                                : '✕ MISMATCH'}
                            </div>

                            <div style={{ color: '#a99db8' }}>
                              E:{' '}
                              {entry.expected?.[key] ??
                                'N/A'}
                            </div>

                            <div>
                              A:{' '}
                              {entry.actual?.[key] ??
                                'N/A'}
                            </div>
                          </td>
                        ))}

                        <td style={{ padding: 12 }}>
                          <strong
                            style={{
                              color:
                                colors[entry.status] ??
                                '#f5f0fa',
                            }}
                          >
                            {entry.status}
                          </strong>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <p style={{ ...muted, fontSize: 11 }}>
              E = Expected, A = Actual. The match rate
              measures agreement with predefined software
              expectations, not real-world detection
              accuracy or assistive-device safety.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
