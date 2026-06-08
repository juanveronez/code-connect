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

describe('FormField – accessibility (WCAG 2 AA)', () => {
  it('text field without error has no violations', async () => {
    const { container } = render(<TextFieldWrapper />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('field with error message has no violations', async () => {
    const { container } = render(<FieldWithErrorWrapper />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })

  it('password field has no violations', async () => {
    const { container } = render(<PasswordFieldWrapper />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
