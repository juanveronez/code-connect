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
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-[1100px] bg-card rounded-card grid md:grid-cols-2 overflow-hidden">
        <div className="hidden md:block">
          <picture>
            <source media="(min-width: 1024px)" srcSet={banner.desktop} />
            <source media="(min-width: 640px)" srcSet={banner.tablet} />
            <img
              src={banner.mobile}
              alt={banner.alt}
              className="w-full h-full object-cover"
            />
          </picture>
        </div>
        <div className="p-8 md:p-12 flex items-center">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
