import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { runAxe } from '../../../test/a11y'
import { TextLink } from './TextLink'

describe('TextLink – accessibility (WCAG 2 AA)', () => {
  it('with descriptive text has no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <TextLink to="/register">Crie seu cadastro!</TextLink>
      </MemoryRouter>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('primary tone has no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <TextLink to="/login" tone="primary">Faça seu login!</TextLink>
      </MemoryRouter>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('muted tone has no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <TextLink to="/help" tone="muted">Esqueci a senha</TextLink>
      </MemoryRouter>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('link without accessible name has a violation', async () => {
    const { container } = render(
      <MemoryRouter>
        <TextLink to="/somewhere" />
      </MemoryRouter>,
    )
    expect((await runAxe(container)).violations).not.toHaveLength(0)
  })
})
