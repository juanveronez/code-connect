import type { UseFormRegisterReturn } from 'react-hook-form'
import { Checkbox } from '../../atoms/Checkbox'
import { TextLink } from '../../atoms/TextLink'

type RememberMeRowProps = {
  registration: UseFormRegisterReturn
}

export function RememberMeRow({ registration }: RememberMeRowProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2 cursor-pointer text-sm text-muted">
        <Checkbox {...registration} />
        Lembrar-me
      </label>
      <TextLink to="#" tone="muted">Esqueci a senha</TextLink>
    </div>
  )
}
