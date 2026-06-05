import { render, screen } from '@testing-library/react'
import { AuthTemplate } from './AuthTemplate'

const banner = {
  desktop: '/banner-login-desktop.png',
  tablet: '/banner-login-tablet.png',
  mobile: '/banner-login-mobile.png',
  alt: 'Login banner',
}

describe('AuthTemplate', () => {
  it('renders children in the right column', () => {
    render(
      <AuthTemplate banner={banner}>
        <p>Conteúdo do formulário</p>
      </AuthTemplate>,
    )
    expect(screen.getByText('Conteúdo do formulário')).toBeInTheDocument()
  })

  it('renders picture element with sources', () => {
    const { container } = render(<AuthTemplate banner={banner}><span /></AuthTemplate>)
    expect(container.querySelectorAll('source')).toHaveLength(2)
  })

  it('renders img with alt text', () => {
    render(<AuthTemplate banner={banner}><span /></AuthTemplate>)
    expect(screen.getByAltText('Login banner')).toBeInTheDocument()
  })
})
