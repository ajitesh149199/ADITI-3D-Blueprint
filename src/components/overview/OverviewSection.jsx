
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

import { GltfAsset } from '../../models/GltfAsset'
import { getComponent, modelUrl } from '../../models/registry'
import { useApp } from '../../state/AppContext'

import { ErrorBoundary } from '../viewer/ErrorBoundary'

import {
  FitOnLoad,
  ViewerControls,
  resetCamera,
} from '../viewer/FramedModel'

import { SceneCanvas } from '../viewer/SceneCanvas'

import {
  SensorIndicators,
  HARDWARE_POSITIONS,
  HARDWARE_DETAILS,
  HARDWARE_CATEGORIES,
  MARKER_SIZES,
} from '../../visualisation/SensorIndicators'

import {
  HardwareConnectionLine,
} from '../../visualisation/HardwareConnectionLine'

import { HardwareDetailsPanel } from '../HardwareDetailsPanel'

import { ArchitecturePanel } from '../ArchitecturePanel'

// ==================================================
// ADITI 3D BLUEPRINT
// PHASE 10.5.14E.5
// MARKER VISIBILITY AND OVERLAP IMPROVEMENTS
// ==================================================

const HARDWARE_KEYS = Object.keys(
  HARDWARE_POSITIONS
).filter(
  (key) =>
    Array.isArray(HARDWARE_POSITIONS[key]) &&
    HARDWARE_DETAILS[key]
)

const FOCUS_DISTANCE = 1.65
const FOCUS_SPEED = 4

function formatPosition(position) {
  if (!Array.isArray(position)) {
    return 'Not assigned'
  }

  return `[${position.join(', ')}]`
}

// ==================================================
// MATCH VISUAL SEPARATION POSITION
// ==================================================

function getDisplayPosition(
  sensor,
  separationMode
) {
  const position =
    HARDWARE_POSITIONS[sensor]

  if (!position) return null

  if (!separationMode) return position

  const index =
    HARDWARE_KEYS.indexOf(sensor)

  const angle = index * 2.39996
  const offset = 0.15

  return [
    position[0] +
      Math.cos(angle) * offset,

    position[1] +
      Math.sin(angle) * offset,

    position[2] + 0.045,
  ]
}

// ==================================================
// CAMERA FOCUS CONTROLLER
// ==================================================

function CameraFocusController({
  controlsRef,
  selectedHardware,
  focusRequest,
}) {
  const { camera } = useThree()

  const animationRef = useRef(null)
  const lastRequestRef = useRef(0)

  useEffect(() => {
    if (
      !selectedHardware ||
      focusRequest === 0 ||
      lastRequestRef.current === focusRequest
    ) {
      return
    }

    lastRequestRef.current = focusRequest

    const position =
      HARDWARE_POSITIONS[selectedHardware]

    const controls = controlsRef.current

    if (!Array.isArray(position) || !controls) {
      return
    }

    const target = new THREE.Vector3(
      ...position
    )

    const direction = new THREE.Vector3()
      .subVectors(
        camera.position,
        controls.target
      )

    if (direction.lengthSq() < 0.0001) {
      direction.set(0, 0.4, 1)
    }

    direction.normalize()

    const destination = target
      .clone()
      .addScaledVector(
        direction,
        FOCUS_DISTANCE
      )

    animationRef.current = {
      target,
      destination,
    }
  }, [
    selectedHardware,
    focusRequest,
    camera,
    controlsRef,
  ])

  useFrame((_, delta) => {
    const animation = animationRef.current

    if (!animation) return

    const controls = controlsRef.current

    if (!controls) return

    const alpha =
      1 - Math.exp(-FOCUS_SPEED * delta)

    camera.position.lerp(
      animation.destination,
      alpha
    )

    controls.target.lerp(
      animation.target,
      alpha
    )

    controls.update()

    if (
      camera.position.distanceTo(
        animation.destination
      ) < 0.005 &&
      controls.target.distanceTo(
        animation.target
      ) < 0.005
    ) {
      camera.position.copy(
        animation.destination
      )

      controls.target.copy(
        animation.target
      )

      controls.update()

      animationRef.current = null
    }
  })

  useEffect(() => {
    const controls = controlsRef.current

    if (!controls) return

    const cancelFocus = () => {
      animationRef.current = null
    }

    controls.addEventListener(
      'start',
      cancelFocus
    )

    return () => {
      controls.removeEventListener(
        'start',
        cancelFocus
      )
    }
  }, [controlsRef])

  return null
}

