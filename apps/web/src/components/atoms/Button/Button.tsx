import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
  rightIcon?: ReactNode
}

export function Button({ variant = 'primary', rightIcon, children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-lg font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-primary text-primary-fg hover:bg-primary/90',
    ghost: 'bg-transparent text-foreground border border-input-border hover:bg-input-bg',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
      {rightIcon}
    </button>
  )
}
