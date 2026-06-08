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
        className={`w-full rounded border border-transparent px-4 py-2 text-[15px] bg-input-bg text-input-text placeholder:text-input-text/60 outline-none transition-colors
          ${invalid ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}
          ${className}`}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
