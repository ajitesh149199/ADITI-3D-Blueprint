
import DiagnosticsDashboard from '../DiagnosticsDashboard'

export default function DiagnosticsSection() {
  return (
    <section
      className="aditi-diagnostics-page"
      style={{
        width: '100%',
        height: '100%',
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: 'clamp(12px, 2vw, 24px)',
        boxSizing: 'border-box',
      }}
    >
      <DiagnosticsDashboard />
    </section>
  )
}
