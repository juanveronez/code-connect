import { render, screen } from '@testing-library/react'
import { MaterialIcon } from './MaterialIcon'

describe('MaterialIcon', () => {
  it('renders with material-icons class and icon name', () => {
    render(<MaterialIcon name="arrow_forward" />)
    const el = screen.getByText('arrow_forward')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('material-icons')
  })

  it('applies additional className', () => {
    render(<MaterialIcon name="assignment" className="text-2xl" />)
    expect(screen.getByText('assignment')).toHaveClass('text-2xl')
  })

  it('is hidden from screen readers', () => {
    render(<MaterialIcon name="close" />)
    expect(screen.getByText('close')).toHaveAttribute('aria-hidden')
  })
})
