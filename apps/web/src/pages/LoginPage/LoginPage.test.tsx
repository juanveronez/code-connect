import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders'
import { LoginPage } from './LoginPage'
import * as authApi from '../../lib/api/auth'

vi.mock('../../lib/api/auth')

describe('LoginPage', () => {
  it('renders login heading', () => {
    vi.mocked(authApi.login).mockResolvedValue({ access_token: '' })
    renderWithProviders(<LoginPage />)
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('renders banner image', () => {
    renderWithProviders(<LoginPage />)
    expect(screen.getByAltText('Ilustração de login')).toBeInTheDocument()
  })
})
