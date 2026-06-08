import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { Checkbox } from './Checkbox'

describe('Checkbox – acessibilidade (WCAG 2 AA)', () => {
  it('envolta em label implícita não tem violações', async () => {
    const { container } = render(
      <label>
        <Checkbox /> Lembrar-me
      </label>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('associada por id/htmlFor não tem violações', async () => {
    const { container } = render(
      <>
        <label htmlFor="remember">Lembrar-me</label>
        <Checkbox id="remember" />
      </>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('sem label tem violação', async () => {
    const { container } = render(<Checkbox />)
    expect(await runAxe(container)).not.toHaveNoViolations()
  })
})
