// Anchored to REQ-AUTH-007, REQ-AUTH-008
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'

export function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, role, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm font-medium text-muted-foreground tracking-wide">
            Verificando credenciales...
          </span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const destination = role === 'profesor' ? '/profesor' : '/alumno'
    return <Navigate to={destination} replace />
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute
