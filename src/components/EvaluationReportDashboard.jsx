
import { useMemo, useState } from 'react'
import { useUnifiedSystem } from '../state/UnifiedSystemContext'

import {
  buildEvaluationReport,
  evaluationReportToCSV,
  downloadEvaluationFile,
} from '../utils/evaluationReportEngine'

const C = {
  cyan: '#00e7ee',
  pink: '#ff007a',
  green: '#34d399',
  muted: '#a99db8',
  text: '#f5f0fa',
}

const panel = {
  padding: 18,
  borderRadius: 14,
  border: '1px solid rgba(255,0,122,0.28)',
  background: 'rgba(18,11,31,0.94)',
  minWidth: 0,
}

const grid = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(165px, 1fr))',
  gap: 12,
}

const button = {
  padding: '11px 15px',
  borderRadius: 9,
  border: '1px solid rgba(0,231,238,0.45)',
  background: 'rgba(0,231,238,0.1)',
  color: C.cyan,
  cursor: 'pointer',
  fontSize: 12,
}

function format(value, suffix = '', digits = 1) {
  return typeof value === 'number' && Number.isFinite(value)
    ? `${value.toFixed(digits)}${suffix}`
    : 'N/A'
}

function Metric({ title, value, note }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 10,
        background: '#120b1f',
      }}
    >
      <div style={{ color: C.muted, fontSize: 11 }}>
        {title}
      </div>

      <strong
        style={{
          display: 'block',
          color: C.cyan,
          fontSize: 23,
          marginTop: 8,
          overflowWrap: 'anywhere',
        }}
      >
        {value}
      </strong>

      {note && (
        <p style={{ color: C.muted, fontSize: 11 }}>
          {note}
        </p>
      )}
    </div>
  )
}

