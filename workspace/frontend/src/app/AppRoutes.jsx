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
import { FeaturePlaceholder } from './layouts/FeaturePlaceholder'
import { FoundationDashboard } from '@/features/foundation/components/FoundationDashboard'

const PROFESOR_MODULES = [
  { path: 'gimnasios', title: 'Gimnasios y Equipamiento', desc: 'Administración de sedes y maquinaria', spec: 'specs/003-gimnasios-y-ejercicios' },
  { path: 'ejercicios', title: 'Catálogo de Ejercicios', desc: 'Movimientos, grupos musculares y requerimientos', spec: 'specs/003-gimnasios-y-ejercicios' },
  { path: 'alumnos', title: 'Gestión de Alumnos', desc: 'Altas, fichas físicas y seguimiento', spec: 'specs/004-gestion-alumnos' },
  { path: 'rutinas', title: 'Constructor de Rutinas', desc: 'Planificación semanal por día', spec: 'specs/005-constructor-rutinas' },
  { path: 'progreso', title: 'Progreso y Reportes Excel', desc: 'Evolución de cargas y exportación .xlsx', spec: 'specs/007-progreso-y-exportacion-excel' },
]

const ALUMNO_MODULES = [
  { path: 'rutinas', title: 'Rutinas Asignadas', desc: 'Tus días y ejercicios de la semana', spec: 'specs/006-planilla-entrenamiento-alumno' },
  { path: 'historial', title: 'Historial de Entrenamientos', desc: 'Consultá tus pesos y repeticiones previas', spec: 'specs/006-planilla-entrenamiento-alumno' },
  { path: 'perfil', title: 'Mi Ficha', desc: 'Datos personales, gimnasio y profesor', spec: 'specs/004-gestion-alumnos' },
]

export function AppRoutes({ theme, onToggleTheme, refreshToken }) {
  const { role, isAuthenticated } = useAuth()

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
        {PROFESOR_MODULES.map((m) => (
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
