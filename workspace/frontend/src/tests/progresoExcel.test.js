// Anchored to REQ-PRG-001, REQ-PRG-004, REQ-PRG-005, REQ-PRG-008, REQ-PRG-009, REQ-PRG-010, REQ-PRG-011
import { describe, expect, test, beforeEach } from 'vitest'
import * as XLSX from 'xlsx'
import { mockAdapter } from '@/services/adapters/mockAdapter'
import { fetchReporteProgresoAlumno } from '@/services/progresoService'
import {
  filterAlumnosByEstado,
  filterHistorialSesiones,
  flattenSesionesToSeries,
  calcularKpisProgreso,
} from '@/features/progreso-excel/utils/progresoFilters'
import {
  buildFichaSheetRows,
  buildRutinasSheetRows,
  buildHistorialSheetRows,
  buildAlumnoWorkbook,
  buildExcelFileName,
} from '@/features/progreso-excel/utils/excelBuilder'

describe('progresoService & excelBuilder (Unit & Contract)', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockAdapter.resetMockDatabase()
  })

  test('REQ-PRG-001: fetchReporteProgresoAlumno devuelve ficha, rutinas e historial del alumno', async () => {
    const reporte = await fetchReporteProgresoAlumno(2)
    expect(reporte.alumno).not.toBeNull()
    expect(reporte.alumno.nombre_completo).toBe('Martín Gómez')
    expect(Array.isArray(reporte.rutinas)).toBe(true)
    expect(reporte.rutinas.length).toBeGreaterThan(0)
    expect(Array.isArray(reporte.historial)).toBe(true)
    expect(reporte.historial.length).toBeGreaterThan(0)
  })

  test('REQ-PRG-002: filterAlumnosByEstado filtra inactivos por defecto y los incluye al activar el switch', async () => {
    await mockAdapter.cambiarEstadoAlumno(3, false)
    const alumnos = await mockAdapter.getAlumnos()

    const soloActivos = filterAlumnosByEstado(alumnos, false)
    expect(soloActivos.some((a) => a.id_persona === 3)).toBe(false)

    const conInactivos = filterAlumnosByEstado(alumnos, true)
    expect(conInactivos.some((a) => a.id_persona === 3)).toBe(true)
  })

  test('REQ-PRG-004, REQ-PRG-005: filtra por fecha, rutina y ejercicio y calcula KPIs', async () => {
    const { historial } = await fetchReporteProgresoAlumno(2)

    const filtradasPorEjercicio = filterHistorialSesiones(historial, {
      idEjercicio: 1,
    })
    expect(filtradasPorEjercicio.length).toBe(1)
    expect(filtradasPorEjercicio[0].series.length).toBe(4)

    const kpis = calcularKpisProgreso(filtradasPorEjercicio)
    expect(kpis.totalSesiones).toBe(1)
    expect(kpis.totalSeries).toBe(4)
    expect(kpis.recordPesoKg).toBe(32.5)
    expect(kpis.ultimaFecha).toBe('2026-10-06')

    const planas = flattenSesionesToSeries(filtradasPorEjercicio)
    expect(planas.length).toBe(4)
    expect(planas[0].nombre_ejercicio).toBe('Press Plano con Mancuernas')
  })

  test('REQ-PRG-008, REQ-PRG-010, REQ-PRG-011: buildAlumnoWorkbook genera las 3 hojas exactas sin exponer IDs internos', async () => {
    const reporte = await fetchReporteProgresoAlumno(2)
    const wb = buildAlumnoWorkbook({
      alumno: reporte.alumno,
      rutinas: reporte.rutinas,
      historial: reporte.historial,
    })

    expect(wb.SheetNames).toEqual([
      'Ficha del Alumno',
      'Rutinas Semanales',
      'Historial de Entrenamientos',
    ])

    const sheet1 = XLSX.utils.sheet_to_json(wb.Sheets['Ficha del Alumno'])
    const sheet2 = XLSX.utils.sheet_to_json(wb.Sheets['Rutinas Semanales'])
    const sheet3 = XLSX.utils.sheet_to_json(wb.Sheets['Historial de Entrenamientos'])

    expect(sheet1[0]['Nombre y Apellido']).toBe('Martín Gómez')
    expect(sheet1[0]).not.toHaveProperty('id_persona')
    expect(sheet1[0]).not.toHaveProperty('id_usuario')

    expect(sheet2.length).toBeGreaterThan(0)
    expect(sheet2[0]).toHaveProperty('Día de Rutina')
    expect(sheet2[0]).toHaveProperty('Ejercicio')
    expect(sheet2[0]).not.toHaveProperty('id_rutina')

    expect(sheet3.length).toBe(6)
    expect(sheet3[0]).toHaveProperty('Fecha Realización')
    expect(sheet3[0]).toHaveProperty('Peso (kg)')
    expect(sheet3[0]).not.toHaveProperty('client_submission_id')

    const fileName = buildExcelFileName(reporte.alumno, '2026-10-08')
    expect(fileName).toBe('Pirro_Alumno_Martin_Gomez_2026-10-08.xlsx')
  })

  test('REQ-PRG-009: permite seleccionar un subconjunto de columnas para cada hoja del Excel', async () => {
    const reporte = await fetchReporteProgresoAlumno(2)
    const fichaRows = buildFichaSheetRows(reporte.alumno, ['nombre_apellido', 'peso_kg'])
    expect(Object.keys(fichaRows[0])).toEqual(['Nombre y Apellido', 'Peso (kg)'])

    const rutinasRows = buildRutinasSheetRows(reporte.rutinas, ['dia_rutina', 'ejercicio'])
    expect(Object.keys(rutinasRows[0])).toEqual(['Día de Rutina', 'Ejercicio'])

    const historialRows = buildHistorialSheetRows(reporte.historial, [
      'fecha_realizacion',
      'ejercicio',
      'peso_kg',
    ])
    expect(Object.keys(historialRows[0])).toEqual(['Fecha Realización', 'Ejercicio', 'Peso (kg)'])

    const wbWithoutRutinas = buildAlumnoWorkbook({
      alumno: reporte.alumno,
      rutinas: reporte.rutinas,
      historial: reporte.historial,
      sheetsSelection: { ficha: true, rutinas: false, historial: true },
    })
    expect(wbWithoutRutinas.SheetNames).toEqual([
      'Ficha del Alumno',
      'Historial de Entrenamientos',
    ])
  })
})
