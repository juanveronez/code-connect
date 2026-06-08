import { AuthTemplate } from '../../components/templates/AuthTemplate'
import { RegisterForm } from '../../components/organisms/RegisterForm'

const banner = {
  desktop: '/banner-register-desktop.png',
  tablet: '/banner-register-tablet.png',
  mobile: '/banner-register-mobile.png',
  alt: 'Ilustração de cadastro',
  crop: true,
}

export function RegisterPage() {
  return (
    <AuthTemplate banner={banner}>
      <RegisterForm />
    </AuthTemplate>
  )
}
