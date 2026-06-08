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
    <div className="flex flex-wrap justify-center items-center gap-2 max-w-sm">
      <p className="text-lg text-foreground whitespace-nowrap">{question}</p>
      <TextLink to={to} tone="primary" className="text-lg inline-flex items-center gap-3 whitespace-nowrap">
        {linkText}
        {icon && <span className="no-underline size-6">{icon}</span>}
      </TextLink>
    </div>
  )
}
