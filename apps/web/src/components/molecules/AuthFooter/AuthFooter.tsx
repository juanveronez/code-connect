import type { ReactNode } from 'react'
import { TextLink } from '../../atoms/TextLink'

type AuthFooterProps = {
  question: string
  linkText: string
  to: string
  icon?: ReactNode
}

export function AuthFooter({ question, linkText, to, icon }: AuthFooterProps) {
  return (
    <p className="text-sm text-center text-muted">
      {question}{' '}
      <TextLink to={to} tone="primary">
        {linkText}
      </TextLink>
      {icon && <span className="ml-1">{icon}</span>}
    </p>
  )
}
