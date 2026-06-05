import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthFooter } from './AuthFooter'

describe('AuthFooter', () => {
  it('renders question text and link', () => {
    render(
      <MemoryRouter>
        <AuthFooter question="Não tem conta?" linkText="Crie seu cadastro!" to="/signup" />
      </MemoryRouter>,
    )
    expect(screen.getByText('Não tem conta?')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Crie seu cadastro!' })).toHaveAttribute('href', '/signup')
  })
})
