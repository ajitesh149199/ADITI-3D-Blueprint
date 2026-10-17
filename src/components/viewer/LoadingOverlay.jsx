import { Html, useProgress } from '@react-three/drei'

export function LoadingOverlay({ label = 'Loading engineering asset' }) {
  const { progress, active, errors } = useProgress()
  if (!active && !errors.length) return null
  return (
    <Html fullscreen zIndexRange={[20, 0]}>
      <div className="loader">
        <div className="loader-card glass-panel">
          <div className="kicker">ADITI loader</div>
          {errors.length ? (
            <p className="err">Asset failed to load. Check that the GLB exists in /public/models.</p>
          ) : (
            <>
              <p>{label}</p>
              <div className="progress">
                <span style={{ width: `${Math.min(100, progress)}%` }} />
              </div>
              <p className="scroll-hint">{Math.round(progress)}%</p>
            </>
          )}
        </div>
      </div>
    </Html>
  )
}

export function CssLoader({ progress, error, label }) {
  return (
    <div className="loader">
      <div className="loader-card glass-panel">
        <div className="kicker">ADITI loader</div>
        {error ? (
          <p className="err">{error}</p>
        ) : (
          <>
            <p>{label}</p>
            <div className="progress">
              <span style={{ width: `${Math.min(100, progress || 8)}%` }} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
