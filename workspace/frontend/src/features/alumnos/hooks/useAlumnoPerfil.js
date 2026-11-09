// Anchored to REQ-ALU-009
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { fetchMiPerfilAlumno } from '../../../services/alumnosService'

export function useAlumnoPerfil() {
  const { user } = useAuth()
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const personaId = user?.persona?.id || 2
      const data = await fetchMiPerfilAlumno(personaId)
      setPerfil(data)
    } catch (err) {
      setError(err.message || 'Error al cargar tu ficha personal')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    reload()
  }, [reload])

  return { perfil, loading, error, reload }
}
