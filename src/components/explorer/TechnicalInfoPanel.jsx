
import { useState } from 'react'
import { CATEGORY_META } from '../../models/registry'
import { namedMeshes } from '../../models/inspectScene'

// ==================================================
// Formatting Helpers
// ==================================================

function formatMeasurement(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '—'
  }

  if (value === 0) return '0'

  if (Math.abs(value) < 0.0001) {
    return value.toExponential(3)
  }

  return Number(value.toPrecision(5)).toString()
}

// ==================================================
// Technical Information Panel
// ==================================================

export function TechnicalInfoPanel({ spec, report }) {
  const [showMeshes, setShowMeshes] = useState(false)
  const [showGroupedParts, setShowGroupedParts] = useState(true)
  const [measurementMode, setMeasurementMode] = useState('display')
  const [showMeasurements, setShowMeasurements] = useState(true)

  if (!spec) return null

  const category = CATEGORY_META[spec.category]

  const allNamedMeshes = report ? namedMeshes(report) : []
  const meshes = allNamedMeshes.slice(0, 40)

  const groupedParts = Array.isArray(spec.groupedParts)
    ? spec.groupedParts
    : []

  const hasGroupedParts =
    spec.grouped === true && groupedParts.length > 0

  // Measurements calculated by GltfAsset.jsx
  const geometry = report?.geometryMeasurements ?? null

  const dimensions = geometry
    ? measurementMode === 'source'
      ? geometry.source
      : geometry.display
    : null

  // ==================================================
  // Shared Styles
  // ==================================================

  const panelStyle = {
    background: 'rgba(5,12,24,0.94)',
    border: '1px solid rgba(103,232,249,0.22)',
    borderRadius: 12,
    padding: 15,
    color: '#e2e8f0',
  }

  const labelStyle = {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  }

  const sectionStyle = {
    borderTop: '1px solid rgba(103,232,249,0.15)',
    marginTop: 14,
    paddingTop: 14,
  }

  const cardStyle = {
    padding: 10,
    borderRadius: 8,
    background: 'rgba(15,23,42,0.8)',
    border: '1px solid rgba(103,232,249,0.12)',
  }

  const toggleStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    textAlign: 'left',
    background: 'transparent',
    border: 'none',
    color: '#67e8f9',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
  }

  // ==================================================
  // Main UI
  // ==================================================

  return (
    <div style={panelStyle}>
      {/* COMPONENT HEADER */}

      <div
        style={{
          fontSize: 10,
          color: '#67e8f9',
          letterSpacing: 1.4,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        ADITI / COMPONENT INSPECTOR
      </div>

      <h3
        style={{
          margin: '0 0 8px',
          fontSize: 17,
          lineHeight: 1.3,
        }}
      >
        {spec.name}
      </h3>

      <span
        style={{
          display: 'inline-block',
          padding: '5px 9px',
          borderRadius: 6,
          fontSize: 10,
          fontWeight: 700,
          color: category?.color ?? '#67e8f9',
          border: `1px solid ${
            category?.color ?? '#67e8f9'
          }55`,
          background: 'rgba(103,232,249,0.07)',
        }}
      >
        {category?.label ?? spec.category}
      </span>

      {/* HARDWARE IDENTIFICATION */}

      <div style={sectionStyle}>
        <div style={labelStyle}>
          Hardware Identification
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            marginTop: 10,
          }}
        >
          {[
            ['Hardware ID', spec.hardwareId ?? '—'],
            ['System Role', spec.systemRole ?? spec.role],
          ].map(([label, value]) => (
            <div key={label} style={cardStyle}>
              <div style={labelStyle}>{label}</div>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: 1.5,
                  overflowWrap: 'anywhere',
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FUNCTIONAL OVERVIEW */}

      <div style={sectionStyle}>
        <div style={labelStyle}>
          Functional Overview
        </div>

        <p
          style={{
            fontSize: 12,
            lineHeight: 1.7,
            color: '#cbd5e1',
            margin: '8px 0',
          }}
        >
          {spec.details}
        </p>
      </div>

      {/* ADITI SYSTEM FUNCTIONS */}

      <div style={sectionStyle}>
        <div style={labelStyle}>
          ADITI System Functions
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginTop: 10,
          }}
        >
          {(spec.functions ?? []).length > 0 ? (
            spec.functions.map((item, index) => (
              <div
                key={`${spec.id}-function-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 9,
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: '#cbd5e1',
                }}
              >
                <span
                  style={{
                    color: '#22d3ee',
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>

                <span>{item}</span>
              </div>
            ))
          ) : (
            <p style={{ fontSize: 12, color: '#94a3b8' }}>
              No system functions documented.
            </p>
          )}
        </div>
      </div>

      {/* GROUPED HARDWARE BREAKDOWN */}

      {hasGroupedParts && (
        <div style={sectionStyle}>
          <button
            type="button"
            onClick={() =>
              setShowGroupedParts((previous) => !previous)
            }
            aria-expanded={showGroupedParts}
            style={toggleStyle}
          >
            <span>
              {showGroupedParts ? '▼' : '▶'}{' '}
              Grouped Hardware Breakdown
            </span>

            <span
              style={{
                padding: '4px 7px',
                borderRadius: 6,
                background: 'rgba(34,211,238,0.12)',
                border:
                  '1px solid rgba(34,211,238,0.25)',
                fontSize: 10,
                whiteSpace: 'nowrap',
              }}
            >
              {groupedParts.length}{' '}
              {groupedParts.length === 1 ? 'part' : 'parts'}
            </span>
          </button>

          {showGroupedParts && (
            <div
              style={{
                marginTop: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {groupedParts.map((part, index) => (
                <div
                  key={part.id ?? index}
                  style={{
                    ...cardStyle,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 27,
                      height: 27,
                      flexShrink: 0,
                      borderRadius: 7,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(34,211,238,0.12)',
                      border:
                        '1px solid rgba(34,211,238,0.3)',
                      color: '#67e8f9',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#e2e8f0',
                        lineHeight: 1.5,
                      }}
                    >
                      {part.name}
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        color: '#94a3b8',
                        marginTop: 3,
                        lineHeight: 1.5,
                      }}
                    >
                      {part.role}
                    </div>
                  </div>
                </div>
              ))}

              <div
                style={{
                  padding: '9px 10px',
                  borderRadius: 8,
                  background: 'rgba(34,211,238,0.05)',
                  border:
                    '1px dashed rgba(103,232,249,0.2)',
                  color: '#94a3b8',
                  fontSize: 10,
                  lineHeight: 1.6,
                }}
              >
                These parts are defined in the ADITI
                hardware registry. Their identities
                are not automatically verified
                against individual GLB meshes.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================
          NEW: 3D GEOMETRY MEASUREMENTS
      ============================================ */}

      <div style={sectionStyle}>
        <button
          type="button"
          onClick={() =>
            setShowMeasurements((previous) => !previous)
          }
          aria-expanded={showMeasurements}
          style={toggleStyle}
        >
          <span>
            {showMeasurements ? '▼' : '▶'}{' '}
            3D Geometry Measurements
          </span>
        </button>

        {showMeasurements && (
          <div style={{ marginTop: 12 }}>
            {geometry && dimensions ? (
              <>
                {/* Measurement Mode Selector */}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 7,
                    marginBottom: 12,
                  }}
                >
                  {[
                    {
                      id: 'display',
                      label: 'Display Geometry',
                    },
                    {
                      id: 'source',
                      label: 'Source Geometry',
                    },
                  ].map((mode) => {
                    const active =
                      measurementMode === mode.id

                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() =>
                          setMeasurementMode(mode.id)
                        }
                        aria-pressed={active}
                        style={{
                          padding: '9px 6px',
                          borderRadius: 7,
                          border: active
                            ? '1px solid #22d3ee'
                            : '1px solid rgba(103,232,249,0.2)',
                          background: active
                            ? 'rgba(34,211,238,0.16)'
                            : 'rgba(15,23,42,0.7)',
                          color: active
                            ? '#67e8f9'
                            : '#94a3b8',
                          fontSize: 10,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {mode.label}
                      </button>
                    )
                  })}
                </div>

                {/* Measurement Cards */}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                  }}
                >
                  {[
                    ['Width (X)', dimensions.width],
                    ['Height (Y)', dimensions.height],
                    ['Depth (Z)', dimensions.depth],
                    ['Bounding Volume', dimensions.volume],
                  ].map(([label, value]) => (
                    <div key={label} style={cardStyle}>
                      <div style={labelStyle}>
                        {label}
                      </div>

                      <div
                        style={{
                          color: '#67e8f9',
                          fontSize: 17,
                          fontWeight: 700,
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {formatMeasurement(value)}
                      </div>

                      <div
                        style={{
                          fontSize: 10,
                          color: '#64748b',
                          marginTop: 4,
                        }}
                      >
                        {label === 'Bounding Volume'
                          ? 'model units³'
                          : 'model units'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scale Factor */}

                <div
                  style={{
                    ...cardStyle,
                    marginTop: 9,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: '#94a3b8',
                    }}
                  >
                    Display Scale Factor
                  </span>

                  <strong
                    style={{
                      color: '#67e8f9',
                      fontSize: 12,
                    }}
                  >
                    {formatMeasurement(
                      geometry.scaleFactor
                    )}
                    ×
                  </strong>
                </div>

                {/* Measurement Notice */}

                <div
                  style={{
                    marginTop: 10,
                    padding: '9px 10px',
                    borderRadius: 8,
                    background: 'rgba(34,211,238,0.05)',
                    border:
                      '1px dashed rgba(103,232,249,0.2)',
                    color: '#94a3b8',
                    fontSize: 10,
                    lineHeight: 1.6,
                  }}
                >
                  {measurementMode === 'display'
                    ? 'These dimensions describe the normalized 3D model used in the ADITI viewer.'
                    : 'These dimensions describe the original GLB geometry before viewer normalization.'}
                  {' '}Bounding volume is the volume of
                  the enclosing box, not the actual
                  solid volume of the hardware.
                  Physical units such as millimeters
                  have not been verified.
                </div>
              </>
            ) : (
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: 12,
                  lineHeight: 1.6,
                }}
              >
                Geometry measurements are not
                available yet. Reload the model
                to generate its inspection report.
              </p>
            )}
          </div>
        )}
      </div>

      {/* LIVE 3D MODEL INSPECTION */}

      <div style={sectionStyle}>
        <div style={labelStyle}>
          Live 3D Model Inspection
        </div>

        {report ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 7,
              marginTop: 10,
            }}
          >
            {[
              ['Meshes', report.meshCount],
              ['Nodes', report.nodeCount],
              ['Unnamed', report.unnamedMeshes],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  textAlign: 'center',
                  padding: '10px 5px',
                  background: 'rgba(15,23,42,0.8)',
                  borderRadius: 8,
                  border:
                    '1px solid rgba(103,232,249,0.12)',
                }}
              >
                <div
                  style={{
                    color: '#67e8f9',
                    fontSize: 19,
                    fontWeight: 700,
                  }}
                >
                  {value ?? '—'}
                </div>

                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: 10,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p
            style={{
              color: '#94a3b8',
              fontSize: 12,
            }}
          >
            Inspecting model after load…
          </p>
        )}
      </div>

      {/* MESH HIERARCHY */}

      {report && (
        <div style={sectionStyle}>
          <button
            type="button"
            onClick={() =>
              setShowMeshes((previous) => !previous)
            }
            aria-expanded={showMeshes}
            style={toggleStyle}
          >
            <span>
              {showMeshes ? '▼' : '▶'}{' '}
              Mesh Hierarchy
            </span>

            <span
              style={{
                color: '#94a3b8',
                fontSize: 10,
                fontWeight: 500,
              }}
            >
              {meshes.length}
              {allNamedMeshes.length > meshes.length
                ? ` / ${allNamedMeshes.length}`
                : ''}{' '}
              named
            </span>
          </button>

          {showMeshes && (
            <div
              style={{
                marginTop: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                maxHeight: 180,
                overflowY: 'auto',
                fontSize: 11,
                color: '#94a3b8',
              }}
            >
              {meshes.length > 0 ? (
                meshes.map((mesh, index) => (
                  <div
                    key={mesh.uuid ?? index}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 5,
                      background:
                        'rgba(15,23,42,0.5)',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    mesh · {mesh.name}
                  </div>
                ))
              ) : (
                <div>
                  No reliable named meshes found.
                  The parent component label is retained.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
