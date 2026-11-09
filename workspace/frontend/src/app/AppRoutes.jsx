// Anchored to REQ-AUTH-006, REQ-AUTH-007, REQ-AUTH-008, REQ-AUTH-009, REQ-AUTH-010, REQ-AUTH-011
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { LoginPage } from '@/features/auth/components/LoginPage'
import { UnauthorizedPage } from '@/features/auth/pages/UnauthorizedPage'
import { ProfesorLayout } from './layouts/ProfesorLayout'
import { AlumnoLayout } from './layouts/AlumnoLayout'
import { ProfesorHome } from '@/features/auth/pages/ProfesorHome'
import { AlumnoHome } from '@/features/auth/pages/AlumnoHome'
import { GimnasiosPage } from '@/features/gimnasios/components/GimnasiosPage'
import { EjerciciosPage } from '@/features/ejercicios/components/EjerciciosPage'
import { AlumnosPage } from '@/features/alumnos/components/AlumnosPage'
import { AlumnoPerfilPage } from '@/features/alumnos/components/AlumnoPerfilPage'
import { FeaturePlaceholder } from './layouts/FeaturePlaceholder'
import { FoundationDashboard } from '@/features/foundation/components/FoundationDashboard'
import { VStack } from '@/components/ui/VStack'

const PROFESOR_PLACEHOLDER_MODULES = [
  { path: 'rutinas', title: 'Constructor de Rutinas', desc: 'Planificación semanal por día', spec: 'specs/005-constructor-rutinas' },
  { path: 'progreso', title: 'Progreso y Reportes Excel', desc: 'Evolución de cargas y exportación .xlsx', spec: 'specs/007-progreso-y-exportacion-excel' },
]

const ALUMNO_MODULES = [
  { path: 'rutinas', title: 'Rutinas Asignadas', desc: 'Tus días y ejercicios de la semana', spec: 'specs/006-planilla-entrenamiento-alumno' },
  { path: 'historial', title: 'Historial de Entrenamientos', desc: 'Consultá tus pesos y repeticiones previas', spec: 'specs/006-planilla-entrenamiento-alumno' },
]

export function AppRoutes({ theme, onToggleTheme, refreshToken }) {
  const { role, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <VStack justify="center" align="center" className="min-h-screen bg-background text-foreground">
        <VStack align="center" className="gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm font-medium text-muted-foreground tracking-wide">
            Cargando aplicación...
          </span>
        </VStack>
      </VStack>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage theme={theme} onToggleTheme={onToggleTheme} />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Rutas Protegidas del Profesor */}
      <Route
        path="/profesor"
        element={
          <ProtectedRoute allowedRoles={['profesor']}>
            <ProfesorLayout theme={theme} onToggleTheme={onToggleTheme} />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfesorHome />} />
        <Route path="alumnos" element={<AlumnosPage />} />
        <Route path="gimnasios" element={<GimnasiosPage />} />
        <Route path="ejercicios" element={<EjerciciosPage />} />
        {PROFESOR_PLACEHOLDER_MODULES.map((m) => (
          <Route
            key={m.path}
            path={m.path}
            element={<FeaturePlaceholder title={m.title} description={m.desc} specNumber={m.spec} />}
          />
        ))}
        <Route
          path="laboratorio"
          element={
            <FoundationDashboard theme={theme} onToggleTheme={onToggleTheme} refreshToken={refreshToken} />
          }
        />
      </Route>

      {/* Rutas Protegidas del Alumno */}
      <Route
        path="/alumno"
        element={
          <ProtectedRoute allowedRoles={['alumno']}>
            <AlumnoLayout theme={theme} onToggleTheme={onToggleTheme} />
          </ProtectedRoute>
        }
      >
        <Route index element={<AlumnoHome />} />
        <Route path="perfil" element={<AlumnoPerfilPage />} />
        {ALUMNO_MODULES.map((m) => (
          <Route
            key={m.path}
            path={m.path}
            element={<FeaturePlaceholder title={m.title} description={m.desc} specNumber={m.spec} />}
          />
        ))}
      </Route>

      {/* Redirección por defecto */}
      <Route
        path="*"
        element={
          <Navigate
            to={!isAuthenticated ? '/login' : role === 'profesor' ? '/profesor' : '/alumno'}
            replace
          />
        }
      />
    </Routes>
  )
}

export default AppRoutes
