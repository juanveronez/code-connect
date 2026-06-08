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
    <div className="flex flex-col gap-2 items-center text-center">
      <p className="text-[15px] text-foreground">{question}</p>
      <TextLink to={to} tone="primary" className="text-[18px] inline-flex items-center gap-3">
        {linkText}
        {icon}
      </TextLink>
    </div>
  )
}
