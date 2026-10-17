
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export const SENSOR_POSITIONS = {
  camera: [-0.0057, 0.2054, 1.2103],
  distance: [-0.208, 0.223, 1.1793],
  imu: [0.1993, 0.2112, 1.1797],
}

export const SENSOR_DETAILS = {
  camera: {
    name: 'Front Camera',
    description: 'Proposed visual input for object recognition, text reading, and environmental understanding.',
    category: 'vision',
    color: '#22d3ee',
  },
  distance: {
    name: 'Distance Sensor',
    description: 'Simulated proximity and obstacle-distance input.',
    category: 'proximity',
    color: '#34d399',
  },
  imu: {
    name: 'IMU',
    description: 'Proposed motion and orientation sensing.',
    category: 'motion',
    color: '#a855f7',
  },
}

export const ADDITIONAL_HARDWARE = {
  rearCamera: {
    name: 'Rear Camera',
    description: 'Proposed rear-facing visual input.',
    category: 'vision',
    color: '#38bdf8',
  },
  battery: {
    name: 'Left Battery System',
    description: 'Proposed left-temple battery compartment.',
    category: 'power',
    color: '#22c55e',
  },
  raspberryPi: {
    name: 'Raspberry Pi',
    description: 'Proposed main processing unit for ADITI AI and system coordination.',
    category: 'processing',
    color: '#ef4444',
  },
  microphone: {
    name: 'Microphone',
    description: 'Proposed voice-command and environmental audio input.',
    category: 'audio-input',
    color: '#f472b6',
  },
  audioOutput: {
    name: 'Audio Output',
    description: 'Proposed speech guidance, text-to-speech, and audio alerts.',
    category: 'audio-output',
    color: '#a78bfa',
  },
  vibrationMotorleft: {
    name: 'Left Vibration Motor',
    description: 'Proposed left-side haptic feedback module.',
    category: 'haptic',
    color: '#fb923c',
  },
  vibrationMotorright: {
    name: 'Right Vibration Motor',
    description: 'Proposed right-side haptic feedback module.',
    category: 'haptic',
    color: '#f97316',
  },
  torch: {
    name: 'Low-Light Assistive Torch',
    description: 'Proposed controllable illumination module.',
    category: 'lighting',
    color: '#facc15',
  },
  switches: {
    name: 'Physical Switches',
    description: 'Proposed physical controls for power, modes, and lighting.',
    category: 'controls',
    color: '#e879f9',
  },
  statusLEDs: {
    name: 'Status LEDs',
    description: 'Four proposed indicators for power, connectivity, AI activity, and alerts.',
    category: 'indicators',
    color: '#fde047',
  },
}

export const HARDWARE_POSITIONS = {
  ...SENSOR_POSITIONS,
  rearCamera: [0.0084, 0.0417, -1.215],
  battery: [-1.0732, 0.0236, 0.2666],
  raspberryPi: [1.0632, 0.0211, 0.4384],
  microphone: [1.0261, 0.0212, 0.6721],
  audioOutput: [1.1207, 0.0232, -0.0948],
  vibrationMotorleft: [-0.7352, 0.0309, 0.2764],
  vibrationMotorright: [0.7501, 0.0441, 0.2279],
  torch: [0.3392, 0.2101, 1.1542],
  switches: [1.0213, 0.0471, 0.7098],
  statusLEDs: [0.9146, 0.0253, 0.8038],
}

export const HARDWARE_DETAILS = {
  ...SENSOR_DETAILS,
  ...ADDITIONAL_HARDWARE,
}

export const UNDEFINED_COMPONENTS = {
  lowerSquareModule: {
    name: 'Lower Square Module',
    status: 'undefined',
  },
  threeCircularElements: {
    name: 'Three Circular Elements',
    status: 'undefined',
  },
}

export const HARDWARE_CATEGORIES = [
  { id: 'all', label: 'All Hardware' },
  { id: 'vision', label: 'Vision' },
  { id: 'proximity', label: 'Proximity' },
  { id: 'motion', label: 'Motion' },
  { id: 'power', label: 'Power' },
  { id: 'processing', label: 'Processing' },
  { id: 'audio-input', label: 'Audio Input' },
  { id: 'audio-output', label: 'Audio Output' },
  { id: 'haptic', label: 'Haptic Feedback' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'controls', label: 'Controls' },
  { id: 'indicators', label: 'Indicators' },
]

