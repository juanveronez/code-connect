import { SocialButton } from '../../molecules/SocialButton'

type Provider = 'github' | 'google'

type SocialLoginGroupProps = {
  onProvider?: (provider: Provider) => void
}

export function SocialLoginGroup({ onProvider }: SocialLoginGroupProps) {
  return (
    <div className="flex gap-6 justify-center">
      <SocialButton
        iconSrc="/github.svg"
        iconAlt="GitHub"
        iconSize={32}
        label="GitHub"
        onClick={() => onProvider?.('github')}
      />
      <SocialButton
        iconSrc="/google.svg"
        iconAlt="Google"
        iconSize={28}
        label="Gmail"
        onClick={() => onProvider?.('google')}
      />
    </div>
  )
}
