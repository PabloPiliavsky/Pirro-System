// Anchored to REQ-PRG-008, REQ-PRG-009, REQ-PRG-010, REQ-PRG-012
import {
  FICHA_COLUMNS,
  RUTINAS_COLUMNS,
  HISTORIAL_COLUMNS,
} from './excelColumnsConfig'

export function calculateEdadFromBirthDate(fechaNacimiento, refDate = '2026-10-08') {
  if (!fechaNacimiento) return 'No registrada'
  const birth = new Date(fechaNacimiento)
  const ref = new Date(refDate)
  if (Number.isNaN(birth.getTime())) return 'No registrada'
  let age = ref.getFullYear() - birth.getFullYear()
  const monthDiff = ref.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) {
    age -= 1
  }
  return `${age} años`
}

function projectRowBySelectedColumns(rawMap, columnsDef, selectedKeys) {
  const activeSet = new Set(selectedKeys)
  const projected = {}
  for (const col of columnsDef) {
    if (activeSet.has(col.key)) {
      projected[col.label] = rawMap[col.key]
    }
  }
  return projected
}

export function buildFichaSheetRows(alumno, selectedKeys = FICHA_COLUMNS.map((c) => c.key)) {
  if (!alumno) return []
  const rawMap = {
    nombre_apellido: alumno.nombre_completo || `${alumno.nombre || ''} ${alumno.apellido || ''}`.trim(),
    edad: calculateEdadFromBirthDate(alumno.fecha_nacimiento),
    altura_cm: alumno.altura_cm ?? 'No registrada',
    peso_kg: alumno.peso_kg ?? 'No registrado',
    gimnasio: alumno.gimnasio?.nombre || 'Sin gimnasio asignado',
    dias_por_semana: alumno.cantidad_dias_rutina ?? 0,
    salud_enfermedades: alumno.salud_enfermedades || 'Sin observaciones médicas',
    comentario_profesor: alumno.comentario || 'Sin comentarios',
  }
  return [projectRowBySelectedColumns(rawMap, FICHA_COLUMNS, selectedKeys)]
}

export function buildRutinasSheetRows(rutinas, selectedKeys = RUTINAS_COLUMNS.map((c) => c.key)) {
  const rows = []
  const sortedRutinas = [...(rutinas || [])].sort((a, b) => a.numero_dia - b.numero_dia)
  for (const r of sortedRutinas) {
    const labelDia = `Día ${r.numero_dia} - ${r.nombre_rutina}`
    const sortedEjercicios = [...(r.ejercicios || [])].sort((a, b) => a.orden - b.orden)
    for (const item of sortedEjercicios) {
      const ej = item.ejercicio || {}
      const rawMap = {
        dia_rutina: labelDia,
        orden: item.orden,
        ejercicio: ej.nombre || 'Ejercicio',
        musculos: ej.grupo_muscular || 'General',
        maquina_elemento: ej.equipamiento_requerido?.nombre || 'Peso corporal / Libre',
        series_objetivo: item.series_objetivo,
        repeticiones_objetivo: item.repeticiones_objetivo,
        notas: item.notas_profesor || '—',
      }
      rows.push(projectRowBySelectedColumns(rawMap, RUTINAS_COLUMNS, selectedKeys))
    }
  }
  return rows
}

export function buildHistorialSheetRows(historial, selectedKeys = HISTORIAL_COLUMNS.map((c) => c.key)) {
  const rows = []
  for (const ses of historial || []) {
    const labelRutina = ses.rutina
      ? `Día ${ses.rutina.numero_dia} - ${ses.rutina.nombre_rutina}`
      : 'Rutina registrada'
    const sortedSeries = [...(ses.series || [])].sort((a, b) => a.numero_serie - b.numero_serie)
    for (const ser of sortedSeries) {
      const rawMap = {
        fecha_realizacion: ses.fecha_realizacion,
        rutina: labelRutina,
        ejercicio: ser.ejercicio?.nombre || 'Ejercicio',
        numero_serie: ser.numero_serie,
        reps_objetivo: ser.repeticiones_objetivo,
        reps_realizadas: ser.repeticiones_realizadas,
        peso_kg: ser.peso_utilizado,
        comentario_alumno: ser.comentario_alumno || '—',
      }
      rows.push(projectRowBySelectedColumns(rawMap, HISTORIAL_COLUMNS, selectedKeys))
    }
  }
  return rows
}
