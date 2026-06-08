import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../../lib/schemas/login.schema'
import type { LoginFormValues } from '../../../lib/schemas/login.schema'
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

  function onSubmit(values: LoginFormValues) {
    console.log(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <h1 className="text-[31px] font-semibold text-foreground">Login</h1>
            <p className="text-[22px] text-foreground">Boas-vindas! Faça seu login.</p>
          </div>
          <div className="flex flex-col gap-4">
            <FormField
              id="identifier"
              label="Email ou usuário"
              placeholder="seu@email.com"
              registration={register('identifier')}
              error={errors.identifier?.message}
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

        <Button type="submit" variant="primary" className="w-full" rightIcon={<MaterialIcon name="arrow_forward" />}>
          Login
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
