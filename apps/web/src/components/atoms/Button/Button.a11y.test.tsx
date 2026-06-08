import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { Button } from './Button'

describe('Button – accessibility (WCAG 2 AA)', () => {
  it('primary variant with text has no violations', async () => {
    const { container } = render(<Button>Entrar</Button>)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('ghost variant with text has no violations', async () => {
    const { container } = render(<Button variant="ghost">Cancelar</Button>)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('disabled state has no violations', async () => {
    const { container } = render(<Button disabled>Entrar</Button>)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('button without accessible name has a violation', async () => {
    const { container } = render(<Button />)
    expect((await runAxe(container)).violations).not.toHaveLength(0)
  })
})
