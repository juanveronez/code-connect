import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { Icon } from './Icon'

describe('Icon – accessibility (WCAG 2 AA)', () => {
  it('with descriptive alt text has no violations', async () => {
    const { container } = render(<Icon src="/github.svg" alt="GitHub" />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('decorative with empty alt has no violations', async () => {
    const { container } = render(<Icon src="/decorative.svg" alt="" />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
