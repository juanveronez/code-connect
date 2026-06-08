import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { runAxe } from '../../../test/a11y'
import { LoginForm } from './LoginForm'

describe('LoginForm – accessibility (WCAG 2 AA)', () => {
  it('login form has no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
