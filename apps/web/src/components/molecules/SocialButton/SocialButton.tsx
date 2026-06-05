import type { ReactNode } from 'react'
import { Icon } from '../../atoms/Icon'

type SocialButtonProps = {
  iconSrc: string
  iconAlt: string
  label: ReactNode
  onClick?: () => void
}

export function SocialButton({ iconSrc, iconAlt, label, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-lg bg-social-bg border border-input-border px-6 py-4 text-xs text-muted hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer flex-1"
    >
      <Icon src={iconSrc} alt={iconAlt} size={24} />
      <span>{label}</span>
    </button>
  )
}
