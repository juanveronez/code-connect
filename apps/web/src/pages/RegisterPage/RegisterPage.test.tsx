import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders'
import { RegisterPage } from './RegisterPage'
import * as authApi from '../../lib/api/auth'

vi.mock('../../lib/api/auth')

describe('RegisterPage', () => {
  it('renders register heading', () => {
    vi.mocked(authApi.register).mockResolvedValue({ id: '', name: '', email: '' })
    renderWithProviders(<RegisterPage />)
    expect(screen.getByRole('heading', { name: 'Cadastro' })).toBeInTheDocument()
  })

  it('renders banner image', () => {
    renderWithProviders(<RegisterPage />)
    expect(screen.getByAltText('Ilustração de cadastro')).toBeInTheDocument()
  })
})
