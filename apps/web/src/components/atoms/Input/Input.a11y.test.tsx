import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { Input } from './Input'

describe('Input – acessibilidade (WCAG 2 AA)', () => {
  it('com label associada por htmlFor não tem violações', async () => {
    const { container } = render(
      <>
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" />
      </>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('com aria-label não tem violações', async () => {
    const { container } = render(<Input aria-label="Email" type="email" />)
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('estado inválido com label não tem violações', async () => {
    const { container } = render(
      <>
        <label htmlFor="email">Email</label>
        <Input id="email" invalid aria-describedby="email-error" />
        <span id="email-error">Email inválido</span>
      </>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('sem label tem violação', async () => {
    const { container } = render(<Input />)
    expect(await runAxe(container)).not.toHaveNoViolations()
  })
})
