// Anchored to REQ-GYM-006, REQ-GYM-009
import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { GimnasiosPage } from '@/features/gimnasios/components/GimnasiosPage'
import { mockAdapter } from '@/services/adapters/mockAdapter'

describe('GimnasiosPage UI Component', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockAdapter.resetMockDatabase()
  })

  test('renderiza el título, las sedes existentes y abre el modal de nueva sede', async () => {
    render(<GimnasiosPage />)

    expect(screen.getByText(/Cargando sedes y equipamiento/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/Sedes y Gimnasios/i)).toBeInTheDocument()
      expect(screen.getByText(/Iron Temple Palermo/i)).toBeInTheDocument()
    })

    const newBtn = screen.getByRole('button', { name: /\+ Nueva Sede/i })
    await userEvent.click(newBtn)

    expect(screen.getByRole('heading', { name: /Nueva Sede/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Ej: Sede Central/i)).toBeInTheDocument()
  })
})
