import * as THREE from 'three'

export function inspectScene(root) {
  const nodes = []
  let meshCount = 0
  let unnamedMeshes = 0

  root.traverse((obj) => {
    const isMesh = obj.isMesh || obj.isSkinnedMesh
    if (isMesh) meshCount += 1
    if (isMesh && !obj.name) unnamedMeshes += 1

    nodes.push({
      uuid: obj.uuid,
      name: obj.name || '(unnamed)',
      type: obj.type,
      isMesh,
      childCount: obj.children.length,
    })
  })

  const box = new THREE.Box3().setFromObject(root)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)

  return {
    nodeCount: nodes.length,
    meshCount,
    unnamedMeshes,
    empty: box.isEmpty(),
    size: { x: size.x, y: size.y, z: size.z },
    center: { x: center.x, y: center.y, z: center.z },
    maxDim: Math.max(size.x, size.y, size.z),
    nodes,
  }
}

export function namedMeshes(inspection) {
  if (!inspection) return []
  return inspection.nodes.filter((n) => n.isMesh && n.name !== '(unnamed)')
}
