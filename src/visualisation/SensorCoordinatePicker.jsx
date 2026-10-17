
import { useCallback, useRef } from 'react'
import * as THREE from 'three'
import { GltfAsset } from '../models/GltfAsset'

// ==================================================
// SENSOR COORDINATE PICKER
// ==================================================
//
// Uses the normalized GLB geometry for raycasting.
//
// Click a visible surface of the glasses to obtain
// its coordinates in the parent group's local space.
//
// ==================================================

export function SensorCoordinatePicker({
  url,
  targetSize = 1,
  enabled = false,
  onPick,
}) {
  const groupRef = useRef(null)

  const handlePointerDown = useCallback(
    (event) => {
      if (!enabled || !groupRef.current) {
        return
      }

      // Prevent the click from reaching other
      // React Three Fiber objects.
      event.stopPropagation()

      // Ignore clicks that do not hit a mesh.
      if (!event.object?.isMesh) {
        return
      }

      // The hit point is expressed in world space.
      const worldPoint = event.point.clone()

      // Convert it into the coordinate space used
      // by SensorIndicators.
      const localPoint =
        groupRef.current.worldToLocal(
          worldPoint.clone()
        )

      // Estimate the surface normal in world space.
      // Useful for positioning a marker slightly
      // outside the surface.
      let localNormal = null

      if (event.face) {
        const normalMatrix =
          new THREE.Matrix3().getNormalMatrix(
            event.object.matrixWorld
          )

        const worldNormal =
          event.face.normal
            .clone()
            .applyMatrix3(normalMatrix)
            .normalize()

        const inverseParent =
          new THREE.Matrix4()
            .copy(groupRef.current.matrixWorld)
            .invert()

        const normalMatrixToLocal =
          new THREE.Matrix3().getNormalMatrix(
            inverseParent
          )

        localNormal = worldNormal
          .applyMatrix3(normalMatrixToLocal)
          .normalize()
      }

      // Keep the marker slightly above the surface
      // so it doesn't disappear into the mesh.
      const markerPoint = localPoint.clone()

      if (localNormal) {
        markerPoint.addScaledVector(
          localNormal,
          0.025
        )
      }

      const round = (value) =>
        Number(value.toFixed(4))

      onPick?.({
        position: markerPoint
          .toArray()
          .map(round),

        surfacePosition: localPoint
          .toArray()
          .map(round),

        normal: localNormal
          ? localNormal.toArray().map(round)
          : null,

        meshName:
          event.object.name || 'Unnamed mesh',
      })
    },
    [enabled, onPick]
  )

  return (
    <group
      ref={groupRef}
      onPointerDown={
        enabled ? handlePointerDown : undefined
      }
    >
      <GltfAsset
        url={url}
        targetSize={targetSize}
      />
    </group>
  )
}
