import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RegisterPage } from './RegisterPage'

describe('RegisterPage', () => {
  it('renders register heading', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Cadastro' })).toBeInTheDocument()
  })

  it('renders banner image', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )
    expect(screen.getByAltText('Ilustração de cadastro')).toBeInTheDocument()
  })
})
