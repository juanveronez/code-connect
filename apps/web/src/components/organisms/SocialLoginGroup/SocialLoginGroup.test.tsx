import { render, screen } from '@testing-library/react'
import { SocialLoginGroup } from './SocialLoginGroup'

describe('SocialLoginGroup', () => {
  it('renders GitHub and Google buttons', () => {
    render(<SocialLoginGroup />)
    expect(screen.getByRole('img', { name: 'GitHub' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Google' })).toBeInTheDocument()
  })
})
