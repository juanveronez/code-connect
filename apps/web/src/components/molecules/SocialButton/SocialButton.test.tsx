import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocialButton } from './SocialButton'

describe('SocialButton', () => {
  it('renders icon and label', () => {
    render(<SocialButton iconSrc="/github.svg" iconAlt="GitHub" label="GitHub" />)
    expect(screen.getByRole('img', { name: 'GitHub' })).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<SocialButton iconSrc="/github.svg" iconAlt="GitHub" label="GitHub" onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