export default function EvaluationReportDashboard() {
  const {
    performanceAnalytics,
    batchResults,
    batchRunning,
    batchError,
    runBatchValidation,
    missionHistory,
    telemetryEvents,
    faultIds,
  } = useUnifiedSystem()

  const [exportError, setExportError] = useState('')

  const report = useMemo(
    () =>
      buildEvaluationReport({
        analytics: performanceAnalytics,
        batchResults,
        missionHistory,
        telemetryEvents,
        faultIds,
      }),
    [
      performanceAnalytics,
      batchResults,
      missionHistory,
      telemetryEvents,
      faultIds,
    ]
  )

  const summary = report.summary
  const performance = report.missionPerformance

  function runEvaluation() {
    setExportError('')

    try {
      runBatchValidation()
    } catch (error) {
      console.error('Evaluation failed:', error)
    }
  }

  function exportJSON() {
    try {
      setExportError('')

      downloadEvaluationFile(
        JSON.stringify(report, null, 2),
        'ADITI_Evaluation_Report.json',
        'application/json'
      )
    } catch (error) {
      setExportError(error.message)
    }
  }

  function exportCSV() {
    try {
      setExportError('')

      downloadEvaluationFile(
        evaluationReportToCSV(report),
        'ADITI_Scenario_Results.csv',
        'text/csv;charset=utf-8'
      )
    } catch (error) {
      setExportError(error.message)
    }
  }

  function printReport() {
    window.print()
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 18,
        color: C.text,
        minWidth: 0,
      }}
    >
      <header style={panel}>
        <div
          style={{
            color: C.cyan,
            letterSpacing: 2,
            fontSize: 11,
          }}
        >
          ADITI / PHASE O
        </div>

        <h2>Testing & Evaluation Reports</h2>

        <p style={{ color: C.muted, fontSize: 12 }}>
          Structured evaluation of ADITI's simulation,
          AI decision consistency, mission performance,
          and diagnostic events.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <button
            type="button"
            style={button}
            disabled={batchRunning}
            onClick={runEvaluation}
          >
            {batchRunning
              ? 'Evaluating...'
              : '▶ Run Full Evaluation'}
          </button>

          <button
            type="button"
            style={button}
            onClick={exportJSON}
          >
            Download JSON
          </button>

          <button
            type="button"
            style={button}
            onClick={exportCSV}
          >
            Download CSV
          </button>

          <button
            type="button"
            style={button}
            onClick={printReport}
          >
            Print / Save PDF
          </button>
        </div>

        {(batchError || exportError) && (
          <p role="alert" style={{ color: C.pink }}>
            {batchError || exportError}
          </p>
        )}
      </header>

      <section style={panel}>
        <h3>01 / Evaluation Summary</h3>

        <div style={grid}>
          <Metric
            title="Scenarios Tested"
            value={summary.scenariosTested}
          />

          <Metric
            title="Scenarios Matched"
            value={summary.scenariosMatched}
          />

          <Metric
            title="Mismatched"
            value={summary.scenariosMismatched}
          />

          <Metric
            title="Decision Match Rate"
            value={format(
              summary.overallDecisionMatchRate,
              '%'
            )}
          />
        </div>
      </section>

      <section style={panel}>
        <h3>02 / Decision Evaluation</h3>

        <div style={grid}>
          {['risk', 'suppression', 'feedback'].map(
            (key) => (
              <Metric
                key={key}
                title={`${key.toUpperCase()} MATCH RATE`}
                value={format(
                  summary.decisionMatchRates[key],
                  '%'
                )}
              />
            )
          )}
        </div>
      </section>

      <section style={panel}>
        <h3>03 / Mission Performance</h3>

        <div style={grid}>
          <Metric
            title="Recorded Missions"
            value={performance.totalRecordedMissions}
          />

          <Metric
            title="Average Estimated Latency"
            value={format(
              performance.estimatedAverageLatencyMs,
              ' ms'
            )}
          />

          <Metric
            title="Average Estimated Power"
            value={format(
              performance.estimatedAveragePowerWatts,
              ' W',
              2
            )}
          />

          <Metric
            title="Active Simulated Faults"
            value={report.diagnostics.activeFaultCount}
          />
        </div>
      </section>

      <section style={panel}>
        <h3>04 / Scenario-by-Scenario Evaluation</h3>

        {!summary.validationAvailable ? (
          <p style={{ color: C.muted, fontSize: 12 }}>
            Run Full Evaluation to generate scenario results.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                minWidth: 760,
                borderCollapse: 'collapse',
                fontSize: 12,
              }}
            >
              <thead>
                <tr
                  style={{
                    textAlign: 'left',
                    color: C.cyan,
                  }}
                >
                  {[
                    'Scenario',
                    'Risk',
                    'Suppression',
                    'Feedback',
                    'Result',
                  ].map((label) => (
                    <th
                      key={label}
                      style={{ padding: 12 }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {report.scenarioResults.map((row) => (
                  <tr
                    key={row.id}
                    style={{
                      borderTop:
                        '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <td style={{ padding: 12 }}>
                      {row.name}
                    </td>

                    <td style={{ padding: 12 }}>
                      {row.actualRisk ?? 'N/A'}
                    </td>

                    <td style={{ padding: 12 }}>
                      {row.actualSuppression ?? 'N/A'}
                    </td>

                    <td style={{ padding: 12 }}>
                      {row.actualFeedback ?? 'N/A'}
                    </td>

                    <td
                      style={{
                        padding: 12,
                        color: row.overallMatch
                          ? C.green
                          : C.pink,
                      }}
                    >
                      {row.overallMatch
                        ? 'MATCH'
                        : 'MISMATCH'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={panel}>
        <h3>05 / Evaluation Limitations</h3>

        <ul
          style={{
            paddingLeft: 20,
            color: C.muted,
            fontSize: 12,
            lineHeight: 1.9,
          }}
        >
          {report.limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <footer
        style={{
          color: C.muted,
          fontSize: 11,
        }}
      >
        Generated from the current application state.
        Run validation before exporting the report.
        Results reset on page reload unless separately saved.
      </footer>
    </div>
  )
}
