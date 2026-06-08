import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { Label } from './Label'

describe('Label – accessibility (WCAG 2 AA)', () => {
  it('with text and associated field has no violations', async () => {
    const { container } = render(
      <>
        <Label htmlFor="nome">Nome</Label>
        <input id="nome" type="text" />
      </>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('as implicit label (wrap) has no violations', async () => {
    const { container } = render(
      <Label>
        <input type="checkbox" /> Aceitar termos
      </Label>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
