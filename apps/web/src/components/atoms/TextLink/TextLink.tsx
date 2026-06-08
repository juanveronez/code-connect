import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type TextLinkProps = {
  to: string
  tone?: 'default' | 'primary' | 'muted'
  children: ReactNode
  className?: string
}

export function TextLink({ to, tone = 'default', children, className = '' }: TextLinkProps) {
  const tones = {
    default: 'text-foreground hover:text-primary',
    primary: 'text-primary hover:text-primary/80',
    muted: 'text-muted hover:text-foreground',
  }

  return (
    <Link to={to} className={`underline-offset-4 hover:underline transition-colors ${tones[tone]} ${className}`}>
      {children}
    </Link>
  )
}