// ==================================================
// SELECTED MARKER SCREEN TRACKER
// ==================================================

function SelectedMarkerTracker({
  selectedHardware,
  separationMode,
  onScreenPosition,
}) {
  const { camera, size } = useThree()

  const pointRef = useRef(
    new THREE.Vector3()
  )

  useFrame(() => {
    const position = getDisplayPosition(
      selectedHardware,
      separationMode
    )

    if (!position) return

    const point = pointRef.current

    point.set(...position)
    point.project(camera)

    const x =
      (point.x * 0.5 + 0.5) *
      size.width

    const y =
      (-point.y * 0.5 + 0.5) *
      size.height

    const visible =
      point.z >= -1 &&
      point.z <= 1 &&
      x >= 0 &&
      x <= size.width &&
      y >= 0 &&
      y <= size.height

    onScreenPosition?.({
      x,
      y,
      visible,
    })
  })

  return null
}

// ==================================================
// 3D SCENE
// ==================================================

function GlassesScene({
  controlsRef,
  showHardware,
  selectedHardware,
  categoryFilter,
  markerSize,
  separationMode,
  focusRequest,
  onSelectHardware,
  onScreenPosition,
  onInspect,
}) {
  const root = useRef(null)
  const glasses = getComponent('glasses')

  return (
    <>
      <ViewerControls controlsRef={controlsRef} />

      <group ref={root}>
        <GltfAsset
          url={modelUrl('glasses')}
          targetSize={glasses.targetSize}
          onInspect={onInspect}
        />

        <SensorIndicators
          visible={showHardware}
          selectedSensor={selectedHardware}
          onSelectSensor={onSelectHardware}
          categoryFilter={categoryFilter}
          markerSize={markerSize}
          separationMode={separationMode}
        />
      </group>

      <FitOnLoad objectRef={root} />

      <ContactShadows
        opacity={0.35}
        scale={8}
        blur={2.4}
        far={4}
        position={[0, -1.12, 0]}
      />

      <CameraFocusController
        controlsRef={controlsRef}
        selectedHardware={selectedHardware}
        focusRequest={focusRequest}
      />

      {showHardware && selectedHardware && (
        <SelectedMarkerTracker
          selectedHardware={selectedHardware}
          separationMode={separationMode}
          onScreenPosition={onScreenPosition}
        />
      )}
    </>
  )
}



// ==================================================
// MAIN OVERVIEW SECTION
// ==================================================

