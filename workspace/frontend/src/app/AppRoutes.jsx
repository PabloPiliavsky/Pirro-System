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

export function AppRoutes({ theme, onToggleTheme, refreshToken }) {
  const { role, isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage theme={theme} onToggleTheme={onToggleTheme} />}
      />
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
        <Route
          path="gimnasios"
          element={
            <FeaturePlaceholder
              title="Gimnasios y Equipamiento"
              description="Administración de sedes y maquinaria"
              specNumber="specs/003-gimnasios-y-ejercicios"
            />
          }
        />
        <Route
          path="ejercicios"
          element={
            <FeaturePlaceholder
              title="Catálogo de Ejercicios"
              description="Movimientos, grupos musculares y requerimientos"
              specNumber="specs/003-gimnasios-y-ejercicios"
            />
          }
        />
        <Route
          path="alumnos"
          element={
            <FeaturePlaceholder
              title="Gestión de Alumnos"
              description="Altas, fichas físicas y seguimiento"
              specNumber="specs/004-gestion-alumnos"
            />
          }
        />
        <Route
          path="rutinas"
          element={
            <FeaturePlaceholder
              title="Constructor de Rutinas"
              description="Planificación semanal por día"
              specNumber="specs/005-constructor-rutinas"
            />
          }
        />
        <Route
          path="progreso"
          element={
            <FeaturePlaceholder
              title="Progreso y Reportes Excel"
              description="Evolución de cargas y exportación .xlsx"
              specNumber="specs/007-progreso-y-exportacion-excel"
            />
          }
        />
        <Route
          path="laboratorio"
          element={
            <FoundationDashboard
              theme={theme}
              onToggleTheme={onToggleTheme}
              refreshToken={refreshToken}
            />
          }
        />
      </Route>

      {/* Rutas Protegidas del Alumno (100% Mobile-First) */}
      <Route
        path="/alumno"
        element={
          <ProtectedRoute allowedRoles={['alumno']}>
            <AlumnoLayout theme={theme} onToggleTheme={onToggleTheme} />
          </ProtectedRoute>
        }
      >
        <Route index element={<AlumnoHome />} />
        <Route
          path="rutinas"
          element={
            <FeaturePlaceholder
              title="Rutinas Asignadas"
              description="Tus días y ejercicios de la semana"
              specNumber="specs/006-planilla-entrenamiento-alumno"
            />
          }
        />
        <Route
          path="historial"
          element={
            <FeaturePlaceholder
              title="Historial de Entrenamientos"
              description="Consultá tus pesos y repeticiones previas"
              specNumber="specs/006-planilla-entrenamiento-alumno"
            />
          }
        />
        <Route
          path="perfil"
          element={
            <FeaturePlaceholder
              title="Mi Ficha"
              description="Datos personales, gimnasio y profesor"
              specNumber="specs/004-gestion-alumnos"
            />
          }
        />
      </Route>

      {/* Redirección por defecto */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              !isAuthenticated
                ? '/login'
                : role === 'profesor'
                  ? '/profesor'
                  : '/alumno'
            }
            replace
          />
        }
      />
    </Routes>
  )
}

export default AppRoutes
