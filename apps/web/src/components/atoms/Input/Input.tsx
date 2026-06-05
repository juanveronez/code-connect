import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={invalid ?? undefined}
        className={`w-full rounded-lg border px-4 py-3 text-sm bg-input-bg text-foreground placeholder:text-muted outline-none transition-colors
          ${invalid ? 'border-red-500 focus:border-red-500' : 'border-input-border focus:border-primary'}
          ${className}`}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
