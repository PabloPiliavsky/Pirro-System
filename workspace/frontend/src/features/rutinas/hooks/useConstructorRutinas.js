// Anchored to REQ-RUT-002, REQ-RUT-003, REQ-RUT-005, REQ-RUT-008
import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchRutinasByAlumno, saveRutinaCompleta } from '../../../services/rutinasService'

export function useConstructorRutinas(alumnoInicial = null) {
  const [alumno, setAlumno] = useState(alumnoInicial)
  const [rutinasSemana, setRutinasSemana] = useState([])
  const [diaActivo, setDiaActivo] = useState(1)
  const [nombreRutina, setNombreRutina] = useState('Día 1')
  const [ejerciciosDia, setEjerciciosDia] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const cantidadDias = useMemo(() => {
    return Number(alumno?.cantidad_dias_rutina || alumno?.perfil_alumno?.cantidad_dias_rutina || 3)
  }, [alumno])

  const cargarRutinas = useCallback(async (idAlumno) => {
    if (!idAlumno) return
    setLoading(true)
    try {
      const data = await fetchRutinasByAlumno(idAlumno)
      setRutinasSemana(data || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (alumno?.id_persona) {
      cargarRutinas(alumno.id_persona)
      setDiaActivo(1)
    } else {
      setRutinasSemana([])
      setEjerciciosDia([])
    }
  }, [alumno, cargarRutinas])

  useEffect(() => {
    const rutinaDia = rutinasSemana.find((r) => Number(r.numero_dia) === Number(diaActivo))
    if (rutinaDia) {
      setNombreRutina(rutinaDia.nombre_rutina || `Día ${diaActivo}`)
      const ordenados = [...(rutinaDia.ejercicios || [])].sort((a, b) => a.orden - b.orden)
      setEjerciciosDia(
        ordenados.map((item, idx) => ({
          id_ejercicio: item.id_ejercicio,
          series_objetivo: item.series_objetivo || 3,
          repeticiones_objetivo: item.repeticiones_objetivo || '10-12',
          notas_profesor: item.notas_profesor || '',
          orden: idx + 1,
          ejercicio: item.ejercicio || null,
        }))
      )
    } else {
      setNombreRutina(`Día ${diaActivo}`)
      setEjerciciosDia([])
    }
  }, [diaActivo, rutinasSemana])

  const agregarEjercicio = useCallback((ejercicio) => {
    setEjerciciosDia((prev) => [
      ...prev,
      {
        id_ejercicio: ejercicio.id,
        series_objetivo: 3,
        repeticiones_objetivo: '10-12',
        notas_profesor: '',
        orden: prev.length + 1,
        ejercicio,
      },
    ])
  }, [])

  const actualizarEjercicio = useCallback((index, campo, valor) => {
    setEjerciciosDia((prev) => {
      const copia = [...prev]
      copia[index] = { ...copia[index], [campo]: valor }
      return copia
    })
  }, [])

  const moverEjercicio = useCallback((index, direccion) => {
    setEjerciciosDia((prev) => {
      const nuevoIndex = direccion === 'arriba' ? index - 1 : index + 1
      if (nuevoIndex < 0 || nuevoIndex >= prev.length) return prev
      const copia = [...prev]
      const [movido] = copia.splice(index, 1)
      copia.splice(nuevoIndex, 0, movido)
      return copia.map((item, idx) => ({ ...item, orden: idx + 1 }))
    })
  }, [])

  const eliminarEjercicio = useCallback((index) => {
    setEjerciciosDia((prev) =>
      prev.filter((_, i) => i !== index).map((item, idx) => ({ ...item, orden: idx + 1 }))
    )
  }, [])

  const guardarRutina = useCallback(async () => {
    if (!alumno?.id_persona) return { ok: false, error: 'Debe seleccionar un alumno' }
    setSaving(true)
    setMensaje(null)
    try {
      const payload = {
        id_alumno: alumno.id_persona,
        numero_dia: diaActivo,
        nombre_rutina: nombreRutina.trim() || `Día ${diaActivo}`,
        ejercicios: ejerciciosDia.map((e, idx) => ({
          id_ejercicio: e.id_ejercicio,
          series_objetivo: Number(e.series_objetivo || 3),
          repeticiones_objetivo: String(e.repeticiones_objetivo || '10-12').trim(),
          notas_profesor: e.notas_profesor?.trim() || null,
          orden: idx + 1,
        })),
      }
      const res = await saveRutinaCompleta(payload)
      if (res.ok) {
        setMensaje({ tipo: 'success', texto: 'Rutina guardada correctamente.' })
        await cargarRutinas(alumno.id_persona)
      } else {
        setMensaje({ tipo: 'error', texto: res.error?.message || 'Error al guardar la rutina.' })
      }
      return res
    } finally {
      setSaving(false)
    }
  }, [alumno, diaActivo, nombreRutina, ejerciciosDia, cargarRutinas])

  return {
    alumno,
    setAlumno,
    cantidadDias,
    diaActivo,
    setDiaActivo,
    nombreRutina,
    setNombreRutina,
    ejerciciosDia,
    rutinasSemana,
    loading,
    saving,
    mensaje,
    setMensaje,
    agregarEjercicio,
    actualizarEjercicio,
    moverEjercicio,
    eliminarEjercicio,
    guardarRutina,
    recargar: () => alumno?.id_persona && cargarRutinas(alumno.id_persona),
  }
}
