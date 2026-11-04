// Anchored to REQ-EJE-002, REQ-EJE-003, REQ-EJE-006
import { useState } from 'react'

export function useEjercicioForm({ ejercicio, onSave, onClose }) {
  const [nombre, setNombre] = useState(ejercicio?.nombre || '')

  const initialMuscles = ejercicio?.grupo_muscular
    ? ejercicio.grupo_muscular.split(/[,/]/).map((m) => m.trim()).filter(Boolean)
    : ['Pectorales']

  const [selectedMuscles, setSelectedMuscles] = useState(initialMuscles)
  const [requiereEq, setRequiereEq] = useState(Boolean(ejercicio?.requiere_equipamiento))
  const [idEqRequerido, setIdEqRequerido] = useState(ejercicio?.id_equipamiento_requerido || '')
  const [indicaciones, setIndicaciones] = useState(ejercicio?.indicaciones || '')
  const [urlVideo, setUrlVideo] = useState(ejercicio?.url_video || '')
  const [estado, setEstado] = useState(ejercicio?.estado !== undefined ? ejercicio.estado : true)

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const toggleMuscle = (muscle) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    )
  }

  const isFormValid =
    Boolean(nombre.trim()) &&
    selectedMuscles.length > 0 &&
    (!requiereEq || Boolean(idEqRequerido))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) {
      setErrorMsg('El nombre del ejercicio es obligatorio')
      return
    }
    if (selectedMuscles.length === 0) {
      setErrorMsg('Debes seleccionar al menos un grupo muscular')
      return
    }
    if (requiereEq && !idEqRequerido) {
      setErrorMsg('Debes seleccionar el equipamiento requerido')
      return
    }

    setSubmitting(true)
    setErrorMsg('')

    const payload = {
      ...(ejercicio?.id ? { id: ejercicio.id } : {}),
      nombre: nombre.trim(),
      grupo_muscular: selectedMuscles.join(', '),
      requiere_equipamiento: requiereEq,
      id_equipamiento_requerido: requiereEq ? Number(idEqRequerido) : null,
      indicaciones: indicaciones.trim() || null,
      url_video: urlVideo.trim() || null,
      estado,
    }

    const res = await onSave(payload)
    setSubmitting(false)

    if (res.ok) {
      onClose()
    } else {
      setErrorMsg(res.error?.message || 'Error al guardar el ejercicio')
    }
  }

  return {
    nombre,
    setNombre,
    selectedMuscles,
    toggleMuscle,
    requiereEq,
    setRequiereEq,
    idEqRequerido,
    setIdEqRequerido,
    indicaciones,
    setIndicaciones,
    urlVideo,
    setUrlVideo,
    estado,
    setEstado,
    submitting,
    errorMsg,
    isFormValid,
    handleSubmit,
  }
}
