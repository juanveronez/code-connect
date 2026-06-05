import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={`h-4 w-4 rounded border-input-border accent-primary cursor-pointer ${className}`}
        {...props}
      />
    )
  },
)

Checkbox.displayName = 'Checkbox'
