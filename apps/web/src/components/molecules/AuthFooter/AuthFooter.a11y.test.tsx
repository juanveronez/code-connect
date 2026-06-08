import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MaterialIcon } from '../../atoms/MaterialIcon'
import { runAxe } from '../../../test/a11y'
import { AuthFooter } from './AuthFooter'

describe('AuthFooter – accessibility (WCAG 2 AA)', () => {
  it('with icon has no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <AuthFooter
          question="Ainda não tem conta?"
          linkText="Crie seu cadastro!"
          to="/register"
          icon={<MaterialIcon name="assignment" />}
        />
      </MemoryRouter>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('without icon has no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <AuthFooter
          question="Já tem conta?"
          linkText="Faça seu login!"
          to="/login"
        />
      </MemoryRouter>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
