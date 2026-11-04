// Anchored to REQ-AUTH-001, REQ-AUTH-006, REQ-AUTH-009
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

export function useLoginFlow() {
  const { isAuthenticated, role, login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const destination =
    isAuthenticated && role
      ? location.state?.from?.pathname || (role === 'profesor' ? '/profesor' : '/alumno')
      : null

  const handleLogin = async (credentials) => {
    setIsSubmitting(true)
    setErrorMessage('')
    try {
      const result = await login(credentials)
      if (!result.ok) {
        setErrorMessage(result.error?.message || 'Error al iniciar sesión')
        return
      }
      const target = result.user?.rol === 'profesor' ? '/profesor' : '/alumno'
      navigate(target, { replace: true })
    } catch {
      setErrorMessage('Ocurrió un error inesperado de conexión.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    destination,
    isSubmitting,
    errorMessage,
    handleLogin,
  }
}