export function OverviewSection() {
  const controlsRef = useRef(null)
  const stageRef = useRef(null)
  const panelRef = useRef(null)

  const [showHardware, setShowHardware] =
    useState(false)

  const [selectedHardware, setSelectedHardware] =
    useState(null)

  const [categoryFilter, setCategoryFilter] =
    useState('all')

  const [markerSize, setMarkerSize] =
    useState('normal')

  const [separationMode, setSeparationMode] =
    useState(false)

  const [focusRequest, setFocusRequest] =
    useState(0)

  const [screenPosition, setScreenPosition] =
    useState(null)

  const [panelAnchor, setPanelAnchor] =
    useState(null)

  const [showArchitecture, setShowArchitecture] = useState(false)

  const { recordInspect, setModelStatus } =
    useApp()

  const filteredHardwareKeys =
    HARDWARE_KEYS.filter((key) => {
      return (
        categoryFilter === 'all' ||
        HARDWARE_DETAILS[key].category ===
          categoryFilter
      )
    })

  // SELECT HARDWARE

  const handleSelectHardware = (key) => {
    if (!HARDWARE_DETAILS[key]) return

    if (
      categoryFilter !== 'all' &&
      HARDWARE_DETAILS[key].category !==
        categoryFilter
    ) {
      return
    }

    setShowHardware(true)
    setSelectedHardware(key)
    setScreenPosition(null)

    setFocusRequest(
      (previous) => previous + 1
    )
  }

  // CHANGE CATEGORY

  const handleCategoryChange = (category) => {
    setCategoryFilter(category)
    setSelectedHardware(null)
    setScreenPosition(null)
    setPanelAnchor(null)
  }

  // TOGGLE HARDWARE

  const handleToggleHardware = () => {
    setShowHardware(
      (previous) => !previous
    )

    setSelectedHardware(null)
    setScreenPosition(null)
    setPanelAnchor(null)
  }

  // RESET CAMERA

  const handleResetCamera = () => {
    setSelectedHardware(null)
    setScreenPosition(null)
    setPanelAnchor(null)

    const camera =
      controlsRef.current?.object

    resetCamera(
      controlsRef.current,
      camera
    )
  }

  // REFOCUS

  const handleFocusComponent = () => {
    if (!selectedHardware) return

    setFocusRequest(
      (previous) => previous + 1
    )
  }

  // SCREEN POSITION TRACKING

  const handleScreenPosition = useCallback(
    (position) => {
      setScreenPosition((previous) => {
        if (
          previous &&
          Math.abs(
            previous.x - position.x
          ) < 0.5 &&
          Math.abs(
            previous.y - position.y
          ) < 0.5 &&
          previous.visible ===
            position.visible
        ) {
          return previous
        }

        return position
      })
    },
    []
  )

  // PANEL POSITION TRACKING

  useEffect(() => {
    if (!selectedHardware || !showHardware) {
      return
    }

    const updatePanelAnchor = () => {
      const stage = stageRef.current
      const panel = panelRef.current

      if (!stage || !panel) return

      const stageRect =
        stage.getBoundingClientRect()

      const panelRect =
        panel.getBoundingClientRect()

      setPanelAnchor({
        x: panelRect.left - stageRect.left,

        y:
          panelRect.top -
          stageRect.top +
          Math.min(70, panelRect.height / 2),
      })
    }

    updatePanelAnchor()

    window.addEventListener(
      'resize',
      updatePanelAnchor
    )

    return () => {
      window.removeEventListener(
        'resize',
        updatePanelAnchor
      )
    }
  }, [selectedHardware, showHardware])

  const selectedDetails =
    HARDWARE_DETAILS[selectedHardware]

  return (
    <section className={`section ${showArchitecture ? 'aditi-overview-architecture-open' : ''}`}>
      {/* HEADER */}

      <div className="section-head">
        <div>
          <h2>Assembled ADITI glasses</h2>

          <p>
            Interactive 3D assembly with{' '}
            {HARDWARE_KEYS.length} calibrated
            hardware positions, category filters,
            and improved marker visibility.
          </p>
        </div>

        <div className="actions">
          <button
            className="btn"
            type="button"
            onClick={handleToggleHardware}
          >
            {showHardware
              ? 'Hide Hardware'
              : 'Show Hardware'}
          </button>

          <button
  className="btn"
  type="button"
  onClick={() => setShowArchitecture((previous) => !previous)}
>
  {showArchitecture ? 'Hide Architecture' : 'Architecture Explorer'}
</button>

          <button
            className="btn primary"
            type="button"
            onClick={handleResetCamera}
          >
            Reset camera
          </button>
        </div>
      </div>

      {/* HARDWARE CONTROLS */}

      {showHardware && (
        <div
          className="glass-panel"
          style={{
            marginBottom: 12,
            padding: 14,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <label htmlFor="aditi-category-filter">
            Category:
          </label>

          <select
            id="aditi-category-filter"
            value={categoryFilter}
            onChange={(event) =>
              handleCategoryChange(
                event.target.value
              )
            }
          >
            {HARDWARE_CATEGORIES.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.label}
                </option>
              )
            )}
          </select>

          <label htmlFor="aditi-hardware-select">
            Component:
          </label>

          <select
            id="aditi-hardware-select"
            value={selectedHardware || ''}
            onChange={(event) => {
              const key = event.target.value

              if (key) {
                handleSelectHardware(key)
              } else {
                setSelectedHardware(null)
                setScreenPosition(null)
                setPanelAnchor(null)
              }
            }}
          >
            <option value="">
              Choose hardware...
            </option>

            {filteredHardwareKeys.map(
              (key) => (
                <option
                  key={key}
                  value={key}
                >
                  {HARDWARE_DETAILS[key].name}
                </option>
              )
            )}
          </select>

          <label htmlFor="aditi-marker-size">
            Marker size:
          </label>

          <select
            id="aditi-marker-size"
            value={markerSize}
            onChange={(event) =>
              setMarkerSize(
                event.target.value
              )
            }
          >
            {Object.keys(MARKER_SIZES).map(
              (size) => (
                <option
                  key={size}
                  value={size}
                >
                  {size.charAt(0).toUpperCase() +
                    size.slice(1)}
                </option>
              )
            )}
          </select>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={separationMode}
              onChange={(event) =>
                setSeparationMode(
                  event.target.checked
                )
              }
            />

            Separate markers
          </label>

          <span
            style={{
              fontSize: 12,
              opacity: 0.8,
            }}
          >
            Visible: {filteredHardwareKeys.length}
            {' / '}
            {HARDWARE_KEYS.length}
          </span>
        </div>
      )}

      {/* 3D VIEWER */}

      <div
        ref={stageRef}
        className="stage canvas-fill"
        style={{
          minHeight: 500,
          position: 'relative',
          isolation: 'isolate',
        }}
      >
        <div className="hud hud-tl">
          <div className="glass-panel">
            <div className="kicker">
              PRIMARY ASSET
            </div>

            <div>
              <b>ADITI 3D.glb</b>
            </div>

            <div className="stat-row">
              <span>
                Controls{' '}
                <b>Orbit / Zoom / Pan</b>
              </span>
            </div>

            <div className="stat-row">
              <span>
                Hardware markers{' '}
                <b>
                  {showHardware
                    ? 'Visible'
                    : 'Hidden'}
                </b>
              </span>
            </div>

            <div className="stat-row">
              <span>
                Registered{' '}
                <b>{HARDWARE_KEYS.length}</b>
              </span>
            </div>

            {showHardware && (
              <>
                <div className="stat-row">
                  <span>
                    Filtered{' '}
                    <b>
                      {filteredHardwareKeys.length}
                    </b>
                  </span>
                </div>

                <div className="stat-row">
                  <span>
                    Separation{' '}
                    <b>
                      {separationMode
                        ? 'Enabled'
                        : 'Disabled'}
                    </b>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {!selectedHardware && (
          <div className="hud hud-br">
            <div className="glass-panel">
              <div className="kicker">
                HARDWARE INSPECTION
              </div>

              <div className="stat-row">
                {showHardware
                  ? 'Select a visible marker'
                  : 'Enable hardware markers'}
              </div>
            </div>
          </div>
        )}

        <ErrorBoundary>
          <SceneCanvas>
            <GlassesScene
              controlsRef={controlsRef}
              showHardware={showHardware}
              selectedHardware={selectedHardware}
              categoryFilter={categoryFilter}
              markerSize={markerSize}
              separationMode={separationMode}
              focusRequest={focusRequest}
              onSelectHardware={
                handleSelectHardware
              }
              onScreenPosition={
                handleScreenPosition
              }
              onInspect={(report) => {
                recordInspect(
                  'glasses',
                  report
                )

                setModelStatus(
                  'glasses',
                  'ready'
                )
              }}
            />
          </SceneCanvas>
        </ErrorBoundary>

        {/* CONNECTION LINE */}

        {showHardware &&
          selectedHardware &&
          screenPosition &&
          panelAnchor && (
            <HardwareConnectionLine
              start={screenPosition}
              end={panelAnchor}
              color={
                selectedDetails?.color ||
                '#22d3ee'
              }
            />
          )}

        {/* HARDWARE PANEL */}

        {showHardware &&
          selectedHardware && (
            <HardwareDetailsPanel
  hardwareKey={selectedHardware}
  details={HARDWARE_DETAILS[selectedHardware]}
  position={HARDWARE_POSITIONS[selectedHardware]}
  panelRef={panelRef}
  onFocus={handleFocusComponent}
  onClose={() => {
    setSelectedHardware(null)
    setScreenPosition(null)
    setPanelAnchor(null)
  }}
/>
          )}
      </div>

    {showArchitecture && (
  <ArchitecturePanel
    onClose={() => setShowArchitecture(false)}
    onSelectHardware={(key) => {
      setCategoryFilter('all')
      setShowHardware(true)
      setSelectedHardware(key)
      setScreenPosition(null)
      setPanelAnchor(null)
      setFocusRequest((previous) => previous + 1)
    }}
  />
)}

    </section>
  )
}
