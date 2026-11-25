// Anchored to REQ-PRG-001, REQ-PRG-002, REQ-PRG-004, REQ-PRG-006, REQ-PRG-007, REQ-PRG-009, REQ-PRG-012
import { useProgresoExcel } from '../hooks/useProgresoExcel'
import { ProgresoPageHeader, ProgresoEmptyState } from './ProgresoPageHeader'
import { ProgresoAlumnoSelector } from './ProgresoAlumnoSelector'
import { ProgresoFiltersBar } from './ProgresoFiltersBar'
import { ProgresoKpiCards } from './ProgresoKpiCards'
import { ProgresoSesionesView } from './ProgresoSesionesView'
import { ProgresoTablaSeriesView } from './ProgresoTablaSeriesView'
import { ExcelExportModal } from './ExcelExportModal'
import { VStack } from '@/components/ui/VStack'

export function ProgresoExcelPage() {
  const {
    alumnosVisibles, includeInactivos, selectedAlumnoId, setSelectedAlumnoId,
    reporte, draftFilters, appliedFilters, hasPendingChanges, viewMode, setViewMode,
    isExportModalOpen, setIsExportModalOpen, lastExportFile, loading,
    rutinasDisponibles, ejerciciosDisponibles, sesionesFiltradas, seriesPlanas, kpis,
    handleToggleInactivos, handleChangeDraftFilter, handleApplyFilters, handleResetFilters, handleConfirmExport,
  } = useProgresoExcel()

  if (loading) {
    return (
      <VStack align="center" justify="center" className="py-12 gap-3">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-xs text-muted-foreground">Cargando módulo de progreso...</span>
      </VStack>
    )
  }

  return (
    <VStack className="gap-4 pb-12">
      <ProgresoPageHeader
        canExport={Boolean(reporte.alumno)}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {lastExportFile && (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-400"
        >
          Archivo generado correctamente: <span className="font-mono">{lastExportFile}</span>
        </div>
      )}

      <ProgresoAlumnoSelector
        alumnos={alumnosVisibles}
        selectedAlumnoId={selectedAlumnoId}
        onSelectAlumno={setSelectedAlumnoId}
        includeInactivos={includeInactivos}
        onToggleInactivos={handleToggleInactivos}
        alumnoActual={reporte.alumno}
      />

      <ProgresoFiltersBar
        draftFilters={draftFilters}
        onChangeDraftFilter={handleChangeDraftFilter}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        hasPendingChanges={hasPendingChanges}
        rutinasDisponibles={rutinasDisponibles}
        ejerciciosDisponibles={ejerciciosDisponibles}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      />

      <ProgresoKpiCards kpis={kpis} />

      {sesionesFiltradas.length === 0 ? (
        <ProgresoEmptyState />
      ) : viewMode === 'sesiones' ? (
        <ProgresoSesionesView sesionesFiltradas={sesionesFiltradas} />
      ) : (
        <ProgresoTablaSeriesView seriesPlanas={seriesPlanas} />
      )}

      <ExcelExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        alumno={reporte.alumno}
        onConfirmExport={handleConfirmExport}
        hasActiveFilters={
          Boolean(appliedFilters.fechaDesde) ||
          Boolean(appliedFilters.fechaHasta) ||
          appliedFilters.idRutina !== 'all' ||
          appliedFilters.idEjercicio !== 'all'
        }
      />
    </VStack>
  )
}
