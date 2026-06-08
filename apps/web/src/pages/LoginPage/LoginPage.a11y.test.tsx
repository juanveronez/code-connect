import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { runAxe } from '../../test/a11y'
import { LoginPage } from './LoginPage'

describe('LoginPage – accessibility (WCAG 2 AA)', () => {
  it('full login page has no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
