// Anchored to REQ-AUTH-001, REQ-AUTH-003, REQ-AUTH-012, REQ-AUTH-014
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/features/auth/components/LoginForm'

describe('Formulario de Login Unificado (LoginForm)', () => {
  it('REQ-AUTH-001: Renderiza campos unificados de identificador y contraseña', () => {
    render(<LoginForm onSubmit={vi.fn()} isSubmitting={false} errorMessage="" />)

    expect(screen.getByPlaceholderText(/ej. leandro.pirro o tu@email.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument()
  })

  it('REQ-AUTH-001: Envía las credenciales correctamente cuando el usuario completa el formulario', async () => {
    const handleSubmit = vi.fn()
    const user = userEvent.setup()

    render(<LoginForm onSubmit={handleSubmit} isSubmitting={false} errorMessage="" />)

    const idInput = screen.getByPlaceholderText(/ej. leandro.pirro o tu@email.com/i)
    const passInput = screen.getByPlaceholderText('••••••••')
    const submitBtn = screen.getByRole('button', { name: /Iniciar Sesión/i })

    await user.type(idInput, 'leandro.pirro')
    await user.type(passInput, 'demo123')
    await user.click(submitBtn)

    expect(handleSubmit).toHaveBeenCalledWith({
      identifier: 'leandro.pirro',
      password: 'demo123',
    })
  })

  it('REQ-AUTH-003 / REQ-AUTH-004: Muestra mensaje de error cuando se le pasa errorMessage', () => {
    render(
      <LoginForm
        onSubmit={vi.fn()}
        isSubmitting={false}
        errorMessage="Usuario o contraseña incorrectos."
      />
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Usuario o contraseña incorrectos.')).toBeInTheDocument()
  })

  it('REQ-AUTH-012: Permite iniciar sesión directa mediante los botones de acceso rápido de desarrollo', async () => {
    const handleSubmit = vi.fn()
    render(<LoginForm onSubmit={handleSubmit} isSubmitting={false} errorMessage="" />)

    const quickBtn = screen.getByRole('button', { name: /Prof. Leandro Pirro/i })
    expect(quickBtn).toBeInTheDocument()

    fireEvent.click(quickBtn)

    expect(handleSubmit).toHaveBeenCalledWith({
      identifier: 'leandro.pirro',
      password: 'demo123',
    })
  })
})
