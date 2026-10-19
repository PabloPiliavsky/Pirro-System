// Anchored to REQ-EJE-001, REQ-EJE-006
import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  fetchEjercicios,
  saveEjercicio,
  removeEjercicio,
} from '../../../services/ejerciciosService'
import { fetchEquipamientoMaestro } from '../../../services/gimnasiosService'

export function useEjercicios() {
  const [ejercicios, setEjercicios] = useState([])
  const [equipamiento, setEquipamiento] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  // selectedMuscles es un Set o Array con los nombres seleccionados. Vacío = todos.
  const [selectedMuscles, setSelectedMuscles] = useState([])

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [ejs, eq] = await Promise.all([
        fetchEjercicios(),
        fetchEquipamientoMaestro(),
      ])
      setEjercicios(ejs)
      setEquipamiento(eq)
    } catch (err) {
      setError(err.message || 'Error al cargar ejercicios')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const toggleMuscleFilter = (muscle) => {
    if (muscle === 'TODOS') {
      setSelectedMuscles([])
      return
    }
    setSelectedMuscles((prev) => {
      if (prev.includes(muscle)) {
        return prev.filter((m) => m !== muscle)
      } else {
        return [...prev, muscle]
      }
    })
  }

  const filteredEjercicios = useMemo(() => {
    return ejercicios.filter((ej) => {
      const matchSearch =
        !searchQuery.trim() ||
        ej.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ej.indicaciones && ej.indicaciones.toLowerCase().includes(searchQuery.toLowerCase()))

      const exerciseMuscles = (ej.grupo_muscular || '')
        .split(/[,/]/)
        .map((m) => m.trim().toUpperCase())
        .filter(Boolean)

      const matchMuscle =
        selectedMuscles.length === 0 ||
        selectedMuscles.some((sel) => exerciseMuscles.includes(sel.toUpperCase()))

      return matchSearch && matchMuscle
    })
  }, [ejercicios, searchQuery, selectedMuscles])

  const muscleGroups = useMemo(() => {
    const canonical = [
      'Pectorales',
      'Espalda',
      'Cuádriceps',
      'Isquiotibiales',
      'Hombros',
      'Bíceps',
      'Tríceps',
      'Core / Zona Media',
      'Glúteos',
      'Pantorrillas',
    ]
    const extracted = new Set(canonical)
    ejercicios.forEach((e) => {
      if (e.grupo_muscular) {
        e.grupo_muscular.split(/[,/]/).forEach((m) => {
          const clean = m.trim()
          if (clean) extracted.add(clean)
        })
      }
    })
    return ['TODOS', ...Array.from(extracted).sort()]
  }, [ejercicios])

  const handleSave = async (payload) => {
    const res = await saveEjercicio(payload)
    if (res.ok) {
      await reload()
    }
    return res
  }

  const handleDelete = async (id) => {
    const res = await removeEjercicio(id)
    if (res.ok) {
      await reload()
    }
    return res
  }

  return {
    ejercicios: filteredEjercicios,
    rawEjercicios: ejercicios,
    equipamiento,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedMuscles,
    toggleMuscleFilter,
    muscleGroups,
    reload,
    handleSave,
    handleDelete,
  }
}
