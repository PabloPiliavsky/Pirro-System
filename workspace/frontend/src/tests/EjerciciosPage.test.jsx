// Anchored to REQ-EJE-006, REQ-GYM-009
import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { EjerciciosPage } from '@/features/ejercicios/components/EjerciciosPage'
import { mockAdapter } from '@/services/adapters/mockAdapter'

describe('EjerciciosPage UI Component', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockAdapter.resetMockDatabase()
  })

  test('renderiza el catálogo, filtra por texto y abre modal de nuevo ejercicio', async () => {
    render(<EjerciciosPage />)

    expect(screen.getByText(/Cargando catálogo de ejercicios/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Ejercicios/i)).toBeInTheDocument()
      expect(screen.getByText(/Press Plano con Mancuernas/i)).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Buscar por nombre o indicación/i)
    await userEvent.type(searchInput, 'Sentadilla')

    await waitFor(() => {
      expect(screen.getByText(/Sentadilla Libre con Barra/i)).toBeInTheDocument()
      expect(screen.queryByText(/Press Plano con Mancuernas/i)).not.toBeInTheDocument()
    })

    const newBtn = screen.getByRole('button', { name: /\+ Nuevo Ejercicio/i })
    await userEvent.click(newBtn)

    expect(screen.getByRole('heading', { name: /Nuevo Ejercicio/i })).toBeInTheDocument()
  })
})
