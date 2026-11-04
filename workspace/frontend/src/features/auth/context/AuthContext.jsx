// Anchored to REQ-AUTH-006
import { createContext, useEffect, useState, useMemo } from 'react'
import { authService } from '@/services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const initSession = async () => {
      try {
        const current = await authService.getCurrentSession()
        if (isMounted && current) {
          setSession(current.session)
          setUser(current.user)
        }
      } catch (err) {
        console.error('Error inicializando sesión', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    initSession()

    const sub = authService.onAuthStateChange((event, newSession) => {
      if (!isMounted) return
      if (event === 'SIGN_OUT' || !newSession) {
        setSession(null)
        setUser(null)
      } else if (newSession) {
        setSession(newSession)
        setUser(newSession.user)
      }
    })

    return () => {
      isMounted = false
      if (sub?.unsubscribe) sub.unsubscribe()
    }
  }, [])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    if (res.ok) {
      setSession(res.session)
      setUser(res.user)
    }
    return res
  }

  const logout = async () => {
    await authService.logout()
    setSession(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      session,
      user,
      role: user?.rol || null,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [session, user, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { useAuth } from '../hooks/useAuth'
