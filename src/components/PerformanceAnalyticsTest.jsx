
import { useUnifiedSystem } from '../state/UnifiedSystemContext'

export default function PerformanceAnalyticsTest() {
  const {
    performanceAnalytics,
    runBatchValidation,
    batchError,
  } = useUnifiedSystem()

  return (
    <div
      style={{
        padding: 20,
        color: '#f5f0fa',
        background: '#120b1f',
        border: '1px solid #ff007a',
        borderRadius: 12,
      }}
    >
      <h2>ADITI / Phase L.2 Analytics Test</h2>

      <button
        type="button"
        onClick={() => {
          try {
            runBatchValidation()
          } catch (error) {
            console.error(error)
          }
        }}
        style={{
          padding: 12,
          background: '#00e7ee',
          color: '#0c0716',
          border: 0,
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Run Analytics Validation
      </button>

      {batchError && (
        <p role="alert" style={{ color: '#fb7185' }}>
          {batchError}
        </p>
      )}

      <pre
        style={{
          marginTop: 20,
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          fontSize: 12,
        }}
      >
        {JSON.stringify(performanceAnalytics, null, 2)}
      </pre>
    </div>
  )
}
