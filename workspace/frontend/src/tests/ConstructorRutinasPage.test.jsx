// Anchored to REQ-RUT-008, REQ-RUT-010, REQ-RUT-012
import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { ConstructorRutinasPage } from '@/features/rutinas/components/ConstructorRutinasPage'
import { mockAdapter } from '@/services/adapters/mockAdapter'

describe('ConstructorRutinasPage UI Component', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockAdapter.resetMockDatabase()
  })

  test('renderiza el constructor, permite seleccionar alumno y muestra pestañas de días', async () => {
    render(<ConstructorRutinasPage />)

    expect(screen.getByRole('heading', { name: /Constructor de Rutinas/i })).toBeInTheDocument()
    expect(screen.getByText(/Ningún alumno seleccionado/i)).toBeInTheDocument()

    const select = await screen.findByRole('combobox')
    expect(select).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/Martín Gómez/i)).toBeInTheDocument()
    })

    await userEvent.selectOptions(select, '2')

    await waitFor(() => {
      expect(screen.getAllByText(/Iron Temple Palermo/i).length).toBeGreaterThan(0)
      expect(screen.getByText(/3 Días \/ Sem/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Ver Ficha Médica/i })).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /Día 1/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Día 2/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Día 3/i })).toBeInTheDocument()
  })

  test('abre catálogo, agrega ejercicio y guarda la rutina del día', async () => {
    render(<ConstructorRutinasPage />)

    const select = await screen.findByRole('combobox')
    await userEvent.selectOptions(select, '2')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Día 1/i })).toBeInTheDocument()
    })

    const agregarBtn = screen.getByRole('button', { name: /Agregar Ejercicio/i })
    await userEvent.click(agregarBtn)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Catálogo de Ejercicios/i })).toBeInTheDocument()
    })

    const botonesAgregar = screen.getAllByRole('button', { name: /\+ Agregar/i })
    expect(botonesAgregar.length).toBeGreaterThan(0)
    await userEvent.click(botonesAgregar[0])

    const cerrarModalBtn = screen.getByRole('button', { name: /Listo/i })
    await userEvent.click(cerrarModalBtn)

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Catálogo de Ejercicios/i })).not.toBeInTheDocument()
    })

    const guardarBtn = screen.getByRole('button', { name: /Guardar Día/i })
    await userEvent.click(guardarBtn)

    await waitFor(() => {
      expect(screen.getByText(/Rutina guardada correctamente/i)).toBeInTheDocument()
    })
  })
})
