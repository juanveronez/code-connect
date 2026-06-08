import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { Label } from './Label'

describe('Label – acessibilidade (WCAG 2 AA)', () => {
  it('com texto e campo associado não tem violações', async () => {
    const { container } = render(
      <>
        <Label htmlFor="nome">Nome</Label>
        <input id="nome" type="text" />
      </>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('como label implícita (wrap) não tem violações', async () => {
    const { container } = render(
      <Label>
        <input type="checkbox" /> Aceitar termos
      </Label>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })
})
