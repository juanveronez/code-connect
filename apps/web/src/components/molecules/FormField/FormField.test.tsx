import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { FormField } from './FormField'

function Wrapper({ error }: { error?: string }) {
  const { register } = useForm()
  return (
    <FormField
      id="email"
      label="Email"
      placeholder="seu@email.com"
      registration={register('email')}
      error={error}
    />
  )
}

describe('FormField', () => {
  it('associates label with input', () => {
    render(<Wrapper />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('renders placeholder', () => {
    render(<Wrapper />)
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
  })

  it('shows error message when provided', () => {
    render(<Wrapper error="Campo obrigatório" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Campo obrigatório')
  })

  it('does not render error when not provided', () => {
    render(<Wrapper />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
