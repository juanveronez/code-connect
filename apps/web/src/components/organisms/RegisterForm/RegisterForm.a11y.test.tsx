import { vi } from 'vitest'
import { runAxe } from '../../../test/a11y'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { RegisterForm } from './RegisterForm'

vi.mock('../../../lib/api/auth')

describe('RegisterForm – accessibility (WCAG 2 AA)', () => {
  it('registration form has no violations', async () => {
    const { container } = renderWithProviders(<RegisterForm />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
