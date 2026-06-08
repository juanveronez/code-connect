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

  it('renders crop container when crop prop is provided', () => {
    const cropBanner = {
      src: '/banner-login.png',
      alt: 'Login banner',
      crop: {
        containerHeight: 'h-[628px]',
        imgClass: 'absolute h-[101.49%] left-[-68.8%] max-w-none top-[-1.11%] w-[234.89%]',
      },
    }
    const { container } = render(<AuthTemplate banner={cropBanner}><span /></AuthTemplate>)
    expect(container.querySelector('.overflow-hidden')).toBeInTheDocument()
  })
})
