import { AuthTemplate } from '../../components/templates/AuthTemplate'
import { LoginForm } from '../../components/organisms/LoginForm'

const banner = {
  src: '/banner-login.png',
  alt: 'Ilustração de login',
}

export function LoginPage() {
  return (
    <AuthTemplate banner={banner}>
      <LoginForm />
    </AuthTemplate>
  )
}
