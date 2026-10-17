
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ContactShadows } from '@react-three/drei'

import {
  HARDWARE_IDS,
  getComponent,
  CATEGORY_META,
} from '../../models/registry'
import { useApp } from '../../state/AppContext'
import { ErrorBoundary } from '../viewer/ErrorBoundary'
import { SceneCanvas } from '../viewer/SceneCanvas'
import {
  ViewerControls,
  InspectionCamera,
} from '../viewer/FramedModel'
import { ExplodedScene } from './ExplodedScene'

gsap.registerPlugin(ScrollTrigger)

const CONNECTION_FILTERS = [
  { type: 'sensing', label: 'Sensor Data', color: '#00e7ee' },
  { type: 'power', label: 'Power', color: '#ff007a' },
  { type: 'feedback', label: 'Feedback', color: '#c084fc' },
  { type: 'control', label: 'Control', color: '#fbbf24' },
]

function getEnabledIds(explode) {
  if (explode < 0.04) return []

  const count = Math.min(
    HARDWARE_IDS.length,
    1 + Math.floor((explode - 0.04) / 0.1)
  )

  return HARDWARE_IDS.slice(0, count)
}

function StagedExploded({
  explode,
  selectedId,
  resetRequest,
  visibleIds,
  xrayEnabled,
  connectionsEnabled,
  activeTypes,
  onSelect,
}) {
  const enabledIds = useMemo(
    () => getEnabledIds(explode),
    [explode]
  )

  const displayedIds = useMemo(
    () => enabledIds.filter((id) => visibleIds.includes(id)),
    [enabledIds, visibleIds]
  )

  return (
    <>
      <ViewerControls enable />

      <InspectionCamera
        selectedId={selectedId}
        resetRequest={resetRequest}
        focusPosition={[0, 0.15, 1.5]}
        focusDistance={3.2}
      />

      <ExplodedScene
        explode={explode}
        enabledIds={displayedIds}
        selectedId={selectedId}
        xray={xrayEnabled}
        connectionsEnabled={connectionsEnabled}
        activeTypes={activeTypes}
        onSelect={onSelect}
      />

      <ContactShadows
        opacity={0.28}
        scale={10}
        blur={2.6}
        far={5}
        position={[0, -1.12, 0]}
      />
    </>
  )
}

function InfoCell({ label, value }) {
  return (
    <div className="aditi-inspector-cell">
      <div className="kicker">{label}</div>
      <div>{value}</div>
    </div>
  )
}


