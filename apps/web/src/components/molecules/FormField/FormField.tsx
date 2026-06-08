import type { UseFormRegisterReturn } from 'react-hook-form'
import { Input } from '../../atoms/Input'
import { Label } from '../../atoms/Label'

type FormFieldProps = {
  id: string
  label: string
  type?: string
  placeholder?: string
  registration: UseFormRegisterReturn
  error?: string
}

export function FormField({ id, label, type = 'text', placeholder, registration, error }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        invalid={!!error}
        {...registration}
      />
      {error && <span role="alert" className="text-xs text-red-400">{error}</span>}
    </div>
  )
}
