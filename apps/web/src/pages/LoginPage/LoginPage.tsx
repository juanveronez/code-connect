import { AuthTemplate } from '../../components/templates/AuthTemplate'
import { LoginForm } from '../../components/organisms/LoginForm'

const banner = {
  src: '/banner-login.png',
  alt: 'Ilustração de login',
  crop: {
    containerHeight: 'h-[628px]',
    imgClass: 'absolute h-[101.49%] left-[-68.8%] max-w-none top-[-1.11%] w-[234.89%]',
  },
}

export function LoginPage() {
  return (
    <AuthTemplate banner={banner}>
      <LoginForm />
    </AuthTemplate>
  )
}
