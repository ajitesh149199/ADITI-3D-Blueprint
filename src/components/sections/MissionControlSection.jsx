
import MissionControlDashboard from '../MissionControlDashboard'

export default function MissionControlSection() {
  return (
    <section
      className="aditi-mission-page"
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
      <MissionControlDashboard />
    </section>
  )
}
