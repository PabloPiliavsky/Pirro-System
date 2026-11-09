// Anchored to REQ-ALU-006, REQ-ALU-007, REQ-ALU-008, REQ-ALU-012
import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { AlumnosPage } from '@/features/alumnos/components/AlumnosPage'
import { mockAdapter } from '@/services/adapters/mockAdapter'

describe('AlumnosPage UI Component', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockAdapter.resetMockDatabase()
  })

  test('REQ-ALU-007: renderiza la lista de alumnos y permite buscar en tiempo real', async () => {
    render(<AlumnosPage />)

    expect(screen.getByText(/Cargando alumnos/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/Gestión de Alumnos/i)).toBeInTheDocument()
      expect(screen.getByText(/Martín Gómez/i)).toBeInTheDocument()
      expect(screen.getByText(/Lucía Fernández/i)).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Buscar por nombre/i)
    await userEvent.type(searchInput, 'Martín')

    expect(screen.getByText(/Martín Gómez/i)).toBeInTheDocument()
    expect(screen.queryByText(/Lucía Fernández/i)).not.toBeInTheDocument()
  })

  test('REQ-ALU-007, REQ-ALU-002: abre el modal de Nuevo Alumno al presionar el botón', async () => {
    render(<AlumnosPage />)

    await waitFor(() => {
      expect(screen.getByText(/Gestión de Alumnos/i)).toBeInTheDocument()
    })

    const createBtn = screen.getByRole('button', { name: /\+ Nuevo Alumno/i })
    await userEvent.click(createBtn)

    expect(screen.getByRole('heading', { name: /Nuevo Alumno/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Ej: Martín/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/alumno@ejemplo.com/i)).toBeInTheDocument()
  })

  test('REQ-ALU-008: abre el modal de Ficha Médica al hacer clic en la tarjeta del alumno', async () => {
    render(<AlumnosPage />)

    await waitFor(() => {
      expect(screen.getByText(/Martín Gómez/i)).toBeInTheDocument()
    })

    const cardButton = screen.getByRole('button', {
      name: /Ver ficha médica de Martín Gómez/i,
    })
    await userEvent.click(cardButton)

    expect(screen.getByRole('heading', { name: /Ficha Física y Médica/i })).toBeInTheDocument()
    expect(screen.getByText(/Cerrar Ficha/i)).toBeInTheDocument()
  })

  test('REQ-ALU-006: el botón de baja abre el modal de confirmación antes de desactivar', async () => {
    render(<AlumnosPage />)

    await waitFor(() => {
      expect(screen.getByText(/Martín Gómez/i)).toBeInTheDocument()
    })

    const bajaBtns = screen.getAllByRole('button', { name: /Baja/i })
    await userEvent.click(bajaBtns[0])

    expect(screen.getByRole('heading', { name: /Confirmar Baja de Alumno/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sí, dar de baja/i })).toBeInTheDocument()
  })
})
