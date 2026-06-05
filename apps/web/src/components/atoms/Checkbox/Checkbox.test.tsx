import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('toggles on click', async () => {
    render(<Checkbox />)
    const cb = screen.getByRole('checkbox')
    await userEvent.click(cb)
    expect(cb).toBeChecked()
  })

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement | null>
    render(<Checkbox ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
