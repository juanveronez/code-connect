import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { RegisterForm } from './RegisterForm'
import * as authApi from '../../../lib/api/auth'

vi.mock('../../../lib/api/auth')

describe('RegisterForm', () => {
  it('shows validation errors on empty submit', async () => {
    renderWithProviders(<RegisterForm />)
    await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))
    expect(await screen.findByText('Informe seu nome')).toBeInTheDocument()
    expect(await screen.findByText('Informe seu email')).toBeInTheDocument()
    expect(await screen.findByText('A senha deve ter no mínimo 6 caracteres')).toBeInTheDocument()
  })

  it('calls register with name, email and password (no rememberMe) on valid submit', async () => {
    vi.mocked(authApi.register).mockResolvedValue({ id: '1', name: 'João Silva', email: 'joao@test.com' })
    renderWithProviders(<RegisterForm />)

    await userEvent.type(screen.getByLabelText('Nome'), 'João Silva')
    await userEvent.type(screen.getByLabelText('Email'), 'joao@test.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'senha123')
    await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(authApi.register).toHaveBeenCalledWith({
      name: 'João Silva',
      email: 'joao@test.com',
      password: 'senha123',
    })
  })

  it('shows server error banner on 409 (email already in use)', async () => {
    vi.mocked(authApi.register).mockRejectedValue({
      isAxiosError: true,
      response: { status: 409 },
    })
    renderWithProviders(<RegisterForm />)

    await userEvent.type(screen.getByLabelText('Nome'), 'João Silva')
    await userEvent.type(screen.getByLabelText('Email'), 'existing@test.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'senha123')
    await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Este email já está em uso')
  })

  it('disables button while pending', async () => {
    vi.mocked(authApi.register).mockImplementation(() => new Promise(() => {}))
    renderWithProviders(<RegisterForm />)

    await userEvent.type(screen.getByLabelText('Nome'), 'João Silva')
    await userEvent.type(screen.getByLabelText('Email'), 'joao@test.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'senha123')
    await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(screen.getByRole('button', { name: /cadastrando/i })).toBeDisabled()
  })
})
