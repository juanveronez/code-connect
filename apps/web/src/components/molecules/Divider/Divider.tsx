import type { ReactNode } from 'react'

type DividerProps = {
  children?: ReactNode
}

export function Divider({ children }: DividerProps) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted">
      <hr className="flex-1 border-input-border" />
      {children && <span>{children}</span>}
      <hr className="flex-1 border-input-border" />
    </div>
  )
}
