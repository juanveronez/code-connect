import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../../lib/schemas/register.schema'
import type { RegisterFormValues } from '../../../lib/schemas/register.schema'
import { Button } from '../../atoms/Button'
import { Checkbox } from '../../atoms/Checkbox'
import { MaterialIcon } from '../../atoms/MaterialIcon'
import { FormField } from '../../molecules/FormField'
import { Divider } from '../../molecules/Divider'
import { AuthFooter } from '../../molecules/AuthFooter'
import { SocialLoginGroup } from '../SocialLoginGroup'

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { rememberMe: false },
  })

  function onSubmit(values: RegisterFormValues) {
    console.log(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <h1 className="text-[31px] font-semibold text-foreground">Cadastro</h1>
            <p className="text-[22px] text-foreground">Olá! Preencha seus dados.</p>
          </div>
          <div className="flex flex-col gap-4">
            <FormField
              id="name"
              label="Nome"
              placeholder="Nome completo"
              registration={register('name')}
              error={errors.name?.message}
            />
            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="Digite seu email"
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
              <label className="flex items-center gap-2 cursor-pointer text-[15px] text-muted">
                <Checkbox {...register('rememberMe')} />
                Lembrar-me
              </label>
            </div>
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full" rightIcon={<MaterialIcon name="arrow_forward" />}>
          Cadastrar
        </Button>

        <div className="flex flex-col gap-2">
          <Divider>ou entre com outras contas</Divider>
          <SocialLoginGroup />
        </div>
      </div>

      <AuthFooter
        question="Já tem conta?"
        linkText="Faça seu login!"
        to="/login"
        icon={<MaterialIcon name="login" />}
      />
    </form>
  )
}
