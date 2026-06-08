import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'

function Wrapper() {
  return (
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  )
}

describe('LoginForm', () => {
  it('shows validation errors on empty submit', async () => {
    render(<Wrapper />)
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(await screen.findByText('Informe seu email ou usuário')).toBeInTheDocument()
    expect(await screen.findByText('Informe sua senha')).toBeInTheDocument()
  })

  it('calls console.log with values on valid submit', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    render(<Wrapper />)

    await userEvent.type(screen.getByLabelText('Email ou usuário'), 'user@test.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(spy).toHaveBeenCalledWith({
      identifier: 'user@test.com',
      password: 'secret123',
      rememberMe: false,
    })
    spy.mockRestore()
  })
})
