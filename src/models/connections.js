
/**
 * ADITI 3D BLUEPRINT
 * Conceptual Hardware Connection Registry
 *
 * These relationships represent logical data,
 * power, feedback, and control paths.
 *
 * They are NOT verified electrical wiring,
 * cable routes, or connector pin assignments.
 */

export const CONNECTION_TYPES = {
  sensing: {
    label: 'Sensor Data',
    color: '#00e7ee',
  },

  power: {
    label: 'Power Distribution',
    color: '#ff007a',
  },

  feedback: {
    label: 'Feedback / Output',
    color: '#c084fc',
  },

  control: {
    label: 'Control / Interface',
    color: '#fbbf24',
  },
}

export const HARDWARE_CONNECTIONS = [
  {
    id: 'camera-compute',
    from: 'hw02',
    to: 'hw01',
    type: 'sensing',
    label: 'Camera data',
  },
  {
    id: 'tof-compute',
    from: 'hw20',
    to: 'hw01',
    type: 'sensing',
    label: 'Distance measurements',
  },
  {
    id: 'gnss-compute',
    from: 'hw19',
    to: 'hw01',
    type: 'sensing',
    label: 'Position data',
  },
  {
    id: 'imu-haptic-compute',
    from: 'hw18_21_22',
    to: 'hw01',
    type: 'sensing',
    label: 'Motion data and haptic control',
  },
  {
    id: 'audio-compute',
    from: 'hw07_08_09',
    to: 'hw01',
    type: 'feedback',
    label: 'Audio input and output',
  },
  {
    id: 'power-compute',
    from: 'hw05_06',
    to: 'hw01',
    type: 'power',
    label: 'Conceptual power supply',
  },
  {
    id: 'controls-compute',
    from: 'hw10_11_12',
    to: 'hw01',
    type: 'control',
    label: 'User input and status',
  },
  {
    id: 'interfaces-compute',
    from: 'hw15_23_28',
    to: 'hw01',
    type: 'control',
    label: 'Hardware interfaces',
  },
]

/**
 * Returns connections whose endpoints are visible.
 *
 * Optional activeTypes lets the UI filter by
 * sensing, power, feedback, and control.
 *
 * Existing calls without activeTypes continue
 * to return all visible connection types.
 */
export function getVisibleConnections(
  visibleIds,
  activeTypes = Object.keys(CONNECTION_TYPES)
) {
  const visible = new Set(visibleIds)
  const allowedTypes = new Set(activeTypes)

  return HARDWARE_CONNECTIONS.filter(
    (connection) =>
      visible.has(connection.from) &&
      visible.has(connection.to) &&
      allowedTypes.has(connection.type)
  )
}
