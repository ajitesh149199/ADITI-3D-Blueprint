
import AditiEye from '../common/AditiEye'

export function TopBar({
  mobileMenuOpen = false,
  onToggleMenu,
}) {
  return (
    <header className="topbar">
      <div className="brand">

        {/* One eye logo for both desktop and mobile */}
        <button
          type="button"
          className="aditi-eye-nav-button"
          onClick={() => onToggleMenu?.()}
          aria-label={
            mobileMenuOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="aditi-sidebar"
        >
          <AditiEye size="small" blink />
        </button>

        <div>
          <h1>ADITI 3D BLUEPRINT</h1>
          <p>
            Artificially Driven Data, Information and Tech
            Integration
          </p>
        </div>
      </div>

      <div className="top-meta">
        <span className="pill">
          Engineering visualization
        </span>
        <span className="pill">
          Not live hardware
        </span>
      </div>
    </header>
  )
}
