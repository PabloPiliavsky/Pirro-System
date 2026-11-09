// Anchored to REQ-ALU-001, REQ-ALU-006, REQ-ALU-007
import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  fetchAlumnos,
  saveAlumno,
  updateAlumno,
  setAlumnoEstado,
} from '../../../services/alumnosService'
import { fetchGimnasios } from '../../../services/gimnasiosService'

function filterAlumnoItem(alumno, search, gymId, status) {
  if (status === 'ACTIVE' && !alumno.estado) return false
  if (status === 'INACTIVE' && alumno.estado) return false

  if (gymId !== 'ALL') {
    if (gymId === 'NONE' && alumno.id_gimnasio !== null) return false
    if (gymId !== 'NONE' && String(alumno.id_gimnasio) !== String(gymId)) return false
  }

  if (!search) return true
  const term = search.toLowerCase()
  const nombre = (alumno.nombre_completo || '').toLowerCase()
  const usuario = (alumno.nombre_usuario || '').toLowerCase()
  const email = (alumno.email || '').toLowerCase()

  return nombre.includes(term) || usuario.includes(term) || email.includes(term)
}

export function useAlumnos() {
  const [alumnos, setAlumnos] = useState([])
  const [gimnasios, setGimnasios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGimnasioId, setSelectedGimnasioId] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ACTIVE')

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [alumnosData, gymsData] = await Promise.all([
        fetchAlumnos(),
        fetchGimnasios(),
      ])
      setAlumnos(alumnosData)
      setGimnasios(gymsData)
    } catch (err) {
      setError(err.message || 'Error al cargar alumnos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const filteredAlumnos = useMemo(() => {
    return alumnos.filter((item) =>
      filterAlumnoItem(item, searchTerm, selectedGimnasioId, statusFilter)
    )
  }, [alumnos, searchTerm, selectedGimnasioId, statusFilter])

  const handleCreate = async (payload) => {
    const res = await saveAlumno(payload)
    if (res.ok) await reload()
    return res
  }

  const handleUpdate = async (idPersona, payload) => {
    const res = await updateAlumno(idPersona, payload)
    if (res.ok) await reload()
    return res
  }

  const handleToggleEstado = async (idPersona, nuevoEstado) => {
    const res = await setAlumnoEstado(idPersona, nuevoEstado)
    if (res.ok) await reload()
    return res
  }

  return {
    alumnos,
    filteredAlumnos,
    gimnasios,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedGimnasioId,
    setSelectedGimnasioId,
    statusFilter,
    setStatusFilter,
    reload,
    handleCreate,
    handleUpdate,
    handleToggleEstado,
  }
}
