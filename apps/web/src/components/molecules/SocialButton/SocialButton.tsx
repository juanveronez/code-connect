import type { ReactNode } from 'react'
import { Icon } from '../../atoms/Icon'

type SocialButtonProps = {
  iconSrc: string
  iconAlt: string
  iconSize?: number
  label: ReactNode
  onClick?: () => void
}

export function SocialButton({ iconSrc, iconAlt, iconSize = 32, label, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 text-foreground hover:opacity-80 transition-opacity cursor-pointer"
    >
      <Icon src={iconSrc} alt={iconAlt} size={iconSize} />
      <span className="text-xs">{label}</span>
    </button>
  )
}
