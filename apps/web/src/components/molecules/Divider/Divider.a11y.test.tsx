import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { Divider } from './Divider'

describe('Divider – acessibilidade (WCAG 2 AA)', () => {
  it('com texto não tem violações', async () => {
    const { container } = render(<Divider>ou entre com outras contas</Divider>)
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('sem texto não tem violações', async () => {
    const { container } = render(<Divider />)
    expect(await runAxe(container)).toHaveNoViolations()
  })
})
