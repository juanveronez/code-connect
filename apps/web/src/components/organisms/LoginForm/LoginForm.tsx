import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { loginSchema } from '../../../lib/schemas/login.schema'
import type { LoginFormValues } from '../../../lib/schemas/login.schema'
import { useLogin } from '../../../lib/api/hooks'
import { useAuth } from '../../../lib/auth/AuthContext'
import { authErrorMessage } from '../../../lib/api/errors'
import { Button } from '../../atoms/Button'
import { MaterialIcon } from '../../atoms/MaterialIcon'
import { FormField } from '../../molecules/FormField'
import { RememberMeRow } from '../../molecules/RememberMeRow'
import { Divider } from '../../molecules/Divider'
import { AuthFooter } from '../../molecules/AuthFooter'
import { SocialLoginGroup } from '../SocialLoginGroup'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  })

  const { mutate, isPending, error } = useLogin()
  const { setSession } = useAuth()
  const navigate = useNavigate()

  function onSubmit({ email, password, rememberMe }: LoginFormValues) {
    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          setSession(data.access_token, rememberMe)
          void navigate('/profile')
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-semibold text-foreground">Login</h1>
            <p className="text-xl text-foreground">Boas-vindas! Faça seu login.</p>
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {authErrorMessage(error, 'Não foi possível entrar')}
            </p>
          )}
          <div className="flex flex-col gap-4">
            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="seu@email.com"
              registration={register('email')}
              error={errors.email?.message}
            />
            <div className="flex flex-col gap-2">
              <FormField
                id="password"
                label="Senha"
                type="password"
                placeholder="••••••••"
                registration={register('password')}
                error={errors.password?.message}
              />
              <RememberMeRow registration={register('rememberMe')} />
            </div>
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full" disabled={isPending} rightIcon={<MaterialIcon name="arrow_forward" />}>
          {isPending ? 'Entrando…' : 'Login'}
        </Button>

        <div className="flex flex-col gap-2">
          <Divider>ou entre com outras contas</Divider>
          <SocialLoginGroup />
        </div>
      </div>

      <AuthFooter
        question="Ainda não tem conta?"
        linkText="Crie seu cadastro!"
        to="/register"
        icon={<MaterialIcon name="assignment" />}
      />
    </form>
  )
}
