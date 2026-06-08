import type { ReactNode } from 'react'

type BannerCrop = {
  containerHeight: string
  imgClass: string
}

type BannerProps = {
  src: string
  alt: string
  crop?: BannerCrop
}

type AuthTemplateProps = {
  banner: BannerProps
  children: ReactNode
}

const DEFAULT_CROP: BannerCrop = {
  containerHeight: 'h-[675px]',
  imgClass: 'absolute h-full max-w-none top-0 w-[248.77%] left-[-89.74%]',
}

export function AuthTemplate({ banner, children }: AuthTemplateProps) {
  const crop = banner.crop

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
          <div className={`relative w-[407px] ${crop?.containerHeight ?? DEFAULT_CROP.containerHeight} overflow-hidden`}>
            <img
              src={banner.src}
              alt={banner.alt}
              className={crop?.imgClass ?? DEFAULT_CROP.imgClass}
            />
            <img
              src="/logo.png"
              alt="Code Connect"
              className="absolute bottom-[35px] left-[140px] w-[127px] h-[40px]"
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
