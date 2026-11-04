import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  fetchGimnasios,
  fetchEquipamientoMaestro,
  saveGimnasio,
  removeGimnasio,
  saveNewEquipamiento,
} from '../../../services/gimnasiosService'

export function useGimnasios() {
  const [gimnasios, setGimnasios] = useState([])
  const [equipamiento, setEquipamiento] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('ALL') // 'ALL' | 'ACTIVE' | 'INACTIVE'

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [gyms, eq] = await Promise.all([
        fetchGimnasios(),
        fetchEquipamientoMaestro(),
      ])
      setGimnasios(gyms)
      setEquipamiento(eq)
    } catch (err) {
      setError(err.message || 'Error al cargar gimnasios')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const filteredGimnasios = useMemo(() => {
    if (filterStatus === 'ACTIVE') return gimnasios.filter((g) => g.estado)
    if (filterStatus === 'INACTIVE') return gimnasios.filter((g) => !g.estado)
    return gimnasios
  }, [gimnasios, filterStatus])

  const handleSave = async (payload) => {
    const res = await saveGimnasio(payload)
    if (res.ok) {
      await reload()
    }
    return res
  }

  const handleDelete = async (id) => {
    const res = await removeGimnasio(id)
    if (res.ok) {
      await reload()
    }
    return res
  }

  const handleReactivate = async (gimnasio) => {
    const payload = {
      ...gimnasio,
      estado: true,
      equipamientoIds: (gimnasio.equipamiento_disponible || []).map((e) => e.id_equipamiento),
    }
    const res = await saveGimnasio(payload)
    if (res.ok) {
      await reload()
    }
    return res
  }

  const handleCreateEquipamiento = async (payload) => {
    const res = await saveNewEquipamiento(payload)
    if (res.ok) {
      const eq = await fetchEquipamientoMaestro()
      setEquipamiento(eq)
    }
    return res
  }

  return {
    gimnasios: filteredGimnasios,
    rawGimnasios: gimnasios,
    equipamiento,
    loading,
    error,
    filterStatus,
    setFilterStatus,
    reload,
    handleSave,
    handleDelete,
    handleReactivate,
    handleCreateEquipamiento,
  }
}
