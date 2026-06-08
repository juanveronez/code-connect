import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { MaterialIcon } from './MaterialIcon'

describe('MaterialIcon – accessibility (WCAG 2 AA)', () => {
  it('decorative icon with aria-hidden has no violations', async () => {
    const { container } = render(<MaterialIcon name="arrow_forward" />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('icon inside button with explicit label has no violations', async () => {
    const { container } = render(
      <button aria-label="Próximo">
        <MaterialIcon name="arrow_forward" />
      </button>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('button with only MaterialIcon and no accessible name has a violation', async () => {
    const { container } = render(
      <button>
        <MaterialIcon name="arrow_forward" />
      </button>,
    )
    expect((await runAxe(container)).violations).not.toHaveLength(0)
  })
})
