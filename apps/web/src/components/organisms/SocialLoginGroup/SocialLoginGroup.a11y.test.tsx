import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { SocialLoginGroup } from './SocialLoginGroup'

describe('SocialLoginGroup – acessibilidade (WCAG 2 AA)', () => {
  it('grupo de botões sociais não tem violações', async () => {
    const { container } = render(<SocialLoginGroup />)
    expect(await runAxe(container)).toHaveNoViolations()
  })
})
