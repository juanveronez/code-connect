import { render, screen } from '@testing-library/react'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders image with alt text', () => {
    render(<Icon src="/github.svg" alt="GitHub" />)
    expect(screen.getByRole('img', { name: 'GitHub' })).toBeInTheDocument()
  })

  it('applies custom size', () => {
    render(<Icon src="/github.svg" alt="GitHub" size={32} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('width', '32')
    expect(img).toHaveAttribute('height', '32')
  })
})
