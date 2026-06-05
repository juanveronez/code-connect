import { SocialButton } from '../../molecules/SocialButton'

type Provider = 'github' | 'google'

type SocialLoginGroupProps = {
  onProvider?: (provider: Provider) => void
}

export function SocialLoginGroup({ onProvider }: SocialLoginGroupProps) {
  return (
    <div className="flex gap-3">
      <SocialButton
        iconSrc="/github.svg"
        iconAlt="GitHub"
        label="GitHub"
        onClick={() => onProvider?.('github')}
      />
      <SocialButton
        iconSrc="/google.svg"
        iconAlt="Google"
        label="Gmail"
        onClick={() => onProvider?.('google')}
      />
    </div>
  )
}
