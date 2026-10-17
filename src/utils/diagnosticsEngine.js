
import {
  DIAGNOSTIC_HARDWARE,
  DIAGNOSTIC_FAULTS,
  BASELINE_METRICS,
} from '../data/diagnosticsData'

export function evaluateDiagnostics(faultIds) {
  const activeFaults = DIAGNOSTIC_FAULTS.filter(
    (fault) => faultIds.includes(fault.id)
  )

  const metrics = { ...BASELINE_METRICS }

  if (faultIds.includes('high-load')) {
    metrics.cpu = 94
    metrics.memory = 78
    metrics.latency = 280
    metrics.workload = 96
  }

  if (faultIds.includes('low-battery')) {
    metrics.battery = 9
  }

  const hardware = DIAGNOSTIC_HARDWARE.map((component) => {
    const fault = activeFaults.find(
      (item) => item.target === component.id
    )

    return {
      ...component,
      status: !fault
        ? 'Online'
        : fault.severity === 'critical'
          ? 'Offline'
          : 'Warning',
      reliability: !fault
        ? 98
        : fault.severity === 'critical'
          ? 0
          : 55,
    }
  })

  const systemStatus = activeFaults.some(
    (fault) => fault.severity === 'critical'
  )
    ? 'Critical'
    : activeFaults.length > 0
      ? 'Warning'
      : 'Operational'

  return {
    hardware,
    activeFaults,
    metrics,
    systemStatus,
  }
}
