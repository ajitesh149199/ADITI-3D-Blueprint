
import { useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import {
  HARDWARE_POSITIONS,
} from './SensorIndicators'

// ==================================================
// ADITI 3D BLUEPRINT
// PHASE 10.5.14E.2
// PROJECT SELECTED HARDWARE INTO SCREEN SPACE
// ==================================================

const projectedPoint = new THREE.Vector3()

export function HardwareScreenTracker({
  selectedHardware,
  onScreenPosition,
}) {
  const { camera, size } = useThree()

  const position =
    HARDWARE_POSITIONS[selectedHardware]

  useFrame(() => {
    if (!position) return

    projectedPoint.set(
      position[0],
      position[1],
      position[2]
    )

    projectedPoint.project(camera)

    const x =
      (projectedPoint.x * 0.5 + 0.5) *
      size.width

    const y =
      (-projectedPoint.y * 0.5 + 0.5) *
      size.height

    const visible =
      projectedPoint.z >= -1 &&
      projectedPoint.z <= 1 &&
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
// ANIMATED SVG CONNECTION OVERLAY
// ==================================================

export function HardwareConnectionLine({
  start,
  end,
  color = '#22d3ee',
}) {
  const [animationKey] = useState(1)

  if (!start?.visible || !end) {
    return null
  }

  const middleX =
    start.x + (end.x - start.x) * 0.55

  const path = [
    `M ${start.x} ${start.y}`,
    `L ${middleX} ${start.y}`,
    `L ${end.x} ${end.y}`,
  ].join(' ')

  return (
    <svg
      key={animationKey}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 15,
        overflow: 'hidden',
      }}
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="7"
        opacity="0.12"
        strokeLinecap="round"
      />

      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="8 7"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="30"
          to="0"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </path>

      <circle
        cx={start.x}
        cy={start.y}
        r="5"
        fill={color}
      />

      <circle
        cx={end.x}
        cy={end.y}
        r="4"
        fill={color}
      />
    </svg>
  )
}
