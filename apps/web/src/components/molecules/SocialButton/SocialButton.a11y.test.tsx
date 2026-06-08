import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { SocialButton } from './SocialButton'

describe('SocialButton – accessibility (WCAG 2 AA)', () => {
  it('with icon and visible label has no violations', async () => {
    const { container } = render(
      <SocialButton iconSrc="/github.svg" iconAlt="GitHub" label="GitHub" />,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('Google button has no violations', async () => {
    const { container } = render(
      <SocialButton iconSrc="/google.svg" iconAlt="Google" iconSize={28} label="Gmail" />,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
