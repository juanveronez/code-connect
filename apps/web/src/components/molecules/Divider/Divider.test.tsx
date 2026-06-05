import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders children text', () => {
    render(
      <MemoryRouter>
        <Divider>ou</Divider>
      </MemoryRouter>,
    )
    expect(screen.getByText('ou')).toBeInTheDocument()
  })

  it('renders without children', () => {
    const { container } = render(<Divider />)
    expect(container.querySelectorAll('hr')).toHaveLength(2)
  })
})
