import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { runAxe } from '../../test/a11y'
import { renderWithProviders } from '../../test/renderWithProviders'
import { ProfilePage } from './ProfilePage'
import * as authApi from '../../lib/api/auth'
import * as tokenStorage from '../../lib/api/tokenStorage'

vi.mock('../../lib/api/auth')
vi.mock('../../lib/api/tokenStorage')

describe('ProfilePage – accessibility (WCAG 2 AA)', () => {
  it('has no violations when profile is loaded', async () => {
    vi.mocked(tokenStorage.getToken).mockReturnValue('valid-token')
    vi.mocked(authApi.getProfile).mockResolvedValue({ id: '1', name: 'João Silva', email: 'joao@test.com' })
    const { container } = renderWithProviders(<ProfilePage />)
    await screen.findByText('João Silva')
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
