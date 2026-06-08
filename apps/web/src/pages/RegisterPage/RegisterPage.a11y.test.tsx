import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { runAxe } from '../../test/a11y'
import { RegisterPage } from './RegisterPage'

describe('RegisterPage – accessibility (WCAG 2 AA)', () => {
  it('full registration page has no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
