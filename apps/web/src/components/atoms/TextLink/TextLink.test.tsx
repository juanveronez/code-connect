import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TextLink } from './TextLink'

describe('TextLink', () => {
  it('renders children', () => {
    render(
      <MemoryRouter>
        <TextLink to="/signup">Criar conta</TextLink>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Criar conta' })).toBeInTheDocument()
  })

  it('has correct href', () => {
    render(
      <MemoryRouter>
        <TextLink to="/signup">Criar conta</TextLink>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '/signup')
  })
})
