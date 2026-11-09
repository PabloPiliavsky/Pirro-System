// Anchored to REQ-ALU-002, REQ-ALU-003, REQ-ALU-004
import { useState } from 'react'

export function useAlumnoForm({ alumno, onSave, onClose }) {
  const isEditing = Boolean(alumno)

  const [nombre, setNombre] = useState(alumno?.nombre || '')
  const [apellido, setApellido] = useState(alumno?.apellido || '')
  const [nombreUsuario, setNombreUsuario] = useState(alumno?.nombre_usuario || '')
  const [email, setEmail] = useState(alumno?.email || '')
  const [password, setPassword] = useState(isEditing ? '' : 'Pirro123!')
  const [telefono, setTelefono] = useState(alumno?.telefono || '')
  const [fechaNacimiento, setFechaNacimiento] = useState(alumno?.fecha_nacimiento || '')
  const [idGimnasio, setIdGimnasio] = useState(alumno?.id_gimnasio || '')
  const [cantidadDiasRutina, setCantidadDiasRutina] = useState(alumno?.cantidad_dias_rutina || 3)
  const [alturaCm, setAlturaCm] = useState(alumno?.altura_cm || '')
  const [pesoKg, setPesoKg] = useState(alumno?.peso_kg || '')
  const [saludEnfermedades, setSaludEnfermedades] = useState(alumno?.salud_enfermedades || '')
  const [fechaIngreso, setFechaIngreso] = useState(
    alumno?.fecha_ingreso || new Date().toISOString().slice(0, 10)
  )
  const [comentario, setComentario] = useState(alumno?.comentario || '')
  const [mostrarImc, setMostrarImc] = useState(Boolean(alumno?.mostrar_imc))

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const isFormValid =
    nombre.trim().length > 0 &&
    apellido.trim().length > 0 &&
    (isEditing || (nombreUsuario.trim().length > 0 && email.trim().length > 0))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid || submitting) return

    setSubmitting(true)
    setErrorMsg(null)

    const payload = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      nombre_usuario: nombreUsuario.trim(),
      email: email.trim(),
      password: password || undefined,
      telefono: telefono.trim() || null,
      fecha_nacimiento: fechaNacimiento || null,
      id_gimnasio: idGimnasio ? Number(idGimnasio) : null,
      cantidad_dias_rutina: Number(cantidadDiasRutina),
      altura_cm: alturaCm ? Number(alturaCm) : null,
      peso_kg: pesoKg ? Number(pesoKg) : null,
      salud_enfermedades: saludEnfermedades.trim() || null,
      fecha_ingreso: fechaIngreso,
      mostrar_imc: Boolean(mostrarImc),
      comentario: comentario.trim() || null,
    }

    const res = isEditing
      ? await onSave(alumno.id_persona, payload)
      : await onSave(payload)

    setSubmitting(false)
    if (res?.ok) {
      onClose()
    } else {
      setErrorMsg(res?.error?.message || 'Error al guardar alumno.')
    }
  }

  return {
    isEditing,
    nombre, setNombre,
    apellido, setApellido,
    nombreUsuario, setNombreUsuario,
    email, setEmail,
    password, setPassword,
    telefono, setTelefono,
    fechaNacimiento, setFechaNacimiento,
    idGimnasio, setIdGimnasio,
    cantidadDiasRutina, setCantidadDiasRutina,
    alturaCm, setAlturaCm,
    pesoKg, setPesoKg,
    saludEnfermedades, setSaludEnfermedades,
    fechaIngreso, setFechaIngreso,
    mostrarImc, setMostrarImc,
    comentario, setComentario,
    submitting,
    errorMsg,
    isFormValid,
    handleSubmit,
  }
}
