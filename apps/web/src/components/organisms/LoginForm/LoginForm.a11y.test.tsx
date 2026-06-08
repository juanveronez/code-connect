import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { runAxe } from '../../../test/a11y'
import { LoginForm } from './LoginForm'

describe('LoginForm – acessibilidade (WCAG 2 AA)', () => {
  it('formulário de login não tem violações', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })
})
