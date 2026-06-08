import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { SocialButton } from './SocialButton'

describe('SocialButton – acessibilidade (WCAG 2 AA)', () => {
  it('com ícone e label visível não tem violações', async () => {
    const { container } = render(
      <SocialButton iconSrc="/github.svg" iconAlt="GitHub" label="GitHub" />,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('botão Google não tem violações', async () => {
    const { container } = render(
      <SocialButton iconSrc="/google.svg" iconAlt="Google" iconSize={28} label="Gmail" />,
    )
    expect(await runAxe(container)).toHaveNoViolations()
  })
})
