import type { LabelHTMLAttributes } from 'react'

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label({ className = '', children, ...props }: LabelProps) {
  return (
    <label className={`text-lg font-normal text-foreground ${className}`} {...props}>
      {children}
    </label>
  )
}