function HardwareInspector({
  spec,
  report,
  status,
  onResetCamera,
  onReturn,
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  const category = CATEGORY_META[spec.category]
  const categoryColor = category?.color || '#67e8f9'

  const statusLabel =
    status === 'ready'
      ? 'Ready'
      : status === 'error'
        ? 'Error'
        : 'Pending'

  return (
    <>
      {/* Mobile compact inspector */}
      <div className="aditi-mobile-inspector-bar">
        <div className="aditi-mobile-inspector-name">
          <div className="kicker">
            Inspecting component
          </div>
          <strong>{spec.name}</strong>
        </div>

        <button
          type="button"
          className="aditi-mobile-details-button"
          onClick={() => setDetailsOpen(true)}
        >
          Details ↑
        </button>

        <button
          type="button"
          className="aditi-mobile-return-button"
          onClick={onReturn}
          aria-label="Return to exploded view"
        >
          ✕
        </button>
      </div>

      {/* Mobile details backdrop */}
      {detailsOpen && (
        <button
          type="button"
          className="aditi-mobile-inspector-backdrop"
          onClick={() => setDetailsOpen(false)}
          aria-label="Collapse hardware details"
        />
      )}

      {/* Desktop inspector / mobile expandable sheet */}
      <div
        className={
          'glass-panel aditi-hardware-inspector ' +
          (detailsOpen ? 'aditi-inspector-expanded' : '')
        }
      >
        <div className="aditi-mobile-inspector-sheet-header">
          <strong>{spec.name}</strong>

          <button
            type="button"
            onClick={() => setDetailsOpen(false)}
          >
            Collapse ↓
          </button>
        </div>

        <div className="kicker">
          ADITI / Hardware Inspector
        </div>

        <h3>{spec.name}</h3>

        <span
          className="aditi-inspector-category"
          style={{
            color: categoryColor,
            borderColor: `${categoryColor}55`,
            background: `${categoryColor}18`,
          }}
        >
          {category?.label || spec.category}
        </span>

        <div className="aditi-inspector-description">
          <div className="kicker">
            Functional role
          </div>

          <p>{spec.role}</p>

          <div className="kicker">
            Description
          </div>

          <p>{spec.details}</p>
        </div>

        <div className="aditi-inspector-grid">
          <InfoCell
            label="Model status"
            value={statusLabel}
          />

          <InfoCell
            label="Subsystem"
            value={spec.shortName}
          />

          <InfoCell
            label="Mesh count"
            value={report?.meshCount ?? 'Not available'}
          />

          <InfoCell
            label="Node count"
            value={report?.nodeCount ?? 'Not available'}
          />
        </div>

        {spec.grouped &&
          Array.isArray(spec.groupedParts) &&
          spec.groupedParts.length > 0 && (
            <div className="aditi-inspector-description">
              <div className="kicker">
                Hardware within this group
              </div>

              {spec.groupedParts.map((part) => (
                <div
                  key={part.id}
                  className="aditi-inspector-cell"
                  style={{ marginTop: 8 }}
                >
                  <strong>{part.name}</strong>
                  <p>{part.role}</p>
                </div>
              ))}
            </div>
          )}

        <div className="aditi-inspector-actions">
          <button
            type="button"
            className="btn"
            onClick={onResetCamera}
          >
            Reset Camera
          </button>

          <button
            type="button"
            className="btn primary"
            onClick={onReturn}
          >
            Return to Exploded View
          </button>
        </div>
      </div>
    </>
  )
}


function VisibilityIcon({ visible }) {
  return visible ? '◉' : '○'
}

function HardwareList({
  enabledIds,
  visibleIds,
  onShowAll,
  onHideAll,
  onSelect,
  onToggleVisibility,
}) {
  return (
    <>
      <div className="aditi-hardware-list-actions">
        <button type="button" onClick={onShowAll}>
          Show All
        </button>
        <button type="button" onClick={onHideAll}>
          Hide All
        </button>
      </div>

      <div className="aditi-hardware-list-items">
        {enabledIds.length === 0 && (
          <p className="aditi-hardware-empty">
            Scroll the exploded view to reveal components.
          </p>
        )}

        {enabledIds.map((id) => {
          const component = getComponent(id)
          const visible = visibleIds.includes(id)

          return (
            <div className="aditi-hardware-item" key={id}>
              <button
                type="button"
                className="aditi-hardware-select"
                disabled={!visible}
                onClick={() => onSelect(id)}
              >
                {component?.name || id}
              </button>

              <button
                type="button"
                className="aditi-hardware-visibility"
                onClick={() => onToggleVisibility(id)}
                aria-label={
                  visible
                    ? `Hide ${component?.name || id}`
                    : `Show ${component?.name || id}`
                }
                title={
                  visible
                    ? `Hide ${component?.name || id}`
                    : `Show ${component?.name || id}`
                }
              >
                <VisibilityIcon visible={visible} />
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}

export function ExplodedSection() {
  const pageRef = useRef(null)
  const trackRef = useRef(null)
  const selectedRef = useRef(null)

  const {
    inspections,
    loadStatus,
    setExplode,
  } = useApp()

  const [local, setLocal] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [resetRequest, setResetRequest] = useState(0)

  const [xrayEnabled, setXrayEnabled] = useState(false)
  const [connectionsEnabled, setConnectionsEnabled] =
    useState(false)

  const [activeConnectionTypes, setActiveConnectionTypes] =
    useState(['sensing', 'power', 'feedback', 'control'])

  const [visibleIds, setVisibleIds] = useState(
    () => [...HARDWARE_IDS]
  )

  const [mobileSheetOpen, setMobileSheetOpen] =
    useState(false)

  const enabledIds = useMemo(
    () => getEnabledIds(local),
    [local]
  )

  const selectComponent = useCallback((id) => {
    selectedRef.current = id
    setSelectedId(id)
    setMobileSheetOpen(false)
  }, [])

  const toggleVisibility = useCallback(
    (id) => {
      const isVisible = visibleIds.includes(id)

      if (isVisible && selectedRef.current === id) {
        selectComponent(null)
      }

      setVisibleIds((previous) =>
        previous.includes(id)
          ? previous.filter((item) => item !== id)
          : [...previous, id]
      )
    },
    [visibleIds, selectComponent]
  )

  const showAll = useCallback(() => {
    setVisibleIds([...HARDWARE_IDS])
  }, [])

  const hideAll = useCallback(() => {
    selectComponent(null)
    setVisibleIds([])
  }, [selectComponent])

  const resetInspectionCamera = useCallback(() => {
    if (!selectedRef.current) return
    setResetRequest((previous) => previous + 1)
  }, [])

  const toggleConnectionType = (type) => {
    setActiveConnectionTypes((previous) =>
      previous.includes(type)
        ? previous.filter((item) => item !== type)
        : [...previous, type]
    )
  }

  useLayoutEffect(() => {
    const page = pageRef.current
    const track = trackRef.current

    if (!page || !track) return

    const proxy = { t: 0 }

    const tween = gsap.to(proxy, {
      t: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: track,
        scroller: page,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.65,
      },
      onUpdate: () => {
        if (!selectedRef.current) {
          setLocal(proxy.t)
        }
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== 'Escape') return

      if (mobileSheetOpen) {
        setMobileSheetOpen(false)
      } else {
        selectComponent(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileSheetOpen, selectComponent])

  useEffect(() => {
    return () => setExplode(0)
  }, [setExplode])

  const selectedSpec = selectedId
    ? getComponent(selectedId)
    : null

  const selectedReport = selectedId
    ? inspections[selectedId]
    : null

  const selectedStatus = selectedId
    ? loadStatus[selectedId]
    : null

  const pct = Math.round(local * 100)

  return (
    <section className="exploded-page" ref={pageRef}>
      <div className="exploded-track" ref={trackRef}>
        <div className="exploded-sticky">
          <div className="section-head">
            <div>
              <h2>Interactive exploded view</h2>
              <p>
                Scroll to separate components. Click hardware
                to inspect it. Drag to rotate, wheel to zoom,
                and right-drag to pan.
              </p>
            </div>

            <div className="actions aditi-exploded-actions">
              <button
                type="button"
                className="aditi-exploded-toggle"
                onClick={() => setXrayEnabled((v) => !v)}
                aria-pressed={xrayEnabled}
              >
                {xrayEnabled ? '◉ X-Ray ON' : '◎ X-Ray OFF'}
              </button>

              <button
                type="button"
                className="aditi-exploded-toggle"
                onClick={() =>
                  setConnectionsEnabled((v) => !v)
                }
                aria-pressed={connectionsEnabled}
              >
                {connectionsEnabled
                  ? '● Connections ON'
                  : '○ Connections OFF'}
              </button>

              {connectionsEnabled && (
                <div className="aditi-connection-filters">
                  {CONNECTION_FILTERS.map(
                    ({ type, label, color }) => {
                      const active =
                        activeConnectionTypes.includes(type)

                      return (
                        <button
                          key={type}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            toggleConnectionType(type)
                          }
                          style={{
                            color: active
                              ? color
                              : '#a99db8',
                            borderColor: active
                              ? color
                              : 'rgba(169,157,184,0.3)',
                            background: active
                              ? `${color}20`
                              : 'rgba(12,7,22,0.85)',
                          }}
                        >
                          {active ? '●' : '○'} {label}
                        </button>
                      )
                    }
                  )}
                </div>
              )}

              <span className="pill scroll-hint">
                Explode {pct}%
              </span>
            </div>
          </div>

          <div className="stage canvas-fill aditi-exploded-stage">
            <ErrorBoundary>
              <SceneCanvas
                camera={{
                  position: [3.5, 1.7, 5.5],
                  fov: 42,
                }}
              >
                <StagedExploded
                  explode={local}
                  selectedId={selectedId}
                  resetRequest={resetRequest}
                  visibleIds={visibleIds}
                  xrayEnabled={xrayEnabled}
                  connectionsEnabled={connectionsEnabled}
                  activeTypes={activeConnectionTypes}
                  onSelect={selectComponent}
                />
              </SceneCanvas>
            </ErrorBoundary>

            {/* Desktop hardware panel */}
            {!selectedId && enabledIds.length > 0 && (
              <div className="aditi-desktop-hardware-panel">
                <div className="kicker">
                  Hardware Components
                </div>

                <HardwareList
                  enabledIds={enabledIds}
                  visibleIds={visibleIds}
                  onShowAll={showAll}
                  onHideAll={hideAll}
                  onSelect={selectComponent}
                  onToggleVisibility={toggleVisibility}
                />
              </div>
            )}

            {/* Mobile bottom sheet trigger */}
            {!selectedId && (
              <button
                type="button"
                className="aditi-mobile-hardware-trigger"
                onClick={() => setMobileSheetOpen(true)}
                aria-expanded={mobileSheetOpen}
                aria-controls="aditi-mobile-hardware-sheet"
              >
                <span>☷ Hardware Components</span>
                <span>{enabledIds.length} available ↑</span>
              </button>
            )}

            {/* Mobile bottom sheet */}
            {mobileSheetOpen && !selectedId && (
              <>
                <button
                  type="button"
                  className="aditi-hardware-sheet-backdrop"
                  aria-label="Close hardware components"
                  onClick={() => setMobileSheetOpen(false)}
                />

                <div
                  id="aditi-mobile-hardware-sheet"
                  className="aditi-mobile-hardware-sheet"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Hardware components"
                >
                  <div className="aditi-hardware-sheet-header">
                    <div>
                      <div className="kicker">
                        ADITI / Components
                      </div>
                      <strong>Hardware Components</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMobileSheetOpen(false)}
                      aria-label="Close hardware components"
                    >
                      ✕
                    </button>
                  </div>

                  <HardwareList
                    enabledIds={enabledIds}
                    visibleIds={visibleIds}
                    onShowAll={showAll}
                    onHideAll={hideAll}
                    onSelect={selectComponent}
                    onToggleVisibility={toggleVisibility}
                  />
                </div>
              </>
            )}

            {selectedSpec && (
              <HardwareInspector
                spec={selectedSpec}
                report={selectedReport}
                status={selectedStatus}
                onResetCamera={resetInspectionCamera}
                onReturn={() => selectComponent(null)}
              />
            )}

            <div className="glass-panel aditi-exploded-help">
              <div className="kicker">Controls</div>
              <p className="scroll-hint">
                Left drag: Rotate | Right drag: Pan |
                Wheel: Zoom | Esc: Return
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
