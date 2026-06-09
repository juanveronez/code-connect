import { vi } from 'vitest'
import { runAxe } from '../../test/a11y'
import { renderWithProviders } from '../../test/renderWithProviders'
import { LoginPage } from './LoginPage'
import * as authApi from '../../lib/api/auth'

vi.mock('../../lib/api/auth')

describe('LoginPage – accessibility (WCAG 2 AA)', () => {
  it('full login page has no violations', async () => {
    vi.mocked(authApi.login).mockResolvedValue({ access_token: '' })
    const { container } = renderWithProviders(<LoginPage />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
