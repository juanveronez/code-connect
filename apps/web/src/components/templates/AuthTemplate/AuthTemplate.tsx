import type { ReactNode } from 'react'

type BannerProps = {
  desktop: string
  tablet: string
  mobile: string
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
        aria-hidden
        className="absolute pointer-events-none opacity-30 w-[407px] -bottom-16 -right-16"
      />
      <img
        src="/bg-symbol.svg"
        aria-hidden
        className="absolute pointer-events-none opacity-30 w-[407px] -top-24 -left-16"
      />
      <div className="relative z-10 w-full max-w-[996px] bg-card rounded-card flex items-center justify-between px-20 py-14 border border-bg">
        <div className="hidden md:block">
          <picture>
            <source media="(min-width: 1024px)" srcSet={banner.desktop} />
            <source media="(min-width: 640px)" srcSet={banner.tablet} />
            <img
              src={banner.mobile}
              alt={banner.alt}
              className="max-w-[407px] w-full h-auto"
            />
          </picture>
        </div>
        <div className="px-8 flex items-center">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
