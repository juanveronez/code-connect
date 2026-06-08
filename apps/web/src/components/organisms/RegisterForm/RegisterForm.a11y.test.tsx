import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { runAxe } from '../../../test/a11y'
import { RegisterForm } from './RegisterForm'

describe('RegisterForm – acessibilidade (WCAG 2 AA)', () => {
  it('formulário de cadastro não tem violações', async () => {
    const { container } = render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })
})
