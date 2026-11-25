// Anchored to REQ-PRG-008, REQ-PRG-009, REQ-PRG-010
export const FICHA_COLUMNS = [
  { key: 'nombre_apellido', label: 'Nombre y Apellido', defaultChecked: true },
  { key: 'edad', label: 'Edad', defaultChecked: true },
  { key: 'altura_cm', label: 'Altura (cm)', defaultChecked: true },
  { key: 'peso_kg', label: 'Peso (kg)', defaultChecked: true },
  { key: 'gimnasio', label: 'Gimnasio al que asiste', defaultChecked: true },
  { key: 'dias_por_semana', label: 'Días por semana', defaultChecked: true },
  { key: 'salud_enfermedades', label: 'Salud/Enfermedades', defaultChecked: true },
  { key: 'comentario_profesor', label: 'Comentarios del profesor', defaultChecked: true },
]

export const RUTINAS_COLUMNS = [
  { key: 'dia_rutina', label: 'Día de Rutina', defaultChecked: true },
  { key: 'orden', label: 'Orden', defaultChecked: true },
  { key: 'ejercicio', label: 'Ejercicio', defaultChecked: true },
  { key: 'musculos', label: 'Músculos', defaultChecked: true },
  { key: 'maquina_elemento', label: 'Máquina/Elemento', defaultChecked: true },
  { key: 'series_objetivo', label: 'Series Objetivo', defaultChecked: true },
  { key: 'repeticiones_objetivo', label: 'Repeticiones Objetivo', defaultChecked: true },
  { key: 'notas', label: 'Notas', defaultChecked: true },
]

export const HISTORIAL_COLUMNS = [
  { key: 'fecha_realizacion', label: 'Fecha Realización', defaultChecked: true },
  { key: 'rutina', label: 'Rutina', defaultChecked: true },
  { key: 'ejercicio', label: 'Ejercicio', defaultChecked: true },
  { key: 'numero_serie', label: 'N° Serie', defaultChecked: true },
  { key: 'reps_objetivo', label: 'Reps Objetivo', defaultChecked: true },
  { key: 'reps_realizadas', label: 'Reps Realizadas', defaultChecked: true },
  { key: 'peso_kg', label: 'Peso (kg)', defaultChecked: true },
  { key: 'comentario_alumno', label: 'Comentario Alumno', defaultChecked: true },
]

export function createDefaultColumnsSelection() {
  return {
    ficha: FICHA_COLUMNS.map((c) => c.key),
    rutinas: RUTINAS_COLUMNS.map((c) => c.key),
    historial: HISTORIAL_COLUMNS.map((c) => c.key),
  }
}

export function createDefaultSheetsSelection() {
  return {
    ficha: true,
    rutinas: true,
    historial: true,
  }
}
