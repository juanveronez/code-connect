import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={`appearance-none size-6 rounded border-2 border-input-border bg-transparent cursor-pointer checked:bg-primary checked:border-primary checked:bg-[url('/checkbox-check.svg')] bg-center bg-no-repeat ${className}`}
        {...props}
      />
    )
  },
)

Checkbox.displayName = 'Checkbox'
