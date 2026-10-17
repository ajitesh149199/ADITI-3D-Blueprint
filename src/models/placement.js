/**
 * Visualization placement for independently exported GLBs.
 *
 * These files do not share a common origin with ADITI 3D.glb.
 * Positions are a configurable engineering layout for the exploded
 * dashboard — not verified physical mounting inside the glasses.
 *
 * assembled: approximate clustered layout around the chassis
 * exploded: inspection offsets used by the scroll animation
 */

export const PLACEMENT = {
  hw02: {
    assembled: { position: [0.12, 0.02, 0.42], rotation: [0, 0, 0] },
    exploded: { position: [0.15, 0.55, 1.35], rotation: [0.1, 0.2, 0] },
    labelOffset: [0.35, 0.28, 0],
  },
  hw20: {
    assembled: { position: [-0.18, -0.04, 0.4], rotation: [0, 0.1, 0] },
    exploded: { position: [-0.85, -0.15, 1.2], rotation: [0, 0.4, 0] },
    labelOffset: [-0.4, 0.22, 0],
  },
  hw01: {
    assembled: { position: [0.85, -0.05, -0.05], rotation: [0, Math.PI / 2, 0] },
    exploded: { position: [1.85, -0.05, 0.15], rotation: [0.15, 1.2, 0] },
    labelOffset: [0.45, 0.22, 0],
  },
  hw19: {
    assembled: { position: [0.05, 0.28, -0.15], rotation: [0, 0, 0] },
    exploded: { position: [0.1, 1.15, -0.35], rotation: [0.2, 0, 0] },
    labelOffset: [0.4, 0.2, 0],
  },
  hw18_21_22: {
    assembled: { position: [-0.75, -0.02, 0.05], rotation: [0, -0.4, 0] },
    exploded: { position: [-1.75, 0.35, 0.25], rotation: [0.1, -0.6, 0] },
    labelOffset: [-0.45, 0.25, 0],
  },
  hw07_08_09: {
    assembled: { position: [-0.95, -0.08, -0.35], rotation: [0, -0.9, 0] },
    exploded: { position: [-1.65, -0.55, -0.85], rotation: [0.1, -1.1, 0] },
    labelOffset: [-0.35, -0.28, 0],
  },
  hw05_06: {
    assembled: { position: [0.7, -0.12, -0.45], rotation: [0, 0.4, 0] },
    exploded: { position: [1.55, -0.7, -0.95], rotation: [0.15, 0.5, 0] },
    labelOffset: [0.4, -0.22, 0],
  },
  hw10_11_12: {
    assembled: { position: [1.05, 0.08, -0.15], rotation: [0, 0.6, 0] },
    exploded: { position: [2.05, 0.55, -0.35], rotation: [0, 0.8, 0] },
    labelOffset: [0.35, 0.25, 0],
  },
  hw15_23_28: {
    assembled: { position: [0.15, -0.28, -0.1], rotation: [0.2, 0, 0] },
    exploded: { position: [0.2, -1.15, -0.2], rotation: [0.4, 0.2, 0] },
    labelOffset: [0.45, -0.15, 0],
  },
}

export const CALIBRATION_NOTES = [
  'Hardware GLBs were exported independently and do not share the glasses origin.',
  'Assembled positions are a visualization layout for this dashboard, not measured CAD mounts.',
  'Scale is normalized per-file using bounding-box longest axis (see targetSize in the registry).',
  'Grouped files (audio, power, controls, IMU/haptic, interfaces) stay as parent assemblies until runtime node names prove otherwise.',
]

export function lerpPose(id, t) {
  const p = PLACEMENT[id]
  if (!p) return { position: [0, 0, 0], rotation: [0, 0, 0] }
  const a = p.assembled
  const b = p.exploded
  const ease = t * t * (3 - 2 * t)
  return {
    position: a.position.map((v, i) => v + (b.position[i] - v) * ease),
    rotation: a.rotation.map((v, i) => v + (b.rotation[i] - v) * ease),
  }
}
