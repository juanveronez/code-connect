import { vi } from 'vitest'
import { runAxe } from '../../../test/a11y'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { LoginForm } from './LoginForm'

vi.mock('../../../lib/api/auth')

describe('LoginForm – accessibility (WCAG 2 AA)', () => {
  it('login form has no violations', async () => {
    const { container } = renderWithProviders(<LoginForm />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
