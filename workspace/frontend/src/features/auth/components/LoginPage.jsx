// Anchored to REQ-AUTH-001, REQ-AUTH-006, REQ-AUTH-009
import { useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { LoginForm } from './LoginForm'
import { LoginBrandingHeader } from './LoginBrandingHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Moon, Sun } from 'lucide-react'
import { VStack } from '@/components/ui/VStack'

export function LoginPage({ theme, onToggleTheme }) {
  const { isAuthenticated, role, login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  if (isAuthenticated && role) {
    const destination = location.state?.from?.pathname || (role === 'profesor' ? '/profesor' : '/alumno')
    return <Navigate to={destination} replace />
  }

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

  return (
    <VStack
      justify="center"
      align="center"
      className="min-h-screen px-4 py-8 bg-background relative overflow-hidden"
    >
      {onToggleTheme && (
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Alternar tema"
          className="absolute top-4 right-4 p-2.5 rounded-full border border-border bg-card text-foreground hover:bg-secondary cursor-pointer transition-colors"
        >
          {theme === 'dark' ? <Sun className="size-4 text-primary" /> : <Moon className="size-4 text-primary" />}
        </button>
      )}

      <VStack className="w-full max-w-md gap-6">
        <LoginBrandingHeader />

        <Card className="border-border bg-card/90 shadow-xl backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Ingresar a tu Cuenta</CardTitle>
            <CardDescription className="text-xs">
              Ingresá con tu email o nombre de usuario registrado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm
              onSubmit={handleLogin}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
            />
          </CardContent>
        </Card>
      </VStack>
    </VStack>
  )
}

export default LoginPage
