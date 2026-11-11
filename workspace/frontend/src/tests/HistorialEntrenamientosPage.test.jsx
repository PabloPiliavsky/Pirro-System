// Anchored to REQ-TRN-009, REQ-TRN-010
import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { HistorialEntrenamientosPage } from '@/features/training/components/HistorialEntrenamientosPage'
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

describe('HistorialEntrenamientosPage UI Component', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockAdapter.resetMockDatabase()
  })

  test('renderiza el historial de entrenamientos y permite expandir el detalle de series', async () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <HistorialEntrenamientosPage />
      </AuthContext.Provider>
    )

    await waitFor(() => {
      expect(screen.getByText(/Historial de Sesiones/i)).toBeInTheDocument()
      expect(screen.getByText(/2026-10-06/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/6 series/i)).toBeInTheDocument()

    // Expandir detalle
    const sessionCardHeader = screen.getByText(/2026-10-06/i)
    await userEvent.click(sessionCardHeader)

    await waitFor(() => {
      expect(screen.getByText(/Muy firme el primer set/i)).toBeInTheDocument()
      expect(screen.getByText(/Subí a mancuernas de 32.5kg/i)).toBeInTheDocument()
    })
  })
})
