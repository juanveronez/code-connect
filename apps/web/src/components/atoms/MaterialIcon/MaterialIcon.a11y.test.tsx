import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { MaterialIcon } from './MaterialIcon'

describe('MaterialIcon – acessibilidade (WCAG 2 AA)', () => {
  it('ícone decorativo com aria-hidden não tem violações', async () => {
    const { container } = render(<MaterialIcon name="arrow_forward" />)
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('ícone dentro de botão com label explícita não tem violações', async () => {
    const { container } = render(
      <button aria-label="Próximo">
        <MaterialIcon name="arrow_forward" />
      </button>,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('botão com apenas MaterialIcon sem nome acessível tem violação', async () => {
    const { container } = render(
      <button>
        <MaterialIcon name="arrow_forward" />
      </button>,
    )
    expect(await runAxe(container)).not.toHaveNoViolations()
  })
})
