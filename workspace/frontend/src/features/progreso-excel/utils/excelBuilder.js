// Anchored to REQ-PRG-008, REQ-PRG-009, REQ-PRG-010, REQ-PRG-011, REQ-PRG-012
import * as XLSX from 'xlsx'
import {
  createDefaultColumnsSelection,
  createDefaultSheetsSelection,
} from './excelColumnsConfig'
import {
  calculateEdadFromBirthDate,
  buildFichaSheetRows,
  buildRutinasSheetRows,
  buildHistorialSheetRows,
} from './excelRowProjectors'

export {
  calculateEdadFromBirthDate,
  buildFichaSheetRows,
  buildRutinasSheetRows,
  buildHistorialSheetRows,
}

export function buildExcelFileName(alumno, dateIso = new Date().toISOString().slice(0, 10)) {
  const rawName = alumno ? `${alumno.nombre || ''}_${alumno.apellido || ''}` : 'Alumno'
  const cleanName = rawName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
  return `Pirro_Alumno_${cleanName || 'Reporte'}_${dateIso}.xlsx`
}

export function buildAlumnoWorkbook({ alumno, rutinas, historial, columnsSelection, sheetsSelection }) {
  const selection = columnsSelection || createDefaultColumnsSelection()
  const activeSheets = sheetsSelection || createDefaultSheetsSelection()
  const wb = XLSX.utils.book_new()

  if (activeSheets.ficha !== false) {
    const rows = buildFichaSheetRows(alumno, selection.ficha)
    const ws = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ Info: 'Sin datos de ficha' }])
    XLSX.utils.book_append_sheet(wb, ws, 'Ficha del Alumno')
  }

  if (activeSheets.rutinas !== false) {
    const rows = buildRutinasSheetRows(rutinas, selection.rutinas)
    const ws = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ Info: 'Sin rutinas activas registradas' }])
    XLSX.utils.book_append_sheet(wb, ws, 'Rutinas Semanales')
  }

  if (activeSheets.historial !== false) {
    const rows = buildHistorialSheetRows(historial, selection.historial)
    const ws = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ Info: 'Sin entrenamientos registrados' }])
    XLSX.utils.book_append_sheet(wb, ws, 'Historial de Entrenamientos')
  }

  return wb
}

export function exportAlumnoWorkbookToXlsx({
  alumno,
  rutinas,
  historial,
  columnsSelection,
  sheetsSelection,
  dateIso,
  writer = XLSX.writeFile,
}) {
  const wb = buildAlumnoWorkbook({ alumno, rutinas, historial, columnsSelection, sheetsSelection })
  const fileName = buildExcelFileName(alumno, dateIso)
  if (typeof window !== 'undefined' && !import.meta.env?.VITEST) {
    writer(wb, fileName)
  }
  return { ok: true, fileName, sheetNames: wb.SheetNames, workbook: wb }
}
