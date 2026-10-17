import { COMPONENTS, MODEL_FILES } from '../../models/registry'
import { CALIBRATION_NOTES } from '../../models/placement'
import { useApp } from '../../state/AppContext'

export function SpecsSection() {
  const { inspections } = useApp()

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2>Technical specifications</h2>
          <p>
            Component purpose, source file, and measured runtime bounds after a model has been
            opened in Overview, Exploded View, or Explorer.
          </p>
        </div>
      </div>
      <div className="specs-grid">
        <div className="card full">
          <table className="table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Role</th>
                <th>Source GLB</th>
                <th>Runtime notes</th>
              </tr>
            </thead>
            <tbody>
              {COMPONENTS.map((item) => {
                const file = MODEL_FILES[item.fileId]
                const report = inspections[item.id]
                return (
                  <tr key={item.id}>
                    <td>
                      <b>{item.name}</b>
                      <div>
                        <span className="label-chip">{item.category}</span>
                      </div>
                    </td>
                    <td>{item.role}</td>
                    <td>{file}</td>
                    <td>
                      {report ? (
                        <>
                          {report.meshCount} meshes · max dim {report.maxDim.toFixed(3)}
                          {report.unnamedMeshes > 0
                            ? ` · ${report.unnamedMeshes} unnamed (parent label retained)`
                            : ''}
                        </>
                      ) : (
                        'Not inspected in this session'
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="card wide">
          <h3>Hardware roles</h3>
          <ul>
            <li>Raspberry Pi Zero 2 W — Edge computing</li>
            <li>Camera Module 3 — Visual perception</li>
            <li>IMU — Motion sensing</li>
            <li>GNSS M10 — Outdoor positioning</li>
            <li>VL53L1X — Distance measurement</li>
            <li>Microphone — Audio input</li>
            <li>Audio amplifier — Sound output</li>
            <li>Bone-conduction transducer — Spoken feedback</li>
            <li>Haptic actuator — Vibration feedback</li>
            <li>Haptic driver — Haptic control</li>
            <li>Power system — Power delivery</li>
            <li>Buttons and indicators — User controls</li>
          </ul>
        </div>
        <div className="card">
          <h3>Calibration still required</h3>
          <ul>
            {CALIBRATION_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
