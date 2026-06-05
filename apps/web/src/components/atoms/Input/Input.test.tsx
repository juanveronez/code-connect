import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Email" />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
  })

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement | null>
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('sets aria-invalid when invalid prop is true', () => {
    render(<Input invalid />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('accepts user input', async () => {
    render(<Input placeholder="Email" />)
    const input = screen.getByPlaceholderText('Email')
    await userEvent.type(input, 'user@test.com')
    expect(input).toHaveValue('user@test.com')
  })
})
