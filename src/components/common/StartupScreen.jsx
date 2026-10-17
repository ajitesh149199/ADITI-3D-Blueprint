
import AditiEye from './AditiEye'
import '../../styles/startup.css'

/**
 * ADITI 3D Blueprint startup screen.
 *
 * Loading state comes from the parent application.
 * No simulated timer or artificial progress is used.
 *
 * progress: 0–100 when measurable, null otherwise
 * ready: true only when the required initial model is ready
 * error: an Error object or message if loading fails
 * onRetry: callback supplied by the parent application
 */
export default function StartupScreen({
  progress = null,
  status = 'LOADING 3D ASSETS',
  ready = false,
  error = null,
  onRetry,
}) {
  const value = Number(progress)

  const hasProgress =
    progress !== null &&
    progress !== undefined &&
    Number.isFinite(value)

  const percentage = hasProgress
    ? Math.max(0, Math.min(100, Math.round(value)))
    : null

  const displayStatus = error
    ? '3D ASSET LOADING FAILED'
    : ready
      ? 'ADITI READY'
      : status

  return (
    <main
      className="startup-screen"
      aria-busy={!ready && !error}
    >
      <div
        className="startup-grid"
        aria-hidden="true"
      />

      <div
        className="startup-ambient startup-ambient-magenta"
        aria-hidden="true"
      />

      <div
        className="startup-ambient startup-ambient-cyan"
        aria-hidden="true"
      />

      <div className="startup-content">
        <header className="startup-brand">
          <h1 className="startup-title">
            ADITI
          </h1>

          <p className="startup-subtitle">
            3D HARDWARE VISUALIZATION SYSTEM
          </p>
        </header>

        <div className="startup-eye-wrap">
          <AditiEye size="large" blink />
        </div>

        <section
          className="startup-system"
          aria-live="polite"
        >
          <div className="startup-status-row">
            <p className="startup-status">
              {displayStatus}
            </p>
          </div>

          <div
            className="startup-progress-track"
            role="progressbar"
            aria-label="ADITI 3D asset loading"
            aria-valuemin={hasProgress ? 0 : undefined}
            aria-valuemax={hasProgress ? 100 : undefined}
            aria-valuenow={percentage ?? undefined}
            aria-valuetext={
              error
                ? 'Loading failed'
                : ready
                  ? 'Ready'
                  : percentage === null
                    ? 'Loading 3D assets'
                    : `${percentage} percent`
            }
          >
            <div
              className="startup-progress-fill"
              style={{
                width: `${
                  ready ? 100 : percentage ?? 0
                }%`,
                transition: 'width 180ms ease',
              }}
            >
              <span className="progress-head" />
            </div>
          </div>

          <div className="startup-progress-info">
            <span>
              {error
                ? 'MODEL LOADING ERROR'
                : ready
                  ? 'SYSTEM READY'
                  : 'LOADING 3D ASSETS'}
            </span>

            <span className="startup-percentage">
              {ready
                ? '100%'
                : percentage === null
                  ? 'LOADING'
                  : `${String(percentage).padStart(
                      2,
                      '0'
                    )}%`}
            </span>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                marginTop: 18,
                color: '#ff86ba',
                fontSize: 12,
                lineHeight: 1.6,
                textAlign: 'center',
              }}
            >
              <p style={{ margin: '0 0 12px' }}>
                {typeof error === 'string'
                  ? error
                  : error.message ||
                    'Unable to load the initial 3D model.'}
              </p>

              {typeof onRetry === 'function' && (
                <button
                  type="button"
                  onClick={onRetry}
                  style={{
                    padding: '10px 18px',
                    background:
                      'rgba(255, 0, 135, 0.12)',
                    border: '1px solid #ff0087',
                    borderRadius: 8,
                    color: '#ff69b4',
                    cursor: 'pointer',
                    font: 'inherit',
                    letterSpacing: 2,
                  }}
                >
                  RETRY LOADING
                </button>
              )}
            </div>
          )}
        </section>

        <footer className="startup-footer">
          <span>ADITI</span>
          <span className="footer-divider">
            /
          </span>
          <span>3D BLUEPRINT SYSTEM</span>
        </footer>
      </div>
    </main>
  )
}
