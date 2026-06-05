import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../../lib/schemas/login.schema'
import type { LoginFormValues } from '../../../lib/schemas/login.schema'
import { Button } from '../../atoms/Button'
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

  function onSubmit(values: LoginFormValues) {
    console.log(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Login</h1>
        <p className="text-sm text-muted">Bem-vindo de volta! Por favor, insira seus dados.</p>
      </div>

      <div className="flex flex-col gap-4">
        <FormField
          id="identifier"
          label="Email ou usuário"
          placeholder="seu@email.com"
          registration={register('identifier')}
          error={errors.identifier?.message}
        />
        <FormField
          id="password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          registration={register('password')}
          error={errors.password?.message}
        />
      </div>

      <RememberMeRow registration={register('rememberMe')} />

      <Button type="submit" variant="primary" className="w-full">
        Entrar
      </Button>

      <Divider>ou entre com</Divider>

      <SocialLoginGroup />

      <AuthFooter
        question="Não tem uma conta?"
        linkText="Crie seu cadastro!"
        to="/signup"
      />
    </form>
  )
}
