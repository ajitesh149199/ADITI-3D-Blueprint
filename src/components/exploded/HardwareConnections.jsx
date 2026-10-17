
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

import { lerpPose } from '../../models/placement'
import {
  CONNECTION_TYPES,
  getVisibleConnections,
} from '../../models/connections'

const DEFAULT_ACTIVE_TYPES = Object.keys(CONNECTION_TYPES)

/**
 * Animated conceptual connection.
 * Not a verified physical wiring route.
 */
function AnimatedConnection({ connection, explode }) {
  const particleRef = useRef(null)
  const progressRef = useRef(0)

  const fromPose = lerpPose(connection.from, explode)
  const toPose = lerpPose(connection.to, explode)

  const start = useMemo(() => new THREE.Vector3(), [])
  const end = useMemo(() => new THREE.Vector3(), [])

  const color =
    CONNECTION_TYPES[connection.type]?.color || '#00e7ee'

  const speed =
    connection.type === 'power' ? 0.45 : 0.75

  useFrame((_, delta) => {
    if (!particleRef.current) return

    start.set(...fromPose.position)
    end.set(...toPose.position)

    progressRef.current =
      (progressRef.current + delta * speed) % 1

    particleRef.current.position.lerpVectors(
      start,
      end,
      progressRef.current
    )
  })

  return (
    <group>
      <Line
        points={[fromPose.position, toPose.position]}
        color={color}
        lineWidth={1.6}
        transparent
        opacity={0.7}
        dashed
        dashSize={0.12}
        gapSize={0.08}
        depthTest={false}
        renderOrder={3}
      />

      <mesh ref={particleRef} renderOrder={5}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial
          color={color}
          depthTest={false}
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  )
}

/**
 * Connection renderer with optional type filtering.
 *
 * activeTypes may contain:
 * sensing, power, feedback, control
 */
export function HardwareConnections({
  explode = 0,
  visibleIds = [],
  enabled = false,
  selectedId = null,
  activeTypes = DEFAULT_ACTIVE_TYPES,
}) {
  const connections = useMemo(() => {
    if (!enabled || selectedId) return []

    return getVisibleConnections(visibleIds, activeTypes)
  }, [enabled, visibleIds, selectedId, activeTypes])

  if (!enabled || selectedId || explode < 0.22) {
    return null
  }

  return (
    <group name="ADITI_Hardware_Connections">
      {connections.map((connection) => (
        <AnimatedConnection
          key={connection.id}
          connection={connection}
          explode={explode}
        />
      ))}
    </group>
  )
}
