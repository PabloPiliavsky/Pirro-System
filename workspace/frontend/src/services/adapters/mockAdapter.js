// Anchored to REQ-FND-008, REQ-FND-011, REQ-FND-012, REQ-GYM-001, REQ-EJE-001
import { createInitialMockDb } from '../seed/mockSeedData'
import { validateTrainingBatchPayload } from '../validators/trainingBatchValidator'
import { validateGimnasioPayload } from '../validators/gimnasiosValidator'
import { validateEjercicioPayload } from '../validators/ejerciciosValidator'
import {
  buildAlumnosView,
  buildGimnasiosView,
  buildEjerciciosView,
  buildRutinasByAlumno,
  buildSystemSummaryView,
} from './mockAdapterQueries'
import {
  saveGimnasioMock,
  deleteGimnasioMock,
  saveEjercicioMock,
  deleteEjercicioMock,
  saveEquipamientoMock,
} from './mockAdapterMutations'

export const MOCK_DB_STORAGE_KEY = 'pirro_mock_db_v1'

function loadMockDb() {
  const raw = localStorage.getItem(MOCK_DB_STORAGE_KEY)
  if (!raw) {
    const initial = createInitialMockDb()
    localStorage.setItem(MOCK_DB_STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
  return JSON.parse(raw)
}

function saveMockDb(db) {
  localStorage.setItem(MOCK_DB_STORAGE_KEY, JSON.stringify(db))
}

function appendBatchRecords(db, payload) {
  const nextRegistroId =
    db.registros_rutina.reduce((max, item) => Math.max(max, item.id), 0) + 1
  let nextSerieId =
    db.detalle_series.reduce((max, item) => Math.max(max, item.id), 0) + 1

  const nuevoRegistro = {
    id: nextRegistroId,
    client_submission_id: payload.clientSubmissionId,
    id_alumno: Number(payload.idAlumno),
    id_rutina: Number(payload.idRutina),
    fecha_realizacion: payload.fechaRealizacion || new Date().toISOString().slice(0, 10),
  }

  const nuevasSeries = payload.series.map((s) => ({
    id: nextSerieId++,
    id_registro_rutina: nextRegistroId,
    id_ejercicio: Number(s.idEjercicio),
    numero_serie: Number(s.numeroSerie),
    repeticiones_objetivo: String(s.repeticionesObjetivo || '10'),
    repeticiones_realizadas: Number(s.repeticionesRealizadas),
    peso_utilizado: Number(s.pesoUtilizado),
    comentario_alumno: s.comentarioAlumno ? String(s.comentarioAlumno).trim() : null,
  }))

  db.registros_rutina.push(nuevoRegistro)
  db.detalle_series.push(...nuevasSeries)
  return nextRegistroId
}

export const mockAdapter = {
  mode: 'mock',

  async getSystemStatusSummary() {
    return buildSystemSummaryView(loadMockDb())
  },

  async getAlumnos() {
    return buildAlumnosView(loadMockDb())
  },

  async getGimnasios() {
    return buildGimnasiosView(loadMockDb())
  },

  async getEquipamientoMaestro() {
    return loadMockDb().equipamiento
  },

  async guardarEquipamiento(payload) {
    if (!payload?.nombre?.trim()) {
      return { ok: false, error: { message: 'El nombre del equipamiento es obligatorio' } }
    }
    const db = loadMockDb()
    const data = saveEquipamientoMock(db, payload)
    saveMockDb(db)
    return { ok: true, data }
  },

  async guardarGimnasio(payload) {
    const validation = validateGimnasioPayload(payload)
    if (!validation.ok) return validation
    const db = loadMockDb()
    const data = saveGimnasioMock(db, payload)
    saveMockDb(db)
    return { ok: true, data }
  },

  async eliminarGimnasio(id) {
    const db = loadMockDb()
    const success = deleteGimnasioMock(db, id)
    saveMockDb(db)
    return { ok: success }
  },

  async getEjercicios() {
    return buildEjerciciosView(loadMockDb())
  },

  async guardarEjercicio(payload) {
    const validation = validateEjercicioPayload(payload)
    if (!validation.ok) return validation
    const db = loadMockDb()
    const data = saveEjercicioMock(db, payload)
    saveMockDb(db)
    return { ok: true, data }
  },

  async eliminarEjercicio(id) {
    const db = loadMockDb()
    const success = deleteEjercicioMock(db, id)
    saveMockDb(db)
    return { ok: success }
  },

  async getRutinasByAlumno(idAlumno) {
    return buildRutinasByAlumno(loadMockDb(), idAlumno)
  },

  async guardarEntrenamientoBatch(payload) {
    const validation = validateTrainingBatchPayload(payload)
    if (!validation.ok) return validation

    const db = loadMockDb()
    const existing = db.registros_rutina.find(
      (reg) => reg.client_submission_id === payload.clientSubmissionId
    )
    if (existing) {
      return { ok: true, idRegistro: existing.id, idempotent: true }
    }

    const idRegistro = appendBatchRecords(db, payload)
    saveMockDb(db)
    return { ok: true, idRegistro, idempotent: false }
  },

  async resetMockDatabase() {
    saveMockDb(createInitialMockDb())
    return { ok: true, restored: true }
  },
}
