import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { Checkbox } from './Checkbox'

describe('Checkbox – accessibility (WCAG 2 AA)', () => {
  it('wrapped in implicit label has no violations', async () => {
    const { container } = render(
      <label>
        <Checkbox /> Lembrar-me
      </label>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('associated by id/htmlFor has no violations', async () => {
    const { container } = render(
      <>
        <label htmlFor="remember">Lembrar-me</label>
        <Checkbox id="remember" />
      </>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('without label has a violation', async () => {
    const { container } = render(<Checkbox />)
    expect((await runAxe(container)).violations).not.toHaveLength(0)
  })
})
