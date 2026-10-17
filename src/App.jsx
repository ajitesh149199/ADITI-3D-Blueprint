
import { useEffect, useState } from 'react'

import { AppProvider, useApp } from './state/AppContext'
import { DashboardShell } from './components/layout/DashboardShell'

import { OverviewSection } from './components/overview/OverviewSection'
import { ExplodedSection } from './components/exploded/ExplodedSection'
import { ExplorerSection } from './components/explorer/ExplorerSection'
import { ArchitectureSection } from './components/architecture/ArchitectureSection'
import { SpecsSection } from './components/specs/SpecsSection'
import PowerSection from './components/power/PowerSection'
import SimulationMonitor from './components/simulation/SimulationMonitor'

import StartupScreen from './components/common/StartupScreen'
import { preloadModel } from './models/GltfAsset'
import { modelUrl } from './models/registry'
import DiagnosticsSection from './components/sections/DiagnosticsSection'
import MissionControlSection from './components/sections/MissionControlSection'
import { UnifiedSystemProvider } from './state/UnifiedSystemContext'

// ============================================================
// STARTUP CONFIGURATION
// ============================================================

const STARTUP_DURATION = 4000
const PROGRESS_INTERVAL = 40


function Router() {
  const { section } = useApp()

  if (section === 'exploded') {
    return <ExplodedSection />
  }

  if (section === 'explorer') {
    return <ExplorerSection />
  }

  if (section === 'architecture') {
    return (
      <div
        className="aditi-architecture-page"
        style={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: '#22d3ee #070b14',
        }}
      >
        <ArchitectureSection />
      </div>
    )
  }

  if (section === 'specs') {
    return <SpecsSection />
  }

  if (section === 'simulation') {
    return (
      <div
        className="aditi-simulation-page"
        style={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px',
          boxSizing: 'border-box',
          scrollbarWidth: 'thin',
          scrollbarColor: '#22d3ee #070b14',
        }}
      >
        <SimulationMonitor />
      </div>
    )
  }

  if (section === 'power') {
    return (
      <div
        className="aditi-power-page"
        style={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: '#22d3ee #070b14',
        }}
      >
        <PowerSection />
      </div>
    )
  }

  if (section === 'diagnostics') {
    return <DiagnosticsSection />
  }

  if (section === 'mission') {
    return <MissionControlSection />
  }

  return <OverviewSection />
}


// ============================================================
// ADITI STARTUP CONTROLLER
// ============================================================

function AditiStartup() {
  const [progress, setProgress] = useState(0)
  const [animationComplete, setAnimationComplete] =
    useState(false)
  const [modelReady, setModelReady] = useState(false)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  // Fixed-duration visual progress animation
  useEffect(() => {
    const startedAt = performance.now()

    const interval = setInterval(() => {
      const elapsed = performance.now() - startedAt

      const nextProgress = Math.min(
        100,
        Math.floor(
          (elapsed / STARTUP_DURATION) * 100
        )
      )

      setProgress(nextProgress)

      if (elapsed >= STARTUP_DURATION) {
        setProgress(100)
        setAnimationComplete(true)
        clearInterval(interval)
      }
    }, PROGRESS_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  // Load the assembled-glasses model independently
  useEffect(() => {
    let cancelled = false

    async function loadModel() {
      setModelReady(false)
      setError(null)

      try {
        const url = modelUrl('glasses')

        if (!url) {
          throw new Error(
            'Assembled-glasses GLB URL is missing.'
          )
        }

        await preloadModel(url)

        if (!cancelled) {
          setModelReady(true)
        }
      } catch (loadingError) {
        if (!cancelled) {
          setError(
            loadingError instanceof Error
              ? loadingError
              : new Error('Failed to load 3D model.')
          )
        }
      }
    }

    loadModel()

    return () => {
      cancelled = true
    }
  }, [attempt])

  const ready =
    animationComplete && modelReady && !error

  const status = error
    ? 'MODEL LOADING FAILED'
    : animationComplete && !modelReady
      ? 'WAITING FOR 3D ASSETS'
      : ready
        ? 'ADITI READY'
        : 'INITIALIZING ADITI'

  function retryLoading() {
    setAttempt((previous) => previous + 1)
  }

  if (!ready) {
    return (
      <StartupScreen
        progress={progress}
        status={status}
        ready={false}
        error={error}
        onRetry={retryLoading}
      />
    )
  }

  return (
    <DashboardShell>
      <Router />
    </DashboardShell>
  )
}

// ============================================================
// APPLICATION ROOT
// ============================================================

export default function App() {
  return (
    <AppProvider>
      <UnifiedSystemProvider>
        <AditiStartup />
      </UnifiedSystemProvider>
    </AppProvider>
  )
}
