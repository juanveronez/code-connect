import { render } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { runAxe } from '../../../test/a11y'
import { FormField } from './FormField'

function TextFieldWrapper() {
  const { register } = useForm<{ email: string }>()
  return (
    <FormField
      id="email"
      label="Email"
      type="email"
      placeholder="seu@email.com"
      registration={register('email')}
    />
  )
}

function FieldWithErrorWrapper() {
  const { register } = useForm<{ email: string }>()
  return (
    <FormField
      id="email"
      label="Email"
      type="email"
      registration={register('email')}
      error="Email é obrigatório"
    />
  )
}

function PasswordFieldWrapper() {
  const { register } = useForm<{ password: string }>()
  return (
    <FormField
      id="password"
      label="Senha"
      type="password"
      placeholder="••••••••"
      registration={register('password')}
    />
  )
}

describe('FormField – acessibilidade (WCAG 2 AA)', () => {
  it('campo de texto sem erro não tem violações', async () => {
    const { container } = render(<TextFieldWrapper />)
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('campo com mensagem de erro não tem violações', async () => {
    const { container } = render(<FieldWithErrorWrapper />)
    expect(await runAxe(container)).toHaveNoViolations()
  })

  it('campo de senha não tem violações', async () => {
    const { container } = render(<PasswordFieldWrapper />)
    expect(await runAxe(container)).toHaveNoViolations()
  })
})
