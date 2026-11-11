// Anchored to REQ-TRN-001, REQ-TRN-002, REQ-TRN-003, REQ-TRN-004, REQ-TRN-005, REQ-TRN-007, REQ-TRN-010
import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { PlanillaEntrenamientoPage } from '@/features/training/components/PlanillaEntrenamientoPage'
import { AuthContext } from '@/features/auth/context/AuthContext'
import { mockAdapter } from '@/services/adapters/mockAdapter'

const mockAuthValue = {
  user: {
    id: 2,
    idPersona: 2,
    persona: { id: 2, nombre: 'Carlos', apellido: 'Benítez' },
    rol: 'alumno',
  },
  role: 'alumno',
  isAuthenticated: true,
  isLoading: false,
}

describe('PlanillaEntrenamientoPage UI Component', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockAdapter.resetMockDatabase()
  })

  test('renderiza la planilla de entrenamiento, ejercicios y celdas de serie', async () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <PlanillaEntrenamientoPage />
      </AuthContext.Provider>
    )

    await waitFor(() => {
      expect(screen.getByText(/Entrenamiento en Vivo/i)).toBeInTheDocument()
      expect(screen.getByText(/Press Plano con Mancuernas/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/Día 1 — Fuerza e Hipertrofia Tren Superior/i)).toBeInTheDocument()
    expect(screen.getByText(/Guardar Entrenamiento/i)).toBeInTheDocument()
  })

  test('abre el modal al tocar una celda de serie y actualiza el borrador local', async () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <PlanillaEntrenamientoPage />
      </AuthContext.Provider>
    )

    await waitFor(() => {
      expect(screen.getByText(/Press Plano con Mancuernas/i)).toBeInTheDocument()
    })

    const serieButtons = screen.getAllByRole('button', { name: /S1/i })
    expect(serieButtons.length).toBeGreaterThan(0)

    await userEvent.click(serieButtons[0])

    await waitFor(() => {
      expect(screen.getByText(/Reps Realizadas/i)).toBeInTheDocument()
      expect(screen.getByText(/Peso \(kg\)/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Confirmar/i })).toBeInTheDocument()
    })

    const weightInput = screen.getByLabelText(/Peso \(kg\)/i)
    await userEvent.clear(weightInput)
    await userEvent.type(weightInput, '45')

    const confirmBtn = screen.getByRole('button', { name: /Confirmar/i })
    await userEvent.click(confirmBtn)

    await waitFor(() => {
      expect(screen.getByText(/45kg/i)).toBeInTheDocument()
    })
  })

  test('presionar Guardar Entrenamiento realiza el commit batch y muestra alerta de éxito', async () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <PlanillaEntrenamientoPage />
      </AuthContext.Provider>
    )

    await waitFor(() => {
      expect(screen.getByText(/Press Plano con Mancuernas/i)).toBeInTheDocument()
    })

    const serieButtons = screen.getAllByRole('button', { name: /S1/i })
    await userEvent.click(serieButtons[0])

    const confirmBtn = await screen.findByRole('button', { name: /Confirmar/i })
    await userEvent.click(confirmBtn)

    await waitFor(() => {
      const saveBtn = screen.getByRole('button', { name: /Guardar Entrenamiento/i })
      expect(saveBtn).not.toBeDisabled()
    })

    const saveBtn = screen.getByRole('button', { name: /Guardar Entrenamiento/i })
    await userEvent.click(saveBtn)

    await waitFor(() => {
      expect(screen.getByText(/¡Entrenamiento guardado con éxito/i)).toBeInTheDocument()
    })
  })
})
