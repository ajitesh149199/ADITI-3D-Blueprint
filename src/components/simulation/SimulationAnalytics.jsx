
import { useSimulation } from '../../state/SimulationContext'
import './SimulationAnalytics.css'

// ============================================================
// ADITI — SIMULATION ANALYTICS DASHBOARD
// ============================================================

export default function SimulationAnalytics() {
  const {
    isRunning,
    analyticsSummary,
  } = useSimulation()

  const summary = analyticsSummary

  const totalCycles = summary?.totalCycles ?? 0
  const suppressionRate = summary?.suppressionRate ?? 0
  const averageRelevance = summary?.averageRelevance ?? 0
  const averageRisk = summary?.averageRisk ?? 0

  const suppression = summary?.suppressed ?? 0
  const delayed = summary?.delayed ?? 0
  const kept = summary?.kept ?? 0

  const feedback = summary?.feedbackCounts ?? {}
  const risk = summary?.riskCounts ?? {}

  const feedbackItems = [
    { label: 'Audio', count: feedback.audio ?? 0 },
    { label: 'Haptic', count: feedback.haptic ?? 0 },
    { label: 'Visual', count: feedback.visual ?? 0 },
    { label: 'None', count: feedback.none ?? 0 },
  ]

  const riskItems = [
    { label: 'Low', count: risk.low ?? 0 },
    { label: 'Medium', count: risk.medium ?? 0 },
    { label: 'High', count: risk.high ?? 0 },
  ]

  const percentOfTotal = (count) =>
    totalCycles > 0 ? (count / totalCycles) * 100 : 0

  return (
    <section className="aditi-analytics-panel">
      <div className="aditi-analytics-heading">
        <div>
          <span>07 / PERFORMANCE ANALYTICS</span>
          <h2>ADITI Simulation Analytics</h2>
        </div>

        <span className="aditi-analytics-status">
          {isRunning ? '● RECORDING' : '○ PAUSED'}
        </span>
      </div>

      <div className="aditi-analytics-grid">
        <article className="aditi-analytics-card">
          <span>TOTAL CYCLES</span>
          <strong className="analytics-cyan">
            {totalCycles}
          </strong>
          <small>Completed processing cycles</small>
        </article>

        <article className="aditi-analytics-card">
          <span>SUPPRESSION RATE</span>
          <strong className="analytics-magenta">
            {suppressionRate.toFixed(1)}%
          </strong>
          <small>Suppressed decisions</small>
        </article>

        <article className="aditi-analytics-card">
          <span>AVG. RELEVANCE</span>
          <strong className="analytics-green">
            {averageRelevance.toFixed(3)}
          </strong>
          <small>Average simulated relevance</small>
        </article>

        <article className="aditi-analytics-card">
          <span>AVG. RISK</span>
          <strong className="analytics-yellow">
            {averageRisk.toFixed(3)}
          </strong>
          <small>Average simulated risk</small>
        </article>
      </div>

      <div className="aditi-analytics-details">
        <div className="aditi-analytics-section">
          <h3>Suppression Decisions</h3>

          <div className="aditi-analytics-counts">
            <div>
              <span>KEPT</span>
              <strong>{kept}</strong>
            </div>
            <div>
              <span>DELAYED</span>
              <strong>{delayed}</strong>
            </div>
            <div>
              <span>SUPPRESSED</span>
              <strong>{suppression}</strong>
            </div>
          </div>
        </div>

        <div className="aditi-analytics-section">
          <h3>Feedback Distribution</h3>

          {feedbackItems.map((item) => (
            <div
              className="aditi-analytics-bar-row"
              key={item.label}
            >
              <span>{item.label}</span>

              <div className="aditi-analytics-track">
                <div
                  className="aditi-analytics-fill"
                  style={{
                    width: `${percentOfTotal(item.count)}%`,
                  }}
                />
              </div>

              <strong>{item.count}</strong>
            </div>
          ))}
        </div>

        <div className="aditi-analytics-section">
          <h3>Risk Distribution</h3>

          {riskItems.map((item) => (
            <div
              className="aditi-analytics-bar-row"
              key={item.label}
            >
              <span>{item.label}</span>

              <div className="aditi-analytics-track">
                <div
                  className="aditi-analytics-fill risk-fill"
                  style={{
                    width: `${percentOfTotal(item.count)}%`,
                  }}
                />
              </div>

              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </div>

      <p className="aditi-analytics-note">
        Analytics are derived from simulated, rule-based AI
        decisions. They do not represent measured hardware
        performance, real energy savings, or validated accuracy.
      </p>
    </section>
  )
}
