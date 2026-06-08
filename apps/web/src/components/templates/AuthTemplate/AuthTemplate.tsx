import type { ReactNode } from 'react'

type BannerProps = {
  src: string
  alt: string
}

type AuthTemplateProps = {
  banner: BannerProps
  children: ReactNode
}

export function AuthTemplate({ banner, children }: AuthTemplateProps) {
  return (
    <div className="relative overflow-hidden min-h-screen bg-bg flex items-center justify-center p-4">
      <img
        src="/bg-symbol.svg"
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute pointer-events-none opacity-30 w-96 -bottom-16 -right-16"
      />
      <img
        src="/bg-symbol.svg"
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute pointer-events-none opacity-30 w-96 -top-24 -left-16"
      />
      <div className="relative z-10 w-full max-w-auth-card bg-card rounded-card flex items-stretch justify-between px-20 py-14 border border-bg">
        <div className="hidden md:block">
          <div className="relative w-96 h-full overflow-hidden">
            <img
              src={banner.src}
              alt={banner.alt}
              width={768}
              height={512}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <img
              src="/logo.png"
              alt="Code Connect"
              width={128}
              height={40}
              className="absolute bottom-9 left-36 w-32 h-10"
            />
          </div>
        </div>
        <div className="px-8 flex items-center flex-1">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
