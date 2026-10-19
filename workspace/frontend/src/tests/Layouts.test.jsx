// Anchored to REQ-AUTH-010, REQ-AUTH-011, REQ-AUTH-014
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProfesorLayout } from '@/app/layouts/ProfesorLayout'
import { AlumnoLayout } from '@/app/layouts/AlumnoLayout'
import * as AuthContextModule from '@/features/auth/context/AuthContext'

describe('Layouts Especializados por Rol', () => {
  it('REQ-AUTH-010: ProfesorLayout renderiza la barra de gestión, el badge y el sidebar del profesor', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        nombre: 'Leandro',
        apellido: 'Pirro',
        rol: 'profesor',
      },
      logout: vi.fn(),
    })

    render(
      <MemoryRouter>
        <ProfesorLayout theme="dark" onToggleTheme={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByText(/Prof. Leandro Pirro/i)).toBeInTheDocument()
    expect(screen.getByText('PROFESOR')).toBeInTheDocument()
    expect(screen.getByText('Panel Principal')).toBeInTheDocument()
    expect(screen.getByText('Gimnasios y Sede')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Salir/i })).toBeInTheDocument()
  })

  it('REQ-AUTH-011: AlumnoLayout renderiza saludo móvil, sede y barra inferior táctil (BottomNav)', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        nombre: 'Martín',
        apellido: 'Gómez',
        rol: 'alumno',
        nombre_gimnasio: 'Iron Temple Palermo',
      },
      logout: vi.fn(),
    })

    render(
      <MemoryRouter>
        <AlumnoLayout theme="dark" onToggleTheme={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByText(/Hola, Martín/i)).toBeInTheDocument()
    expect(screen.getByText('ALUMNO')).toBeInTheDocument()
    expect(screen.getByText('Iron Temple Palermo')).toBeInTheDocument()
    expect(screen.getByText('Entrenar')).toBeInTheDocument()
    expect(screen.getByText('Rutinas')).toBeInTheDocument()
    expect(screen.getByText('Historial')).toBeInTheDocument()
    expect(screen.getByText('Mi Perfil')).toBeInTheDocument()
  })
})
