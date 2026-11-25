// Anchored to REQ-PRG-002, REQ-PRG-004, REQ-PRG-006, REQ-PRG-007, REQ-PRG-009
import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { ProgresoExcelPage } from '@/features/progreso-excel/components/ProgresoExcelPage'
import { mockAdapter } from '@/services/adapters/mockAdapter'
import { buildDefaultMonthRange, isoToDmy } from '@/features/progreso-excel/utils/progresoFilters'

describe('ProgresoExcelPage UI Component', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockAdapter.resetMockDatabase()
  })

  test('REQ-PRG-006: renderiza el rango predeterminado de 1 mes desde la fecha actual en dd/mm/yyyy y al limpiar/aplicar muestra sesiones y tabla', async () => {
    render(<ProgresoExcelPage />)

    const expectedRange = buildDefaultMonthRange()
    await waitFor(() => {
      expect(screen.getByText(/Progreso de Cargas y Exportación Excel/i)).toBeInTheDocument()
      expect(screen.getByLabelText('Fecha Desde').value).toBe(isoToDmy(expectedRange.fechaDesde))
      expect(screen.getByLabelText('Fecha Hasta').value).toBe(isoToDmy(expectedRange.fechaHasta))
    })

    // Limpiar el filtro de fechas para incluir entrenamientos de meses anteriores (octubre 2026)
    const btnLimpiar = screen.getByRole('button', { name: /Limpiar filtros/i })
    await userEvent.click(btnLimpiar)

    await waitFor(() => {
      expect(screen.getByTestId('progreso-sesiones-view')).toBeInTheDocument()
    })

    expect(screen.getByText(/S1: 10r × 30kg/i)).toBeInTheDocument()

    // Alternar a Vista Tabla de Series
    const btnTabla = screen.getByRole('button', { name: /Tabla de Series/i })
    await userEvent.click(btnTabla)

    await waitFor(() => {
      expect(screen.getByTestId('progreso-tabla-view')).toBeInTheDocument()
    })
    expect(screen.getByText(/Muy firme el primer set/i)).toBeInTheDocument()
  })

  test('REQ-PRG-002: muestra solo alumnos activos por defecto e incluye inactivos al marcar la pregunta', async () => {
    await mockAdapter.cambiarEstadoAlumno(3, false)
    render(<ProgresoExcelPage />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Seleccionar alumno/i)).toBeInTheDocument()
    })

    const select = screen.getByLabelText(/Seleccionar alumno/i)
    expect(select.innerHTML).not.toContain('Lucía Fernández')

    const checkboxInactivos = screen.getByLabelText(/¿Incluir alumnos dados de baja \(inactivos\)\?/i)
    await userEvent.click(checkboxInactivos)

    await waitFor(() => {
      expect(select.innerHTML).toContain('Lucía Fernández (Inactivo)')
    })
  })

  test('REQ-PRG-004, REQ-PRG-009: aplica los filtros recién al presionar Aplicar Filtros y permite elegir hojas y columnas en Excel', async () => {
    render(<ProgresoExcelPage />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Filtrar por ejercicio/i)).toBeInTheDocument()
    })

    // Limpiar rango de fechas para ver todas las sesiones históricas
    const btnLimpiar = screen.getByRole('button', { name: /Limpiar filtros/i })
    await userEvent.click(btnLimpiar)

    await waitFor(() => {
      expect(screen.getByTestId('progreso-sesiones-view')).toBeInTheDocument()
    })

    // Cambiar ejercicio en borrador: aún no filtra hasta tocar "Aplicar Filtros"
    const selectEjercicio = screen.getByLabelText(/Filtrar por ejercicio/i)
    await userEvent.selectOptions(selectEjercicio, '2')
    expect(screen.getByText(/S1: 10r × 30kg/i)).toBeInTheDocument()

    // Presionar "Aplicar Filtros"
    const btnAplicar = screen.getByRole('button', { name: /Aplicar Filtros/i })
    await userEvent.click(btnAplicar)

    await waitFor(() => {
      expect(screen.getByText(/S1: 12r × 65kg/i)).toBeInTheDocument()
      expect(screen.queryByText(/S1: 10r × 30kg/i)).not.toBeInTheDocument()
    })

    // Abrir modal de exportación Excel
    const btnExport = screen.getByRole('button', { name: /Exportar Excel \(\.xlsx\)/i })
    await userEvent.click(btnExport)

    expect(screen.getByRole('dialog', { name: /Configurar exportación a Excel/i })).toBeInTheDocument()

    // Excluir Hoja 2 (Rutinas Semanales) y desmarcar una columna de Hoja 1
    const toggleHoja2 = screen.getByLabelText(/Incluir Hoja 2: Rutinas Semanales/i)
    await userEvent.click(toggleHoja2)

    const colCheckbox = screen.getByLabelText(/Salud\/Enfermedades/i)
    await userEvent.click(colCheckbox)

    const btnDescargar = screen.getByRole('button', { name: /Descargar Archivo \.xlsx/i })
    await userEvent.click(btnDescargar)

    expect(screen.getByRole('status')).toHaveTextContent(/Pirro_Alumno_Martin_Gomez/i)
  })
})
