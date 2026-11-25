// Anchored to REQ-PRG-001, REQ-PRG-002, REQ-PRG-003, REQ-PRG-004, REQ-PRG-005, REQ-PRG-012
import { useState, useEffect, useMemo } from 'react'
import { fetchAlumnosProgreso, fetchReporteProgresoAlumno } from '@/services/progresoService'
import { createInitialFiltersForHistorial } from '../utils/progresoDateUtils'
import {
  filterAlumnosByEstado,
  extractCatalogosFromAlumnoData,
  filterHistorialSesiones,
  flattenSesionesToSeries,
  calcularKpisProgreso,
} from '../utils/progresoFilters'
import { exportAlumnoWorkbookToXlsx } from '../utils/excelBuilder'

export { createInitialFiltersForHistorial }

const EMPTY_FILTERS = { fechaDesde: '', fechaHasta: '', idRutina: 'all', idEjercicio: 'all' }

export function useProgresoExcel() {
  const [alumnos, setAlumnos] = useState([])
  const [includeInactivos, setIncludeInactivos] = useState(false)
  const [selectedAlumnoId, setSelectedAlumnoId] = useState(null)
  const [reporte, setReporte] = useState({ alumno: null, rutinas: [], historial: [] })
  const [draftFilters, setDraftFilters] = useState(createInitialFiltersForHistorial)
  const [appliedFilters, setAppliedFilters] = useState(createInitialFiltersForHistorial)
  const [viewMode, setViewMode] = useState('sesiones')
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [lastExportFile, setLastExportFile] = useState(null)
  const [loading, setLoading] = useState(true)

  const alumnosVisibles = useMemo(
    () => filterAlumnosByEstado(alumnos, includeInactivos),
    [alumnos, includeInactivos]
  )

  useEffect(() => {
    fetchAlumnosProgreso()
      .then((list) => {
        const safeList = list || []
        setAlumnos(safeList)
        const firstActive = safeList.find((a) => a.estado) || safeList[0]
        if (firstActive) setSelectedAlumnoId(firstActive.id_persona)
      })
      .catch(() => setAlumnos([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedAlumnoId) return
    fetchReporteProgresoAlumno(selectedAlumnoId)
      .then((data) => {
        setReporte(data)
        const defaults = createInitialFiltersForHistorial()
        setDraftFilters(defaults)
        setAppliedFilters(defaults)
      })
      .catch(() => setReporte({ alumno: null, rutinas: [], historial: [] }))
  }, [selectedAlumnoId])

  function handleToggleInactivos(checked) {
    setIncludeInactivos(checked)
    const nextList = filterAlumnosByEstado(alumnos, checked)
    if (!nextList.some((a) => a.id_persona === selectedAlumnoId) && nextList[0]) {
      setSelectedAlumnoId(nextList[0].id_persona)
    }
  }

  function handleChangeDraftFilter(field, value) {
    setDraftFilters((prev) => ({ ...prev, [field]: value }))
  }

  function handleApplyFilters() {
    setAppliedFilters(draftFilters)
  }

  function handleResetFilters() {
    setDraftFilters(EMPTY_FILTERS)
    setAppliedFilters(EMPTY_FILTERS)
  }

  const hasPendingChanges =
    draftFilters.fechaDesde !== appliedFilters.fechaDesde ||
    draftFilters.fechaHasta !== appliedFilters.fechaHasta ||
    draftFilters.idRutina !== appliedFilters.idRutina ||
    draftFilters.idEjercicio !== appliedFilters.idEjercicio

  const { rutinasDisponibles, ejerciciosDisponibles } = useMemo(
    () => extractCatalogosFromAlumnoData(reporte.rutinas, reporte.historial),
    [reporte.rutinas, reporte.historial]
  )

  const sesionesFiltradas = useMemo(
    () => filterHistorialSesiones(reporte.historial, appliedFilters),
    [reporte.historial, appliedFilters]
  )

  const seriesPlanas = useMemo(() => flattenSesionesToSeries(sesionesFiltradas), [sesionesFiltradas])
  const kpis = useMemo(() => calcularKpisProgreso(sesionesFiltradas), [sesionesFiltradas])

  function handleConfirmExport({ columnsSelection, sheetsSelection, exportOnlyFiltered }) {
    const historialToExport = exportOnlyFiltered ? sesionesFiltradas : reporte.historial
    const result = exportAlumnoWorkbookToXlsx({
      alumno: reporte.alumno,
      rutinas: reporte.rutinas,
      historial: historialToExport,
      columnsSelection,
      sheetsSelection,
    })
    setLastExportFile(result.fileName)
    setIsExportModalOpen(false)
  }

  return {
    alumnosVisibles, includeInactivos, selectedAlumnoId, setSelectedAlumnoId,
    reporte, draftFilters, appliedFilters, hasPendingChanges, viewMode, setViewMode,
    isExportModalOpen, setIsExportModalOpen, lastExportFile, loading,
    rutinasDisponibles, ejerciciosDisponibles, sesionesFiltradas, seriesPlanas, kpis,
    handleToggleInactivos, handleChangeDraftFilter, handleApplyFilters, handleResetFilters, handleConfirmExport,
  }
}
