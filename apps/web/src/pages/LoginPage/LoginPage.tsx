import { AuthTemplate } from '../../components/templates/AuthTemplate'
import { LoginForm } from '../../components/organisms/LoginForm'

const banner = {
  desktop: '/banner-login-desktop.png',
  tablet: '/banner-login-tablet.png',
  mobile: '/banner-login-mobile.png',
  alt: 'Ilustração de login',
}

export function LoginPage() {
  return (
    <AuthTemplate banner={banner}>
      <LoginForm />
    </AuthTemplate>
  )
}
