import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { SocialLoginGroup } from './SocialLoginGroup'

describe('SocialLoginGroup – accessibility (WCAG 2 AA)', () => {
  it('social buttons group has no violations', async () => {
    const { container } = render(<SocialLoginGroup />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
