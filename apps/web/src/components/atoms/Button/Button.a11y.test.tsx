import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { Button } from './Button'

describe('Button – acessibilidade (WCAG 2 AA)', () => {
  it('variante primary com texto não tem violações', async () => {
    const { container } = render(<Button>Entrar</Button>)
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('variante ghost com texto não tem violações', async () => {
    const { container } = render(<Button variant="ghost">Cancelar</Button>)
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('estado desabilitado não tem violações', async () => {
    const { container } = render(<Button disabled>Entrar</Button>)
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('botão sem nome acessível tem violação', async () => {
    const { container } = render(<Button />)
    expect(await runAxe(container)).not.toHaveNoViolations()
  })
})
