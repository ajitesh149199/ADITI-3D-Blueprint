
import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function FitOnLoad({ objectRef, margin = 1.6 }) {
  const { camera, controls } = useThree()
  const done = useRef(false)

  useFrame(() => {
    if (done.current) return

    const obj = objectRef.current
    if (!obj) return

    const box = new THREE.Box3().setFromObject(obj)
    if (box.isEmpty()) return

    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)

    if (maxDim < 1e-6) return

    const dist = maxDim * margin

    camera.position.set(
      center.x + dist * 0.55,
      center.y + dist * 0.28,
      center.z + dist
    )

    camera.near = Math.max(0.01, dist / 100)
    camera.far = dist * 40
    camera.updateProjectionMatrix()
    camera.lookAt(center)

    if (controls) {
      controls.target.copy(center)
      controls.update()
    }

    done.current = true
  })

  return null
}

export function ViewerControls({ controlsRef, enable = true }) {
  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={enable}
      enableZoom={enable}
      enableRotate={enable}
      minDistance={0.4}
      maxDistance={14}
      dampingFactor={0.08}
      enableDamping
    />
  )
}

export function InspectionCamera({
  selectedId,
  resetRequest = 0,
  focusPosition = [0, 0.15, 1.5],
  focusDistance = 3.2,
}) {
  const { camera, controls } = useThree()

  const savedView = useRef(null)
  const lastSelection = useRef(null)
  const targetView = useRef(null)
  const lastResetRequest = useRef(resetRequest)

  const focusX = focusPosition[0]
  const focusY = focusPosition[1]
  const focusZ = focusPosition[2]

  useEffect(() => {
    if (!controls) return

    if (selectedId && !lastSelection.current) {
      savedView.current = {
        position: camera.position.clone(),
        target: controls.target.clone(),
      }
    }

    if (selectedId) {
      const center = new THREE.Vector3(
        focusX,
        focusY,
        focusZ
      )

      const direction = camera.position
        .clone()
        .sub(controls.target)

      if (direction.lengthSq() < 0.0001) {
        direction.set(0, 0.2, 1)
      }

      direction.normalize()

      targetView.current = {
        position: center
          .clone()
          .addScaledVector(direction, focusDistance),
        target: center,
      }
    } else if (savedView.current) {
      targetView.current = savedView.current
      savedView.current = null
    }

    lastSelection.current = selectedId
  }, [
    selectedId,
    camera,
    controls,
    focusX,
    focusY,
    focusZ,
    focusDistance,
  ])

  useEffect(() => {
    if (resetRequest === lastResetRequest.current) return

    lastResetRequest.current = resetRequest

    if (!selectedId || !controls) return

    const center = new THREE.Vector3(
      focusX,
      focusY,
      focusZ
    )

    targetView.current = {
      position: center.clone().add(
        new THREE.Vector3(0.5, 0.25, 1)
          .normalize()
          .multiplyScalar(focusDistance)
      ),
      target: center,
    }
  }, [
    resetRequest,
    selectedId,
    controls,
    focusX,
    focusY,
    focusZ,
    focusDistance,
  ])

  useFrame((_, delta) => {
    if (!controls || !targetView.current) return

    const speed = 1 - Math.exp(-5 * delta)
    const destination = targetView.current

    camera.position.lerp(destination.position, speed)
    controls.target.lerp(destination.target, speed)
    controls.update()

    const positionDone =
      camera.position.distanceTo(destination.position) < 0.005

    const targetDone =
      controls.target.distanceTo(destination.target) < 0.005

    if (positionDone && targetDone) {
      camera.position.copy(destination.position)
      controls.target.copy(destination.target)
      controls.update()
      targetView.current = null
    }
  })

  return null
}

export function resetCamera(controls, camera) {
  if (!controls || !camera) return

  camera.position.set(2.4, 1.1, 3.6)
  controls.target.set(0, 0, 0)
  controls.update()
}


/**
 * Advanced camera controller for the
 * ADITI Component Explorer.
 *
 * This component does not modify the existing
 * InspectionCamera used by the Exploded View.
 */

export function ExplorerCamera({
  view = 'default',
  viewRequest = 0,
  autoRotate = false,
}) {
  const { camera, controls } = useThree()

  const targetView = useRef(null)
  const lastRequest = useRef(viewRequest)

  useEffect(() => {
    if (!controls) return

    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 1.2

    return () => {
      controls.autoRotate = false
    }
  }, [controls, autoRotate])

  useEffect(() => {
    if (!controls) return
    if (lastRequest.current === viewRequest) return

    lastRequest.current = viewRequest

    const center = controls.target.clone()

    const currentDistance = camera.position.distanceTo(center)
    
const distance =
  view === 'default'
    ? 3.2
    : Math.max(currentDistance, 0.8) 

    const directions = {
      default: [0.55, 0.28, 1],
      front: [0, 0, 1],
      back: [0, 0, -1],
      left: [-1, 0, 0],
      right: [1, 0, 0],
      top: [0, 1, 0.001],
      bottom: [0, -1, 0.001],
    }

    const direction = new THREE.Vector3(
      ...(directions[view] ?? directions.default)
    ).normalize()

    targetView.current = {
      position: center
        .clone()
        .addScaledVector(direction, distance),
      target: center,
    }
  }, [view, viewRequest, camera, controls])

  useFrame((_, delta) => {
    if (!controls || !targetView.current) return

    const destination = targetView.current
    const speed = 1 - Math.exp(-5 * delta)

    camera.position.lerp(destination.position, speed)
    controls.target.lerp(destination.target, speed)

    controls.update()

    const positionDone =
      camera.position.distanceTo(destination.position) < 0.005

    const targetDone =
      controls.target.distanceTo(destination.target) < 0.005

    if (positionDone && targetDone) {
      camera.position.copy(destination.position)
      controls.target.copy(destination.target)
      controls.update()

      targetView.current = null
    }
  })

  return null
}

