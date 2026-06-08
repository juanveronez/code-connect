import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { runAxe } from '../../../test/a11y'
import { TextLink } from './TextLink'

describe('TextLink – acessibilidade (WCAG 2 AA)', () => {
  it('com texto descritivo não tem violações', async () => {
    const { container } = render(
      <MemoryRouter>
        <TextLink to="/register">Crie seu cadastro!</TextLink>
      </MemoryRouter>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('tom primary não tem violações', async () => {
    const { container } = render(
      <MemoryRouter>
        <TextLink to="/login" tone="primary">Faça seu login!</TextLink>
      </MemoryRouter>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('tom muted não tem violações', async () => {
    const { container } = render(
      <MemoryRouter>
        <TextLink to="/help" tone="muted">Esqueci a senha</TextLink>
      </MemoryRouter>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('link sem nome acessível tem violação', async () => {
    const { container } = render(
      <MemoryRouter>
        <TextLink to="/somewhere" />
      </MemoryRouter>,
    )
    expect(await runAxe(container)).not.toHaveNoViolations()
  })
})
