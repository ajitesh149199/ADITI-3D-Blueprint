
import { useEffect, useRef, useState } from 'react'

import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { lazy, Suspense } from 'react'
import { useApp } from '../../state/AppContext'

const FinalPresentationMode = lazy(
  () => import('../presentation/FinalPresentationMode')
)

export function DashboardShell({ children }) {
  const appRef = useRef(null)
  const workspaceRef = useRef(null)

  const [presentationMode, setPresentationMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [fullscreenError, setFullscreenError] = useState('')
  const [finalPresentationOpen, setFinalPresentationOpen] =
  useState(false)
  const { setSection } = useApp()

  const [pendingDashboard, setPendingDashboard] = useState(null)

  useEffect(() => {
    function handleFullscreenChange() {
      const isFullscreen =
        document.fullscreenElement === appRef.current

      setPresentationMode(isFullscreen)
      setMobileMenuOpen(false)
    }

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange
    )

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      )
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  
useEffect(() => {
  if (!pendingDashboard || finalPresentationOpen) {
    return
  }

  // Wait until the presentation overlay has been
  // removed and the browser has painted the dashboard.
  let frame1
  let frame2

  frame1 = requestAnimationFrame(() => {
    frame2 = requestAnimationFrame(() => {
      setSection(pendingDashboard)
      setPendingDashboard(null)
    })
  })

  return () => {
    cancelAnimationFrame(frame1)
    cancelAnimationFrame(frame2)
  }
}, [pendingDashboard, finalPresentationOpen, setSection])


  async function togglePresentationMode() {
    setFullscreenError('')
    setMobileMenuOpen(false)

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await appRef.current?.requestFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
      setFullscreenError('Fullscreen was blocked. Try again.')
    }
  }

  return (
    <div
      ref={appRef}
      className={[
        'app',
        presentationMode ? 'aditi-presentation-mode' : '',
        mobileMenuOpen ? 'mobile-menu-open' : '',
      ].filter(Boolean).join(' ')}
      style={
        presentationMode
          ? {
              display: 'block',
              width: '100%',
              height: '100dvh',
              overflow: 'hidden',
              background: '#0c0716',
            }
          : undefined
      }
    >
      {!presentationMode && (
        <TopBar
          mobileMenuOpen={mobileMenuOpen}
          onToggleMenu={() =>
            setMobileMenuOpen((previous) => !previous)
          }
        />
      )}

      {!presentationMode && (
        <Sidebar
          onNavigate={() => setMobileMenuOpen(false)}
        />
      )}

      {mobileMenuOpen && !presentationMode && (
        <button
          type="button"
          className="mobile-menu-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main
        ref={workspaceRef}
        className="workspace"
        style={
          presentationMode
            ? {
                width: '100%',
                height: '100%',
                minHeight: 0,
                margin: 0,
                padding: 0,
                overflow: 'hidden',
              }
            : {
                minHeight: 0,
                minWidth: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                overscrollBehaviorY: 'contain',
                scrollbarWidth: 'thin',
                scrollbarColor:
                  '#ff007a rgba(18,11,31,0.6)',
              }
        }
      >
        {!finalPresentationOpen && children}
      </main>

    {!finalPresentationOpen && (

      <button
        type="button"
        onClick={togglePresentationMode}
        aria-label={
          presentationMode
            ? 'Exit presentation mode'
            : 'Enter fullscreen presentation mode'
        }
        style={{
          position: 'fixed',
          bottom: presentationMode ? 20 : 22,
          left: presentationMode ? 20 : 310,
          zIndex: 100,
          padding: '10px 15px',
          borderRadius: 10,
          border: '1px solid rgba(255,0,122,0.5)',
          background: 'rgba(12,7,22,0.95)',
          color: '#ff007a',
          fontSize: 12,
          fontFamily: 'Space Mono, monospace',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        {presentationMode
          ? '↙ Exit Fullscreen'
          : '⛶ Fullscreen Presentation'}
      </button>

    )}

      {fullscreenError && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            bottom: 75,
            left: 20,
            zIndex: 101,
            padding: 12,
            background: '#291020',
            color: '#ff80ad',
            borderRadius: 8,
            fontSize: 12,
          }}
        >
          {fullscreenError}
        </div>
      )}

      {!finalPresentationOpen && (
  <button
    type="button"
    onClick={() => setFinalPresentationOpen(true)}
    style={{
      position: 'fixed',
      right: 20,
      bottom: 22,
      zIndex: 110,
      borderRadius: 10,
      padding: '11px 15px',
      border: '1px solid rgba(0,231,238,0.5)',
      background: '#0c0716',
      color: '#00e7ee',
      fontFamily: 'Space Mono, monospace',
      fontSize: 12,
      cursor: 'pointer',
    }}
  >
    ▶ Final Presentation
  </button>
)}

{finalPresentationOpen && (
  <Suspense fallback={null}>
    <FinalPresentationMode
  onClose={() => setFinalPresentationOpen(false)}
  onLaunchDashboard={(destination) => {
    setPendingDashboard(destination)
    setFinalPresentationOpen(false)
  }}
/>
  </Suspense>
)}
    </div>
  )
}
