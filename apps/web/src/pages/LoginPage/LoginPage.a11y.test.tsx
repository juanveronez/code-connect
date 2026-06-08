import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { runAxe } from '../../test/a11y'
import { LoginPage } from './LoginPage'

describe('LoginPage – acessibilidade (WCAG 2 AA)', () => {
  it('página completa de login não tem violações', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })
})
