
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'

import { GltfAsset } from '../../models/GltfAsset'
import { lerpPose, PLACEMENT } from '../../models/placement'
import {
  getComponent,
  HARDWARE_IDS,
  modelUrl,
} from '../../models/registry'
import { useApp } from '../../state/AppContext'
import { HardwareConnections } from './HardwareConnections'

function AnimatedHardware({
  id,
  explode,
  selectedId,
  onSelect,
  onInspect,
}) {
  const root = useRef(null)
  const spec = getComponent(id)
  const pose = lerpPose(id, explode)

  const inspecting = selectedId !== null
  const isSelected = selectedId === id

  useFrame((_, delta) => {
    if (!root.current) return

    const speed = 1 - Math.exp(-7 * delta)

    const targetPosition = isSelected
      ? [0, 0.15, 1.5]
      : pose.position

    const targetScale = isSelected
      ? 2.8
      : inspecting
        ? 0.35
        : 1

    const targetRotation = isSelected
      ? [0, 0, 0]
      : pose.rotation

    root.current.position.lerp(
      new THREE.Vector3(...targetPosition),
      speed
    )

    root.current.scale.lerp(
      new THREE.Vector3(
        targetScale,
        targetScale,
        targetScale
      ),
      speed
    )

    const targetQuaternion = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(...targetRotation))

    root.current.quaternion.slerp(
      targetQuaternion,
      speed
    )
  })

  return (
    <group
      ref={root}
      position={pose.position}
      rotation={pose.rotation}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(id)
      }}
    >
      <GltfAsset
        url={modelUrl(spec.fileId)}
        targetSize={spec.targetSize}
        highlighted={isSelected}
        onInspect={(report) => onInspect(id, report)}
      />
    </group>
  )
}

function GlassesAssembly({
  selectedId,
  xray,
  onInspect,
}) {
  const root = useRef(null)
  const glasses = getComponent('glasses')

  useFrame((_, delta) => {
    if (!root.current) return

    const targetScale = selectedId ? 0.45 : 1
    const speed = 1 - Math.exp(-7 * delta)

    root.current.scale.lerp(
      new THREE.Vector3(
        targetScale,
        targetScale,
        targetScale
      ),
      speed
    )
  })

  return (
    <group ref={root}>
      <GltfAsset
        url={modelUrl('glasses')}
        targetSize={glasses.targetSize}
        highlighted={false}
        xray={xray}
        onInspect={(report) =>
          onInspect('glasses', report)
        }
      />
    </group>
  )
}

function HardwareLabel({
  id,
  explode,
  selectedId,
  onSelect,
}) {
  if (selectedId || explode < 0.22) return null

  const spec = getComponent(id)
  const pose = lerpPose(id, explode)

  const offset =
    PLACEMENT[id]?.labelOffset ?? [0, 0.4, 0]

  const labelPosition = [
    offset[0] * 2.1,
    offset[1] * 2.1,
    offset[2],
  ]

  return (
    <group
      position={pose.position}
      rotation={pose.rotation}
    >
      <Line
        points={[[0, 0, 0], labelPosition]}
        color="#67e8f9"
        lineWidth={1}
        transparent
        opacity={0.5}
      />

      <Html
        position={labelPosition}
        center
        distanceFactor={8}
        occlude={false}
        zIndexRange={[5, 1]}
        style={{ pointerEvents: 'auto' }}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onSelect(id)
          }}
          style={{
            background: 'rgba(5, 12, 24, 0.88)',
            border:
              '1px solid rgba(103,232,249,0.5)',
            borderRadius: 6,
            padding: '4px 7px',
            color: '#a5f3fc',
            fontSize: 10,
            fontFamily:
              'IBM Plex Mono, monospace',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            boxShadow:
              '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {spec.shortName}
        </button>
      </Html>
    </group>
  )
}


export function ExplodedScene({
  explode,
  enabledIds = HARDWARE_IDS,
  selectedId = null,
  xray = false,
  connectionsEnabled = false,
  activeTypes,
  onSelect = () => {},
}) {

  const {
    recordInspect,
    setModelStatus,
  } = useApp()

  function handleInspect(id, report) {
    recordInspect(id, report)
    setModelStatus(id, 'ready')
  }

  return (
    <group onPointerMissed={() => onSelect(null)}>
      <GlassesAssembly
        selectedId={selectedId}
        xray={xray}
        onInspect={handleInspect}
      />

      {enabledIds.map((id) => (
        <AnimatedHardware
          key={id}
          id={id}
          explode={explode}
          selectedId={selectedId}
          onSelect={onSelect}
          onInspect={handleInspect}
        />
      ))}

      {enabledIds.map((id) => (
        <HardwareLabel
          key={`label-${id}`}
          id={id}
          explode={explode}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}

      
<HardwareConnections
  explode={explode}
  visibleIds={enabledIds}
  enabled={connectionsEnabled}
  selectedId={selectedId}
  activeTypes={activeTypes}
/>

    </group>
  )
}
