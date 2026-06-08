import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { Divider } from './Divider'

describe('Divider – accessibility (WCAG 2 AA)', () => {
  it('with text has no violations', async () => {
    const { container } = render(<Divider>ou entre com outras contas</Divider>)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('without text has no violations', async () => {
    const { container } = render(<Divider />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
