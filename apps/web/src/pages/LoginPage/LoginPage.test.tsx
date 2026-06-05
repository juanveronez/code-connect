import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  it('renders login heading', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('renders banner image', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    expect(screen.getByAltText('Ilustração de login')).toBeInTheDocument()
  })
})
