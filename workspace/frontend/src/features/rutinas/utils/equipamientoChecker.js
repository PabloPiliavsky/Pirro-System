// Anchored to REQ-RUT-006, REQ-RUT-007

export function checkDisponibilidadEquipamiento(ejercicio, gimnasio) {
  if (!ejercicio?.requiere_equipamiento || !ejercicio?.id_equipamiento_requerido) {
    return { disponible: true, advertencia: false, mensaje: null }
  }

  const reqId = Number(ejercicio.id_equipamiento_requerido)
  const nombreEquipo =
    ejercicio.equipamiento_requerido?.nombre || 'Máquina requerida'

  if (!gimnasio) {
    return {
      disponible: false,
      advertencia: true,
      mensaje: `⚠️ Requiere '${nombreEquipo}' (Alumno sin sede asignada)`,
    }
  }

  const disponibles = gimnasio.equipamiento_disponible || []
  const existe = disponibles.some(
    (ge) => Number(ge.id_equipamiento) === reqId && ge.estado
  )

  if (existe) {
    return { disponible: true, advertencia: false, mensaje: 'Equipamiento disponible en sede' }
  }

  return {
    disponible: false,
    advertencia: true,
    mensaje: `⚠️ '${nombreEquipo}' no figura en ${gimnasio.nombre}`,
  }
}
