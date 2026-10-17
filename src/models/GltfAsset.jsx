
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { inspectScene } from './inspectScene'

const cache = new Map()

const HIGHLIGHT_COLOR = new THREE.Color('#22d3ee')

// ==================================================
// Inspection Cache
// ==================================================

export function getInspection(url) {
  return cache.get(url) ?? null
}

// ==================================================
// Geometry Measurements
// ==================================================

function calculateGeometryMeasurements(object, targetSize) {
  // Measure the original GLB scene geometry.
  const box = new THREE.Box3().setFromObject(object)

  if (box.isEmpty()) {
    return null
  }

  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  const maxDimension = Math.max(
    size.x,
    size.y,
    size.z
  )

  if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
    return null
  }

  const scaleFactor = targetSize / maxDimension

  const source = {
    width: size.x,
    height: size.y,
    depth: size.z,
    volume: size.x * size.y * size.z,
  }

  const display = {
    width: size.x * scaleFactor,
    height: size.y * scaleFactor,
    depth: size.z * scaleFactor,
    volume:
      size.x *
      size.y *
      size.z *
      Math.pow(scaleFactor, 3),
  }

  return {
    source,
    display,
    scaleFactor,
    center: center.toArray(),
    units: 'GLB model units',
    physicalUnitsVerified: false,
  }
}

// ==================================================
// GLB Asset Component
// ==================================================

export function GltfAsset({
  url,
  targetSize = 1,
  onInspect,
  castShadow = true,
  highlighted = false,
  xray = false,
  ...groupProps
}) {
  const gltf = useGLTF(url)

  // --------------------------------------------------
  // Clone the model and materials
  // --------------------------------------------------

  const cloned = useMemo(() => {
    const copy = gltf.scene.clone(true)

    copy.traverse((obj) => {
      if (!obj.isMesh) return

      obj.castShadow = castShadow
      obj.receiveShadow = true

      if (Array.isArray(obj.material)) {
        obj.material = obj.material.map(
          (material) => material?.clone?.() ?? material
        )
      } else if (obj.material) {
        obj.material = obj.material.clone()
      }
    })

    return copy
  }, [gltf.scene, castShadow])

  // --------------------------------------------------
  // Preserve original material properties
  // --------------------------------------------------

  const originalMaterials = useMemo(() => {
    const materials = new Map()

    cloned.traverse((obj) => {
      if (!obj.isMesh) return

      const meshMaterials = Array.isArray(obj.material)
        ? obj.material
        : [obj.material]

      meshMaterials.forEach((material) => {
        if (!material || materials.has(material)) return

        materials.set(material, {
          emissive: material.emissive?.clone() ?? null,
          emissiveIntensity: material.emissiveIntensity ?? 1,
          opacity: material.opacity,
          transparent: material.transparent,
          depthWrite: material.depthWrite,
        })
      })
    })

    return materials
  }, [cloned])

  // --------------------------------------------------
  // Highlighting and X-Ray
  // --------------------------------------------------

  useEffect(() => {
    originalMaterials.forEach((original, material) => {
      if (original.emissive && material.emissive) {
        if (highlighted) {
          material.emissive.copy(original.emissive)
          material.emissive.lerp(HIGHLIGHT_COLOR, 0.12)
          material.emissiveIntensity = 0.15
        } else {
          material.emissive.copy(original.emissive)
          material.emissiveIntensity =
            original.emissiveIntensity
        }
      }

      if (xray) {
        material.transparent = true
        material.opacity = Math.min(
          original.opacity,
          0.22
        )
        material.depthWrite = false
      } else {
        material.transparent = original.transparent
        material.opacity = original.opacity
        material.depthWrite = original.depthWrite
      }

      material.needsUpdate = true
    })

    return () => {
      originalMaterials.forEach((original, material) => {
        if (original.emissive && material.emissive) {
          material.emissive.copy(original.emissive)
          material.emissiveIntensity =
            original.emissiveIntensity
        }

        material.transparent = original.transparent
        material.opacity = original.opacity
        material.depthWrite = original.depthWrite
        material.needsUpdate = true
      })
    }
  }, [highlighted, xray, originalMaterials])

  // --------------------------------------------------
  // Model Measurements and Normalization
  // --------------------------------------------------

  const geometryMeasurements = useMemo(() => {
    return calculateGeometryMeasurements(
      cloned,
      targetSize
    )
  }, [cloned, targetSize])

  const { wrapperScale, wrapperOffset } = useMemo(() => {
    if (!geometryMeasurements) {
      return {
        wrapperScale: 1,
        wrapperOffset: [0, 0, 0],
      }
    }

    return {
      wrapperScale: geometryMeasurements.scaleFactor,
      wrapperOffset:
        geometryMeasurements.center.map(
          (coordinate) => -coordinate
        ),
    }
  }, [geometryMeasurements])

  // --------------------------------------------------
  // Scene Inspection
  // --------------------------------------------------

  const inspected = useRef(false)

  useLayoutEffect(() => {
    if (inspected.current) return

    const baseReport = inspectScene(cloned)

    const report = {
      ...baseReport,
      geometryMeasurements,
    }

    cache.set(url, report)

    inspected.current = true

    onInspect?.(report)
  }, [
    cloned,
    url,
    onInspect,
    geometryMeasurements,
  ])

  // --------------------------------------------------
  // Render the GLB
  // --------------------------------------------------

  return (
    <group {...groupProps}>
      <group scale={wrapperScale}>
        <group position={wrapperOffset}>
          <primitive object={cloned} />
        </group>
      </group>
    </group>
  )
}

// ==================================================
// Preload
// ==================================================

export function preloadModel(url) {
  return useGLTF.preload(url)
}
