import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { Input } from './Input'

describe('Input – accessibility (WCAG 2 AA)', () => {
  it('with label associated by htmlFor has no violations', async () => {
    const { container } = render(
      <>
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" />
      </>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('with aria-label has no violations', async () => {
    const { container } = render(<Input aria-label="Email" type="email" />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('invalid state with label has no violations', async () => {
    const { container } = render(
      <>
        <label htmlFor="email">Email</label>
        <Input id="email" invalid aria-describedby="email-error" />
        <span id="email-error">Email inválido</span>
      </>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('without label has a violation', async () => {
    const { container } = render(<Input />)
    expect((await runAxe(container)).violations).not.toHaveLength(0)
  })
})
