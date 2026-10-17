
import { useSimulation } from '../../state/SimulationContext'
import './LiveSensorReadings.css'

const SENSOR_NAMES = {
  camera: 'Camera',
  imu: 'IMU',
  gps: 'GPS',
  microphone: 'Microphone',
  distance: 'Distance',
}

function formatNumber(value, digits = 2) {
  return typeof value === 'number'
    ? value.toFixed(digits)
    : '—'
}

function SensorValues({ sensorName, data }) {
  if (!data) {
    return (
      <p className="aditi-live-placeholder">
        Waiting for simulated readings...
      </p>
    )
  }

  switch (sensorName) {
    case 'camera':
      return (
        <>
          <p>Object: <strong>{data.detectedObject}</strong></p>
          <p>Confidence: <strong>{formatNumber(data.confidence * 100, 1)}%</strong></p>
          <p>Distance: <strong>{formatNumber(data.distance)} m</strong></p>
        </>
      )

    case 'imu':
      return (
        <>
          <p>Movement: <strong>{data.movement}</strong></p>
          <p>
            Acceleration:
            <strong>
              {' '}
              X {formatNumber(data.acceleration?.x)} /
              Y {formatNumber(data.acceleration?.y)} /
              Z {formatNumber(data.acceleration?.z)}
            </strong>
          </p>
          <p>
            Angular velocity:
            <strong>
              {' '}
              X {formatNumber(data.angularVelocity?.x)} /
              Y {formatNumber(data.angularVelocity?.y)} /
              Z {formatNumber(data.angularVelocity?.z)}
            </strong>
          </p>
        </>
      )

    case 'gps':
      return (
        <>
          <p>Latitude: <strong>{formatNumber(data.latitude, 6)}</strong></p>
          <p>Longitude: <strong>{formatNumber(data.longitude, 6)}</strong></p>
          <p>Speed: <strong>{formatNumber(data.speed)} m/s</strong></p>
        </>
      )

    case 'microphone':
      return (
        <>
          <p>Sound: <strong>{data.detectedSound}</strong></p>
          <p>Level: <strong>{formatNumber(data.soundLevel)} dB</strong></p>
        </>
      )

    case 'distance':
      return (
        <>
          <p>Distance: <strong>{formatNumber(data.distance)} m</strong></p>
          <p>Proximity: <strong>{data.proximity}</strong></p>
        </>
      )

    default:
      return null
  }
}

export default function LiveSensorReadings() {
  const { isRunning, sensors, sensorData } = useSimulation()

  return (
    <section className="aditi-live-panel">
      <div className="aditi-live-heading">
        <div>
          <span>05 / LIVE SENSOR TELEMETRY</span>
          <h2>Simulated Sensor Readings</h2>
        </div>
        <span className="aditi-live-mode">
          {isRunning ? '● STREAMING' : '○ PAUSED'}
        </span>
      </div>

      <div className="aditi-live-grid">
        {Object.entries(sensors).map(([sensorName, enabled]) => {
          const data = sensorData[sensorName]
          const active = isRunning && enabled

          return (
            <article
              key={sensorName}
              className={`aditi-live-card ${active ? 'is-online' : ''}`}
            >
              <div className="aditi-live-card-heading">
                <h3>{SENSOR_NAMES[sensorName] ?? sensorName}</h3>
                <span>{active ? 'ONLINE' : 'OFFLINE'}</span>
              </div>

              {active ? (
                <div className="aditi-live-values">
                  <SensorValues sensorName={sensorName} data={data} />
                </div>
              ) : (
                <p className="aditi-live-placeholder">
                  {enabled
                    ? 'Simulation paused'
                    : 'Sensor disabled'}
                </p>
              )}

              <div className="aditi-live-footer">
                {active && data?.timestamp
                  ? `Updated: ${new Date(data.timestamp).toLocaleTimeString()}`
                  : 'No active data stream'}
              </div>
            </article>
          )
        })}
      </div>

      <p className="aditi-live-note">
        Demonstration telemetry generated in software. No physical
        sensors are connected.
      </p>
    </section>
  )
}