export const MARKER_SIZES = {
  small: 0.75,
  normal: 1,
  large: 1.4,
}

export function getHardwareDisplayPosition(sensor, separationMode = false) {
  const position = HARDWARE_POSITIONS[sensor]

  if (!position) return null
  if (!separationMode) return position

  const index = Object.keys(HARDWARE_POSITIONS).indexOf(sensor)
  const angle = index * 2.39996
  const offset = 0.15

  return [
    position[0] + Math.cos(angle) * offset,
    position[1] + Math.sin(angle) * offset,
    position[2] + 0.045,
  ]
}

function SensorMarker({
  sensor,
  position,
  displayPosition,
  color,
  active,
  selected,
  dimmed,
  markerScale,
  separationMode,
  onSelect,
}) {
  const centerRef = useRef(null)
  const mainRingRef = useRef(null)
  const outerRingRef = useRef(null)
  const haloRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    const pulse = Math.sin(time * 3)
    const highlighted = selected || hovered

    if (centerRef.current) {
      centerRef.current.scale.setScalar(
        highlighted ? 1.4 + pulse * 0.12 : dimmed ? 0.78 : 1 + pulse * 0.08
      )
    }

    if (mainRingRef.current) {
      mainRingRef.current.rotation.z = time * (highlighted ? 0.8 : 0.35)
      mainRingRef.current.scale.setScalar(
        highlighted ? 1.25 + pulse * 0.06 : 1
      )
    }

    if (outerRingRef.current) {
      outerRingRef.current.visible = highlighted
      outerRingRef.current.rotation.z = -time * 0.55
    }

    if (haloRef.current) {
      haloRef.current.visible = highlighted
      haloRef.current.scale.setScalar(1.15 + pulse * 0.12)
    }
  })

  const handleClick = (event) => {
    event.stopPropagation()
    onSelect?.(sensor)
  }

  const opacity = !active ? 0.2 : dimmed ? 0.3 : 1

  return (
    <group>
      {separationMode && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([...position, ...displayPosition]),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={color}
            transparent
            opacity={0.55}
            depthTest={false}
            depthWrite={false}
          />
        </line>
      )}

      <group position={displayPosition} scale={markerScale}>
        <mesh ref={centerRef} renderOrder={10}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={opacity}
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={mainRingRef} renderOrder={11}>
          <torusGeometry args={[0.055, 0.004, 8, 48]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={opacity * 0.85}
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={outerRingRef} visible={selected} renderOrder={12}>
          <torusGeometry args={[0.085, 0.004, 8, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.95}
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={haloRef} visible={selected} renderOrder={9}>
          <sphereGeometry args={[0.055, 24, 24]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.12}
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh
          onClick={handleClick}
          onPointerOver={(event) => {
            event.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = ''
          }}
          renderOrder={15}
        >
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial
            transparent
            opacity={0}
            depthTest={false}
            depthWrite={false}
            color={color}
          />
        </mesh>
      </group>
    </group>
  )
}

export function SensorIndicators({
  activeSensors = {},
  visible = true,
  selectedSensor = null,
  onSelectSensor,
  categoryFilter = 'all',
  markerSize = 'normal',
  separationMode = false,
}) {
  if (!visible) return null

  const validHardware = Object.entries(HARDWARE_POSITIONS).filter(
    ([key, position]) => {
      const details = HARDWARE_DETAILS[key]

      return (
        details &&
        Array.isArray(position) &&
        position.length === 3 &&
        position.every(Number.isFinite) &&
        (categoryFilter === 'all' || details.category === categoryFilter)
      )
    }
  )

  const hasSelection = validHardware.some(
    ([key]) => key === selectedSensor
  )

  return (
    <group name="aditi-sensor-indicators">
      {validHardware.map(([sensor, position]) => {
        const details = HARDWARE_DETAILS[sensor]

        return (
          <SensorMarker
            key={sensor}
            sensor={sensor}
            position={position}
            displayPosition={getHardwareDisplayPosition(sensor, separationMode)}
            color={details.color}
            active={activeSensors[sensor] !== false}
            selected={selectedSensor === sensor}
            dimmed={hasSelection && selectedSensor !== sensor}
            markerScale={MARKER_SIZES[markerSize] || 1}
            separationMode={separationMode}
            onSelect={onSelectSensor}
          />
        )
      })}
    </group>
  )
}
