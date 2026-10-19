// Anchored to REQ-FND-008, REQ-FND-012

function isValidSerieItem(serie) {
  return (
    Boolean(serie) &&
    Number(serie.idEjercicio) > 0 &&
    Number(serie.numeroSerie) >= 1 &&
    Number(serie.repeticionesRealizadas) >= 0 &&
    Number(serie.pesoUtilizado) >= 0
  )
}

export function validateTrainingBatchPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {
      ok: false,
      error: {
        code: 'INVALID_BATCH_PAYLOAD',
        message: 'El payload de entrenamiento es obligatorio.',
      },
    }
  }

  const { clientSubmissionId, idAlumno, idRutina, series } = payload
  const hasRequiredHeaders =
    typeof clientSubmissionId === 'string' &&
    clientSubmissionId.trim().length > 0 &&
    Number(idAlumno) > 0 &&
    Number(idRutina) > 0

  if (!hasRequiredHeaders || !Array.isArray(series) || series.length === 0) {
    return {
      ok: false,
      error: {
        code: 'INVALID_BATCH_PAYLOAD',
        message: 'El payload debe incluir clientSubmissionId, idAlumno, idRutina y al menos una serie.',
      },
    }
  }

  const allSeriesValid = series.every(isValidSerieItem)
  if (!allSeriesValid) {
    return {
      ok: false,
      error: {
        code: 'INVALID_BATCH_PAYLOAD',
        message: 'Cada serie debe incluir idEjercicio, numeroSerie >= 1, repeticionesRealizadas >= 0 y pesoUtilizado >= 0.',
      },
    }
  }

  return { ok: true }
}
