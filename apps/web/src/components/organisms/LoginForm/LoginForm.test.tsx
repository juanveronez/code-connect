import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { LoginForm } from './LoginForm'
import * as authApi from '../../../lib/api/auth'

vi.mock('../../../lib/api/auth')

describe('LoginForm', () => {
  it('shows validation error on empty submit', async () => {
    renderWithProviders(<LoginForm />)
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(await screen.findByText('Informe seu email')).toBeInTheDocument()
    expect(await screen.findByText('Informe sua senha')).toBeInTheDocument()
  })

  it('shows email format validation error on invalid email', async () => {
    renderWithProviders(<LoginForm />)
    await userEvent.type(screen.getByLabelText('Email'), 'notanemail')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(await screen.findByText('Email inválido')).toBeInTheDocument()
  })

  it('calls login with email and password on valid submit', async () => {
    vi.mocked(authApi.login).mockResolvedValue({ access_token: 'test-token' })
    renderWithProviders(<LoginForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'user@test.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(authApi.login).toHaveBeenCalledWith({ email: 'user@test.com', password: 'secret123' })
  })

  it('shows server error banner on 401', async () => {
    vi.mocked(authApi.login).mockRejectedValue({
      isAxiosError: true,
      response: { status: 401 },
    })
    renderWithProviders(<LoginForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'user@test.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Email ou senha inválidos')
  })

  it('disables button while pending', async () => {
    vi.mocked(authApi.login).mockImplementation(() => new Promise(() => {}))
    renderWithProviders(<LoginForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'user@test.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled()
  })
})
