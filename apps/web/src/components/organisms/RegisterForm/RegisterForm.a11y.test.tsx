import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { runAxe } from '../../../test/a11y'
import { RegisterForm } from './RegisterForm'

describe('RegisterForm – accessibility (WCAG 2 AA)', () => {
  it('registration form has no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
