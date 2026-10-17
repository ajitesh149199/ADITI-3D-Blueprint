
import { useEffect, useState } from 'react'
import './HolographicStartup.css'

const STARTUP_MESSAGES = [
  'INITIALIZING ADITI CORE',
  'LOADING SENSOR ARCHITECTURE',
  'ESTABLISHING DECISION PIPELINE',
  'PREPARING HARDWARE BLUEPRINT',
  'ACTIVATING PRESENTATION INTERFACE',
]

export default function HolographicStartup({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    let startTime = null
    let frameId

    const duration = 3200

    function animate(timestamp) {
      if (startTime === null) startTime = timestamp

      const elapsed = timestamp - startTime
      const nextProgress = Math.min(
        100,
        Math.round((elapsed / duration) * 100)
      )

      setProgress(nextProgress)

      setMessageIndex(
        Math.min(
          STARTUP_MESSAGES.length - 1,
          Math.floor(
            (nextProgress / 100) * STARTUP_MESSAGES.length
          )
        )
      )

      if (elapsed < duration) {
        frameId = requestAnimationFrame(animate)
      } else {
        onComplete?.()
      }
    }

    frameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameId)
  }, [onComplete])

  return (
    <div className="aditi-startup">
      <div className="aditi-startup-grid" />

      <div className="aditi-startup-core">
        <div className="aditi-ring aditi-ring-outer" />
        <div className="aditi-ring aditi-ring-middle" />
        <div className="aditi-ring aditi-ring-inner" />

        <div className="aditi-core-center">
          <span className="aditi-core-symbol">A</span>
        </div>
      </div>

      <div className="aditi-startup-info">
        <div className="aditi-startup-label">
          ARTIFICIALLY DRIVEN DATA,
          INFORMATION AND TECH INTEGRATION
        </div>

        <h1>ADITI</h1>

        <p>{STARTUP_MESSAGES[messageIndex]}</p>

        <div className="aditi-progress-track">
          <div
            className="aditi-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="aditi-progress-value">
          SYSTEM INITIALIZATION {progress}%
        </div>
      </div>
    </div>
  )
}
