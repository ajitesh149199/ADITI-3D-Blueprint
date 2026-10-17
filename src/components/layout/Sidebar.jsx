
import { useApp } from '../../state/AppContext'

const NAV = [
  {
    id: 'overview',
    title: 'Overview',
    desc: 'Assembled glasses',
  },
  {
    id: 'exploded',
    title: 'Exploded View',
    desc: 'Scroll-driven teardown',
  },
  {
    id: 'explorer',
    title: 'Component Explorer',
    desc: 'Inspect individual GLBs',
  },
  {
    id: 'architecture',
    title: 'System Architecture',
    desc: 'Sense → decide → act',
  },
  {
    id: 'specs',
    title: 'Technical Specs',
    desc: 'Roles and assets',
  },
  {
    id: 'power',
    title: 'Power & Battery',
    desc: 'Power distribution and runtime',
  },
  {
    id: 'simulation',
    title: 'Simulation Monitor',
    desc: 'Live system state and sensor activity',
  },
  {
    id: 'diagnostics',
    title: 'System Diagnostics',
    desc: 'Hardware health, faults and recovery',
  },

  {
  id: 'mission',
  title: 'Mission Control',
  desc: 'Assistive tasks and mission evaluation',
  },
]

export function Sidebar({ onNavigate }) {
  const { section, setSection } = useApp()

  function handleNavigation(sectionId) {
    // Switch to the selected dashboard section
    setSection(sectionId)

    // Close the mobile navigation drawer after selection
    onNavigate?.()
  }

  return (
    <aside
      id="aditi-sidebar"
      className="sidebar"
      aria-label="Dashboard navigation"
    >
      <div className="nav-label">
        Dashboard
      </div>

      {NAV.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`nav-btn ${
            section === item.id ? 'active' : ''
          }`}
          onClick={() => handleNavigation(item.id)}
          aria-current={
            section === item.id ? 'page' : undefined
          }
        >
          <span>{item.title}</span>
          <small>{item.desc}</small>
        </button>
      ))}

      <div className="sidebar-foot">
        Assistive smart-glasses visualization.
        Sensor values are not streamed; this is a
        design and engineering briefing, not a
        connected device console.
      </div>
    </aside>
  )
}
