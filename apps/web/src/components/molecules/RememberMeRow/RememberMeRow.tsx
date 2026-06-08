import type { UseFormRegisterReturn } from 'react-hook-form'
import { Checkbox } from '../../atoms/Checkbox'
import { TextLink } from '../../atoms/TextLink'

type RememberMeRowProps = {
  registration: UseFormRegisterReturn
}

export function RememberMeRow({ registration }: RememberMeRowProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2 cursor-pointer text-[15px] text-muted">
        <Checkbox {...registration} />
        Lembrar-me
      </label>
      <TextLink to="#" tone="default" className="text-[15px] underline">Esqueci a senha</TextLink>
    </div>
  )
}
