
export function calculatePower(components, enabled, processingFactor = 1) {
  const enabledSet = new Set(enabled)

  const breakdown = components.map((component) => {
    const active = enabledSet.has(component.id)

    const factor =
      component.id === 'raspberryPi'
        ? processingFactor
        : 1

    const watts = active
      ? component.watts * factor
      : 0

    return { ...component, active, effectiveWatts: watts }
  })

  const totalWatts = breakdown.reduce(
    (sum, component) => sum + component.effectiveWatts,
    0
  )

  return { breakdown, totalWatts }
}

export function calculateBattery(battery, totalWatts) {
  const capacityMah = Math.max(0, Number(battery.capacityMah) || 0)
  const voltage = Math.max(0, Number(battery.voltage) || 0)

  const usable = Math.min(
    100,
    Math.max(0, Number(battery.usablePercent) || 0)
  ) / 100

  const efficiency = Math.min(
    100,
    Math.max(0, Number(battery.efficiencyPercent) || 0)
  ) / 100

  const nominalWh = (capacityMah * voltage) / 1000
  const availableWh = nominalWh * usable * efficiency

  return {
    nominalWh,
    availableWh,
    runtimeHours:
      totalWatts > 0 ? availableWh / totalWatts : null,
  }
}

export function calculateSavings(baselineWatts, currentWatts) {
  if (baselineWatts <= 0) return 0

  return Math.max(
    0,
    ((baselineWatts - currentWatts) / baselineWatts) * 100
  )
}
