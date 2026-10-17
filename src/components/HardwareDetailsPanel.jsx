
import { useState } from 'react'
import { HARDWARE_SPECIFICATIONS } from '../data/hardwareSpecifications'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'technical', label: 'Technical' },
  { id: 'connections', label: 'Connections' },
  { id: 'inventory', label: 'Inventory' },
]

function InfoRow({ label, value }) {
  return (
    <div className="stat-row" style={{ gap: 12 }}>
      <span>{label}</span>
      <b style={{ textAlign: 'right', overflowWrap: 'anywhere' }}>
        {value || 'Not specified'}
      </b>
    </div>
  )
}

export function HardwareDetailsPanel({
  hardwareKey,
  details,
  position,
  panelRef,
  onClose,
  onFocus,
}) {
  const [tab, setTab] = useState('overview')
  const specification = HARDWARE_SPECIFICATIONS[hardwareKey]

  if (!details || !specification) return null

  return (
    <div
      ref={panelRef}
      className="glass-panel"
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        width: 'min(350px, 55%)',
        maxHeight: 'calc(100% - 32px)',
        overflowY: 'auto',
        zIndex: 20,
        padding: 14,
        background: 'rgba(10, 10, 25, 0.96)',
        border: `1px solid ${details.color}`,
        borderRadius: 12,
        boxShadow: `0 0 20px ${details.color}33`,
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <div>
          <div className="kicker">HARDWARE INFORMATION</div>
          <h3 style={{ margin: '8px 0', color: details.color }}>
            {details.name}
          </h3>
        </div>

        <button
          className="btn"
          type="button"
          onClick={onClose}
          aria-label="Close hardware information"
        >
          ×
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, margin: '12px 0' }}>
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`btn ${tab === item.id ? 'primary' : ''}`}
            onClick={() => setTab(item.id)}
            style={{ fontSize: 11, padding: '6px 8px' }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <p style={{ lineHeight: 1.6 }}>{details.description}</p>
          <InfoRow label="Function" value={specification.role} />
          <InfoRow label="System type" value={specification.type} />
          <InfoRow label="Category" value={details.category} />
          <InfoRow label="Component ID" value={hardwareKey} />
          <InfoRow label="3D placement" value="Calibrated" />
          <InfoRow
            label="Coordinates"
            value={Array.isArray(position) ? position.join(', ') : 'Unknown'}
          />
        </>
      )}

      {tab === 'technical' && (
        <>
          <InfoRow label="Interface" value={specification.interface} />
          <InfoRow label="Voltage" value={specification.voltage} />
          <InfoRow label="Estimated power" value={specification.estimatedPower} />
          <p style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.5 }}>
            Power figures are preliminary planning estimates. They are not
            measured values or a validated total system power budget.
          </p>
        </>
      )}

      {tab === 'connections' && (
        <>
          <h4>Proposed connections</h4>
          <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
            {specification.connections.map((connection) => (
              <li key={connection}>{connection}</li>
            ))}
          </ul>

          <h4>Dependencies</h4>
          <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
            {specification.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </>
      )}

      {tab === 'inventory' && (
        <>
          <InfoRow label="Implementation status" value={specification.status} />
          <InfoRow label="Specification status" value="Provisional" />
          <InfoRow label="Physical validation" value="Pending" />
          <h4>Design notes</h4>
          <p style={{ fontSize: 12, lineHeight: 1.7 }}>
            {specification.notes}
          </p>
        </>
      )}

      <button
        className="btn primary"
        type="button"
        onClick={onFocus}
        style={{ width: '100%', marginTop: 14 }}
      >
        ◎ Focus on Component
      </button>

      <p style={{ fontSize: 11, opacity: 0.65, marginBottom: 0 }}>
        ADITI conceptual blueprint · Hardware selection is not yet finalized.
      </p>
    </div>
  )
}
