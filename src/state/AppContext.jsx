import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [section, setSection] = useState('overview')
  const [selectedId, setSelectedId] = useState('glasses')
  const [explode, setExplode] = useState(0)
  const [inspections, setInspections] = useState({})
  const [loadStatus, setLoadStatus] = useState({})

  const recordInspect = useCallback((id, report) => {
    setInspections((prev) => (prev[id] ? prev : { ...prev, [id]: report }))
  }, [])

  const setModelStatus = useCallback((id, status) => {
    setLoadStatus((prev) => (prev[id] === status ? prev : { ...prev, [id]: status }))
  }, [])

  const value = useMemo(
    () => ({
      section,
      setSection,
      selectedId,
      setSelectedId,
      explode,
      setExplode,
      inspections,
      recordInspect,
      loadStatus,
      setModelStatus,
    }),
    [section, selectedId, explode, inspections, loadStatus, recordInspect, setModelStatus],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
