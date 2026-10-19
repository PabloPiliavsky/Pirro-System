import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { FoundationDashboard } from '@/features/foundation/components/FoundationDashboard'
import { DevDataToolbar } from '@/components/dev/DevDataToolbar'

function FoundationTestWrapper() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <FoundationDashboard theme="dark" refreshToken={0} />
      <DevDataToolbar />
    </div>
  )
}

describe('Tablero Fundacional y DevDataToolbar (UI Integration)', () => {
  test('REQ-FND-014: Renderiza los alumnos semilla, el laboratorio Offline-First y la píldora DEV colapsable', async () => {
    render(<FoundationTestWrapper />)

    await waitFor(() => {
      expect(screen.getAllByText(/Martín Gómez/i).length).toBeGreaterThan(0)
      expect(screen.getByText(/Lucía Fernández/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/DEV: MOCK LOCAL/i)).toBeInTheDocument()

    const addSerieBtn = screen.getByRole('button', { name: /Cargar Serie en LocalStorage/i })
    fireEvent.click(addSerieBtn)

    expect(screen.getByText(/S1: 10 reps @ 32.5kg/i)).toBeInTheDocument()

    const saveBatchBtn = screen.getByRole('button', { name: /Guardar Entrenamiento \(Batch\)/i })
    fireEvent.click(saveBatchBtn)

    await waitFor(() => {
      expect(screen.getByText(/Transacción Batch Confirmada/i)).toBeInTheDocument()
    })
  })

  test('REQ-FND-014: Permite expandir el DevDataToolbar y restaurar la semilla Mock', async () => {
    render(<FoundationTestWrapper />)

    const devPill = screen.getByRole('button', { name: /DEV: MOCK LOCAL/i })
    fireEvent.click(devPill)

    const restoreBtn = screen.getByRole('button', { name: /Restaurar Semilla/i })
    fireEvent.click(restoreBtn)

    await waitFor(() => {
      expect(screen.getByText(/Semilla restaurada/i)).toBeInTheDocument()
    })
  })
})
