// Anchored to REQ-PRG-002, REQ-PRG-004, REQ-PRG-005, REQ-PRG-012
import { isoToDmy, dmyToIso, buildDefaultMonthRange } from './progresoDateUtils'

export { isoToDmy, dmyToIso, buildDefaultMonthRange }

export function filterAlumnosByEstado(alumnos, includeInactivos) {
  const list = Array.isArray(alumnos) ? alumnos : []
  return includeInactivos ? list : list.filter((a) => Boolean(a.estado))
}

function addRutinaAndEjercicios(rutinasMap, ejerciciosMap, r) {
  if (r?.id && !rutinasMap.has(Number(r.id))) {
    rutinasMap.set(Number(r.id), {
      id: Number(r.id),
      nombre_rutina: r.nombre_rutina,
      numero_dia: r.numero_dia,
    })
  }
  for (const item of r?.ejercicios || []) {
    const ej = item.ejercicio
    if (ej?.id && !ejerciciosMap.has(Number(ej.id))) {
      ejerciciosMap.set(Number(ej.id), {
        id: Number(ej.id),
        nombre: ej.nombre,
        grupo_muscular: ej.grupo_muscular,
      })
    }
  }
}

export function extractCatalogosFromAlumnoData(rutinas, historial) {
  const rutinasMap = new Map()
  const ejerciciosMap = new Map()
  for (const r of rutinas || []) {
    addRutinaAndEjercicios(rutinasMap, ejerciciosMap, r)
  }
  for (const ses of historial || []) {
    addRutinaAndEjercicios(rutinasMap, ejerciciosMap, {
      ...(ses.rutina || {}),
      ejercicios: ses.series,
    })
  }
  return {
    rutinasDisponibles: Array.from(rutinasMap.values()).sort((a, b) => a.numero_dia - b.numero_dia),
    ejerciciosDisponibles: Array.from(ejerciciosMap.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    ),
  }
}

export function filterHistorialSesiones(historial, filters = {}) {
  const { fechaDesde = '', fechaHasta = '', idRutina = 'all', idEjercicio = 'all' } = filters
  const desdeIso = dmyToIso(fechaDesde) || fechaDesde
  const hastaIso = dmyToIso(fechaHasta) || fechaHasta
  const sesiones = Array.isArray(historial) ? historial : []

  return sesiones
    .filter((ses) => {
      if (desdeIso && ses.fecha_realizacion < desdeIso) return false
      if (hastaIso && ses.fecha_realizacion > hastaIso) return false
      return idRutina === 'all' || Number(ses.id_rutina) === Number(idRutina)
    })
    .map((ses) => ({
      ...ses,
      series: (ses.series || []).filter(
        (ser) => idEjercicio === 'all' || Number(ser.id_ejercicio) === Number(idEjercicio)
      ),
    }))
    .filter((ses) => ses.series.length > 0)
}

export function flattenSesionesToSeries(sesionesFiltradas) {
  const rows = []
  for (const ses of sesionesFiltradas || []) {
    const nombreRutina = ses.rutina
      ? `Día ${ses.rutina.numero_dia} — ${ses.rutina.nombre_rutina}`
      : `Rutina #${ses.id_rutina}`
    for (const ser of ses.series || []) {
      rows.push({
        key: `${ses.id}-${ser.id || ser.numero_serie}-${ser.id_ejercicio}`,
        id_registro: ses.id,
        fecha_realizacion: ses.fecha_realizacion,
        nombre_rutina: nombreRutina,
        nombre_ejercicio: ser.ejercicio ? ser.ejercicio.nombre : `Ejercicio #${ser.id_ejercicio}`,
        grupo_muscular: ser.ejercicio ? ser.ejercicio.grupo_muscular : '',
        numero_serie: Number(ser.numero_serie),
        repeticiones_objetivo: String(ser.repeticiones_objetivo || ''),
        repeticiones_realizadas: Number(ser.repeticiones_realizadas),
        peso_utilizado: Number(ser.peso_utilizado),
        comentario_alumno: ser.comentario_alumno || '',
      })
    }
  }
  return rows
}

export function calcularKpisProgreso(sesionesFiltradas) {
  const seriesPlanas = flattenSesionesToSeries(sesionesFiltradas)
  const totalSesiones = (sesionesFiltradas || []).length
  const recordPesoKg = seriesPlanas.reduce(
    (max, item) => (item.peso_utilizado > max ? item.peso_utilizado : max),
    0
  )
  return {
    totalSesiones,
    totalSeries: seriesPlanas.length,
    recordPesoKg,
    ultimaFecha: totalSesiones > 0 ? sesionesFiltradas[0].fecha_realizacion : null,
  }
}
