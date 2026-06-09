import { vi } from 'vitest'
import { runAxe } from '../../test/a11y'
import { renderWithProviders } from '../../test/renderWithProviders'
import { RegisterPage } from './RegisterPage'
import * as authApi from '../../lib/api/auth'

vi.mock('../../lib/api/auth')

describe('RegisterPage – accessibility (WCAG 2 AA)', () => {
  it('full registration page has no violations', async () => {
    vi.mocked(authApi.register).mockResolvedValue({ id: '', name: '', email: '' })
    const { container } = renderWithProviders(<RegisterPage />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
