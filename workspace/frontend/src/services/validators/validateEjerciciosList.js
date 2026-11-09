// Anchored to REQ-RUT-004

export function validateEjerciciosList(ejercicios) {
  if (!Array.isArray(ejercicios)) return 'La lista de ejercicios debe ser un arreglo.'

  for (let i = 0; i < ejercicios.length; i++) {
    const ej = ejercicios[i]
    if (!ej || !ej.id_ejercicio) {
      return `El ejercicio en la posición ${i + 1} no es válido.`
    }
    const series = Number(ej.series_objetivo)
    if (isNaN(series) || series < 1) {
      return `Las series del ejercicio ${i + 1} deben ser un número mayor o igual a 1.`
    }
    const reps = typeof ej.repeticiones_objetivo === 'string' ? ej.repeticiones_objetivo.trim() : ''
    if (!reps) {
      return `Las repeticiones del ejercicio ${i + 1} son obligatorias (ej: '10-12').`
    }
  }
  return null
}

export default validateEjerciciosList
