import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders'
import { ProfilePage } from './ProfilePage'
import * as authApi from '../../lib/api/auth'
import * as tokenStorage from '../../lib/api/tokenStorage'

vi.mock('../../lib/api/auth')
vi.mock('../../lib/api/tokenStorage')

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.mocked(tokenStorage.getToken).mockReturnValue('valid-token')
  })

  it('shows loading state initially', () => {
    vi.mocked(authApi.getProfile).mockImplementation(() => new Promise(() => {}))
    renderWithProviders(<ProfilePage />)
    expect(screen.getByRole('status')).toHaveTextContent('Carregando…')
  })

  it('renders profile name and email after load', async () => {
    vi.mocked(authApi.getProfile).mockResolvedValue({ id: '1', name: 'João Silva', email: 'joao@test.com' })
    renderWithProviders(<ProfilePage />)
    expect(await screen.findByText('João Silva')).toBeInTheDocument()
    expect(await screen.findByText('joao@test.com')).toBeInTheDocument()
  })

  it('calls signOut and navigates to /login on Sair click', async () => {
    vi.mocked(authApi.getProfile).mockResolvedValue({ id: '1', name: 'João Silva', email: 'joao@test.com' })
    renderWithProviders(<ProfilePage />, { initialEntries: ['/profile'] })
    await screen.findByText('João Silva')

    await userEvent.click(screen.getByRole('button', { name: /sair/i }))

    expect(tokenStorage.clearToken).toHaveBeenCalled()
  })
})
