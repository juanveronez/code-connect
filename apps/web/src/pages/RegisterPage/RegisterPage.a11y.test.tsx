import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { runAxe } from '../../test/a11y'
import { RegisterPage } from './RegisterPage'

describe('RegisterPage – acessibilidade (WCAG 2 AA)', () => {
  it('página completa de cadastro não tem violações', async () => {
    const { container } = render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })
})
