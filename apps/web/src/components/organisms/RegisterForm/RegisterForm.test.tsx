import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { RegisterForm } from './RegisterForm'

function Wrapper() {
  return (
    <MemoryRouter>
      <RegisterForm />
    </MemoryRouter>
  )
}

describe('RegisterForm', () => {
  it('shows validation errors on empty submit', async () => {
    render(<Wrapper />)
    await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))
    expect(await screen.findByText('Informe seu nome')).toBeInTheDocument()
    expect(await screen.findByText('Informe seu email')).toBeInTheDocument()
    expect(await screen.findByText('A senha deve ter no mínimo 6 caracteres')).toBeInTheDocument()
  })

  it('calls console.log with values on valid submit', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    render(<Wrapper />)

    await userEvent.type(screen.getByLabelText('Nome'), 'João Silva')
    await userEvent.type(screen.getByLabelText('Email'), 'joao@test.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'senha123')
    await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(spy).toHaveBeenCalledWith({
      name: 'João Silva',
      email: 'joao@test.com',
      password: 'senha123',
      rememberMe: false,
    })
    spy.mockRestore()
  })
})
