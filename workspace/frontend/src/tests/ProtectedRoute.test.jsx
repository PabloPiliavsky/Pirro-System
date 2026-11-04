// Anchored to REQ-AUTH-007, REQ-AUTH-008, REQ-AUTH-014
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/app/routes/ProtectedRoute'
import * as AuthContextModule from '@/features/auth/context/AuthContext'

function renderWithRouter(initialEntry, authState, element) {
  vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue(authState)

  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<div>Vista de Login</div>} />
        <Route path="/profesor" element={<div>Home Profesor</div>} />
        <Route path="/alumno" element={<div>Home Alumno</div>} />
        <Route path="/unauthorized" element={<div>No Autorizado</div>} />
        <Route path="/test-profesor" element={element} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Guardia de Rutas Protegidas (ProtectedRoute)', () => {
  it('REQ-AUTH-006: Renderiza el indicador de carga mientras se verifica la sesión', () => {
    renderWithRouter(
      '/test-profesor',
      { isAuthenticated: false, isLoading: true, role: null },
      <ProtectedRoute allowedRoles={['profesor']}>
        <div>Contenido Secreto</div>
      </ProtectedRoute>
    )

    expect(screen.getByText(/Verificando credenciales/i)).toBeInTheDocument()
    expect(screen.queryByText('Contenido Secreto')).not.toBeInTheDocument()
  })

  it('REQ-AUTH-007: Redirige a /login cuando el usuario no está autenticado', () => {
    renderWithRouter(
      '/test-profesor',
      { isAuthenticated: false, isLoading: false, role: null },
      <ProtectedRoute allowedRoles={['profesor']}>
        <div>Contenido Secreto</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Vista de Login')).toBeInTheDocument()
    expect(screen.queryByText('Contenido Secreto')).not.toBeInTheDocument()
  })

  it('REQ-AUTH-008: Redirige a /alumno cuando un alumno intenta acceder a ruta de profesor', () => {
    renderWithRouter(
      '/test-profesor',
      {
        isAuthenticated: true,
        isLoading: false,
        role: 'alumno',
        user: { rol: 'alumno' },
      },
      <ProtectedRoute allowedRoles={['profesor']}>
        <div>Contenido Secreto</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Home Alumno')).toBeInTheDocument()
    expect(screen.queryByText('Contenido Secreto')).not.toBeInTheDocument()
  })

  it('REQ-AUTH-008: Permite el acceso cuando el rol del usuario coincide con allowedRoles', () => {
    renderWithRouter(
      '/test-profesor',
      {
        isAuthenticated: true,
        isLoading: false,
        role: 'profesor',
        user: { rol: 'profesor' },
      },
      <ProtectedRoute allowedRoles={['profesor']}>
        <div>Contenido Secreto</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Contenido Secreto')).toBeInTheDocument()
  })
})
