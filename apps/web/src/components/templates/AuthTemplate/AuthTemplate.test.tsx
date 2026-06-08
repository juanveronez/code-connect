import { render, screen } from '@testing-library/react'
import { AuthTemplate } from './AuthTemplate'

const banner = {
  src: '/banner-login.png',
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

  it('renders img with alt text', () => {
    render(<AuthTemplate banner={banner}><span /></AuthTemplate>)
    expect(screen.getByAltText('Login banner')).toBeInTheDocument()
  })

  it('renders banner container with overflow hidden', () => {
    const { container } = render(<AuthTemplate banner={banner}><span /></AuthTemplate>)
    expect(container.querySelector('.overflow-hidden')).toBeInTheDocument()
  })
})
