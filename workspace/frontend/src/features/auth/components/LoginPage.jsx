// Anchored to REQ-AUTH-001, REQ-AUTH-006, REQ-AUTH-009
import { useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { LoginForm } from './LoginForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dumbbell, Moon, Sun } from 'lucide-react'

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

  async function handleLogin(credentials) {
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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-background relative overflow-hidden">
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

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 border border-primary/30 text-primary shadow-lg shadow-primary/10 mb-1">
            <Dumbbell className="size-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">
            Pirro <span className="text-primary font-bold">System</span>
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            Entrenamiento de Alto Rendimiento
          </p>
        </div>

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
      </div>
    </div>
  )
}

export default LoginPage
