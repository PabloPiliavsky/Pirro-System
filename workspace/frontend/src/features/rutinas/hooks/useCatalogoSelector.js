// Anchored to REQ-RUT-009
import { useState, useEffect, useMemo, useCallback } from 'react'
import { fetchEjercicios } from '../../../services/ejerciciosService'

export const GRUPOS_MUSCULARES = [
  'Todos',
  'Pecho',
  'Espalda',
  'Piernas',
  'Hombros',
  'Brazos',
  'Core',
]

export function useCatalogoSelector() {
  const [ejercicios, setEjercicios] = useState([])
  const [loading, setLoading] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [grupoSeleccionado, setGrupoSeleccionado] = useState('Todos')

  const loadEjercicios = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchEjercicios()
      const activos = (data || []).filter((e) => e.estado !== false)
      setEjercicios(activos)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEjercicios()
  }, [loadEjercicios])

  const ejerciciosFiltrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase()
    return ejercicios.filter((ej) => {
      const matchGrupo =
        grupoSeleccionado === 'Todos' ||
        ej.grupo_muscular?.toLowerCase() === grupoSeleccionado.toLowerCase()
      const matchTexto =
        !term ||
        ej.nombre?.toLowerCase().includes(term) ||
        ej.indicaciones?.toLowerCase().includes(term)
      return matchGrupo && matchTexto
    })
  }, [ejercicios, busqueda, grupoSeleccionado])

  return {
    ejercicios,
    ejerciciosFiltrados,
    loading,
    busqueda,
    setBusqueda,
    grupoSeleccionado,
    setGrupoSeleccionado,
    grupos: GRUPOS_MUSCULARES,
    reload: loadEjercicios,
  }
}
