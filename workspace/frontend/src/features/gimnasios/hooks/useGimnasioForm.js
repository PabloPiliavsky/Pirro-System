// Anchored to REQ-GYM-002, REQ-GYM-005, REQ-GYM-006
import { useState } from 'react'

export function useGimnasioForm({ gimnasio, onSave, onClose }) {
  const [nombre, setNombre] = useState(gimnasio?.nombre || '')
  const [direccion, setDireccion] = useState(gimnasio?.direccion || '')
  const [horarioApertura, setHorarioApertura] = useState(gimnasio?.horario_apertura || '08:00')
  const [horarioCierre, setHorarioCierre] = useState(gimnasio?.horario_cierre || '22:00')
  const [estado, setEstado] = useState(gimnasio?.estado !== undefined ? gimnasio.estado : true)

  const initialSelected = (gimnasio?.equipamiento_disponible || []).map((e) => e.id_equipamiento)
  const [selectedEq, setSelectedEq] = useState(initialSelected)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const toggleEq = (id) => {
    setSelectedEq((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const isFormValid = Boolean(nombre.trim())

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) {
      setErrorMsg('El nombre de la sede es obligatorio')
      return
    }

    setSubmitting(true)
    setErrorMsg('')

    const payload = {
      ...(gimnasio?.id ? { id: gimnasio.id } : {}),
      nombre: nombre.trim(),
      direccion: direccion.trim() || null,
      horario_apertura: horarioApertura || null,
      horario_cierre: horarioCierre || null,
      estado,
      equipamientoIds: selectedEq,
    }

    const res = await onSave(payload)
    setSubmitting(false)

    if (res.ok) {
      onClose()
    } else {
      setErrorMsg(res.error?.message || 'Error al guardar la sede')
    }
  }

  return {
    nombre,
    setNombre,
    direccion,
    setDireccion,
    horarioApertura,
    setHorarioApertura,
    horarioCierre,
    setHorarioCierre,
    estado,
    setEstado,
    selectedEq,
    toggleEq,
    submitting,
    errorMsg,
    isFormValid,
    handleSubmit,
  }
}
