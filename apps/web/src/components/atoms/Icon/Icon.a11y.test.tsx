import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { Icon } from './Icon'

describe('Icon – acessibilidade (WCAG 2 AA)', () => {
  it('com alt text descritivo não tem violações', async () => {
    const { container } = render(<Icon src="/github.svg" alt="GitHub" />)
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('decorativo com alt vazio não tem violações', async () => {
    const { container } = render(<Icon src="/decorative.svg" alt="" />)
    expect(await runAxe(container)).toHaveNoViolations()
  })
})
