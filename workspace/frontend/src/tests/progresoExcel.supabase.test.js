// Anchored to REQ-PRG-001, REQ-PRG-008, REQ-PRG-010, REQ-PRG-012
import { describe, expect, test, beforeEach, afterAll } from 'vitest'
import * as XLSX from 'xlsx'
import { supabaseAdapter } from '@/services/adapters/supabaseAdapter'
import { supabaseAuthAdapter } from '@/services/adapters/supabaseAuthAdapter'
import { buildAlumnoWorkbook } from '@/features/progreso-excel/utils/excelBuilder'

const isSupabaseEnabled = process.env.RUN_SUPABASE_TESTS === 'true'
const runIfSupabase = isSupabaseEnabled ? describe : describe.skip

runIfSupabase('supabaseAdapter - Progreso y Exportación Excel (Docker Supabase)', () => {
  beforeEach(async () => {
    await supabaseAuthAdapter.login({
      identifier: 'leandro@pirrosystem.com',
      password: 'password123',
    })
  })

  afterAll(async () => {
    await supabaseAuthAdapter.logout()
  })

  test('REQ-PRG-001, REQ-PRG-008: el profesor recupera ficha, rutinas e historial desde Supabase y construye el libro Excel de 3 hojas', async () => {
    const [alumno, rutinas, historial] = await Promise.all([
      supabaseAdapter.getAlumnoById(2),
      supabaseAdapter.getRutinasByAlumno(2),
      supabaseAdapter.getHistorialByAlumno(2),
    ])

    expect(alumno).not.toBeNull()
    expect(alumno.id_persona).toBe(2)
    expect(Array.isArray(rutinas)).toBe(true)
    expect(Array.isArray(historial)).toBe(true)
    expect(historial.length).toBeGreaterThan(0)

    const wb = buildAlumnoWorkbook({ alumno, rutinas, historial })
    expect(wb.SheetNames).toEqual([
      'Ficha del Alumno',
      'Rutinas Semanales',
      'Historial de Entrenamientos',
    ])

    const sheetFicha = XLSX.utils.sheet_to_json(wb.Sheets['Ficha del Alumno'])
    const sheetHistorial = XLSX.utils.sheet_to_json(wb.Sheets['Historial de Entrenamientos'])

    expect(sheetFicha[0]['Nombre y Apellido']).toContain('Martín')
    expect(sheetFicha[0]).not.toHaveProperty('id_persona')
    expect(sheetHistorial.length).toBeGreaterThan(0)
    expect(sheetHistorial[0]).toHaveProperty('Fecha Realización')
    expect(sheetHistorial[0]).not.toHaveProperty('client_submission_id')
  })
})
