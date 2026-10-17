

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'


import { runUnifiedScenario } from '../utils/unifiedSimulationEngine'
import { validateAllScenarios } from '../utils/integrationValidation'
import { calculatePerformanceAnalytics } from '../utils/performanceAnalytics'

import {
  createTelemetrySnapshot,
  createTelemetryEvent,
  appendTelemetryEvent,
  appendTelemetrySnapshot,
} from '../utils/realtimeTelemetryEngine'

const UnifiedSystemContext = createContext(null)

export function UnifiedSystemProvider({ children }) {
  // Existing shared system state
  const [faultIds, setFaultIds] = useState([])
  const [acknowledged, setAcknowledged] = useState([])
  const [missionHistory, setMissionHistory] = useState([])
  const [latestResult, setLatestResult] = useState(null)

  // Phase L — Validation
  const [batchResults, setBatchResults] = useState(null)
  const [batchError, setBatchError] = useState('')
  const [batchRunning, setBatchRunning] = useState(false)
  const [lastValidationTime, setLastValidationTime] = useState(null)

  // Phase M — Real-time event history
  const [telemetryEvents, setTelemetryEvents] = useState([])
  const [telemetryHistory, setTelemetryHistory] = useState([])

  const addTelemetryEvent = useCallback(
    (type, message, details = null) => {
      const event = createTelemetryEvent({
        type,
        message,
        details,
      })

      setTelemetryEvents((previous) =>
        appendTelemetryEvent(previous, event)
      )

      return event
    },
    []
  )

  const toggleFault = useCallback(
    (faultId) => {
      const isActive = faultIds.includes(faultId)

      setFaultIds((previous) =>
        previous.includes(faultId)
          ? previous.filter((id) => id !== faultId)
          : [...previous, faultId]
      )

      setAcknowledged((previous) =>
        previous.filter((id) => id !== faultId)
      )

      addTelemetryEvent(
        'diagnostic',
        isActive
          ? `Simulated fault cleared: ${faultId}`
          : `Simulated fault activated: ${faultId}`,
        { faultId, active: !isActive }
      )
    },
    [faultIds, addTelemetryEvent]
  )

  const acknowledgeFault = useCallback(
    (faultId) => {
      setAcknowledged((previous) =>
        previous.includes(faultId)
          ? previous
          : [...previous, faultId]
      )

      addTelemetryEvent(
        'diagnostic',
        `Fault acknowledged: ${faultId}`,
        { faultId }
      )
    },
    [addTelemetryEvent]
  )

  const resetFaults = useCallback(() => {
    setFaultIds([])
    setAcknowledged([])

    addTelemetryEvent(
      'diagnostic',
      'All simulated faults reset'
    )
  }, [addTelemetryEvent])

  const runMission = useCallback(
    (scenarioId, additionalFaults = []) => {
      const activeFaults = [
        ...new Set([...faultIds, ...additionalFaults]),
      ]

      const result = runUnifiedScenario(
        scenarioId,
        activeFaults
      )

      const record = {
        ...result,
        id: `${Date.now()}-${Math.random()}`,
      }

      setLatestResult(record)

      setMissionHistory((previous) =>
        [record, ...previous].slice(0, 50)
      )

      addTelemetryEvent(
        'mission',
        `Mission executed: ${scenarioId}`,
        {
          scenarioId,
          status: record.status,
          activeFaults,
        }
      )

      return record
    },
    [faultIds, addTelemetryEvent]
  )

  const runBatchValidation = useCallback(() => {
    setBatchRunning(true)
    setBatchError('')

    try {
      const validation = validateAllScenarios()
      const timestamp = new Date().toISOString()

      setBatchResults(validation)
      setLastValidationTime(timestamp)

      addTelemetryEvent(
        'validation',
        'Batch scenario validation completed',
        {
          total: validation.results?.length ?? 0,
        }
      )

      return validation
    } catch (error) {
      console.error(
        'ADITI batch validation error:',
        error
      )

      const message =
        error instanceof Error
          ? error.message
          : 'Batch validation failed.'

      setBatchError(message)

      addTelemetryEvent(
        'error',
        `Validation failed: ${message}`
      )

      throw error
    } finally {
      setBatchRunning(false)
    }
  }, [addTelemetryEvent])

  const clearBatchValidation = useCallback(() => {
    setBatchResults(null)
    setBatchError('')
    setLastValidationTime(null)

    addTelemetryEvent(
      'validation',
      'Batch validation results cleared'
    )
  }, [addTelemetryEvent])

  const clearMissionHistory = useCallback(() => {
    setMissionHistory([])

    addTelemetryEvent(
      'mission',
      'Mission history cleared'
    )
  }, [addTelemetryEvent])

  // Phase L — Performance analytics
  const performanceAnalytics = useMemo(
    () =>
      calculatePerformanceAnalytics({
        batchResults,
        missionHistory,
        faultIds,
        lastValidationTime,
      }),
    [
      batchResults,
      missionHistory,
      faultIds,
      lastValidationTime,
    ]
  )

  // Phase M — Latest telemetry snapshot
  const telemetrySnapshot = useMemo(
    () =>
      createTelemetrySnapshot({
        latestResult,
        faultIds,
        performanceAnalytics,
      }),
    [
      latestResult,
      faultIds,
      performanceAnalytics,
    ]
  )

  // Phase M — Record snapshots when simulation changes
  const recordTelemetrySnapshot = useCallback(() => {
    const snapshot = createTelemetrySnapshot({
      latestResult,
      faultIds,
      performanceAnalytics,
    })

    
  // Phase M.1.5 — Automatically record telemetry changes
  useEffect(() => {
    setTelemetryHistory((previous) =>
      appendTelemetrySnapshot(
        previous,
        telemetrySnapshot
      )
    )
  }, [telemetrySnapshot])


    setTelemetryHistory((previous) =>
      appendTelemetrySnapshot(previous, snapshot)
    )

    return snapshot
  }, [latestResult, faultIds, performanceAnalytics])

  const clearTelemetryHistory = useCallback(() => {
    setTelemetryHistory([])
    setTelemetryEvents([])
  }, [])

  const value = useMemo(
    () => ({
      // Diagnostics
      faultIds,
      acknowledged,
      toggleFault,
      acknowledgeFault,
      resetFaults,

      // Mission execution
      latestResult,
      missionHistory,
      runMission,
      clearMissionHistory,

      // Batch validation
      batchResults,
      batchError,
      batchRunning,
      lastValidationTime,
      runBatchValidation,
      clearBatchValidation,

      // Performance analytics
      performanceAnalytics,

      // Phase M — Real-time telemetry
      telemetrySnapshot,
      telemetryHistory,
      telemetryEvents,
      recordTelemetrySnapshot,
      clearTelemetryHistory,
    }),
    [
      faultIds,
      acknowledged,
      toggleFault,
      acknowledgeFault,
      resetFaults,
      latestResult,
      missionHistory,
      runMission,
      clearMissionHistory,
      batchResults,
      batchError,
      batchRunning,
      lastValidationTime,
      runBatchValidation,
      clearBatchValidation,
      performanceAnalytics,
      telemetrySnapshot,
      telemetryHistory,
      telemetryEvents,
      recordTelemetrySnapshot,
      clearTelemetryHistory,
    ]
  )

  return (
    <UnifiedSystemContext.Provider value={value}>
      {children}
    </UnifiedSystemContext.Provider>
  )
}

export function useUnifiedSystem() {
  const context = useContext(UnifiedSystemContext)

  if (!context) {
    throw new Error(
      'useUnifiedSystem must be used inside UnifiedSystemProvider'
    )
  }

  return context
}
