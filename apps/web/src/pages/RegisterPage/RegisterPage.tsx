import { AuthTemplate } from '../../components/templates/AuthTemplate'
import { RegisterForm } from '../../components/organisms/RegisterForm'

const banner = {
  src: '/banner-register-desktop.webp',
  alt: 'Ilustração de cadastro',
}

export function RegisterPage() {
  return (
    <AuthTemplate banner={banner}>
      <RegisterForm />
    </AuthTemplate>
  )
}
