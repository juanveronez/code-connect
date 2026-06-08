import { AuthTemplate } from '../../components/templates/AuthTemplate'
import { RegisterForm } from '../../components/organisms/RegisterForm'

const banner = {
  src: '/banner-register-desktop.png',
  alt: 'Ilustração de cadastro',
  crop: {
    containerHeight: 'h-[675px]',
    imgClass: 'absolute h-full max-w-none top-0 w-[248.77%] left-[-89.74%]',
  },
}

export function RegisterPage() {
  return (
    <AuthTemplate banner={banner}>
      <RegisterForm />
    </AuthTemplate>
  )
}
