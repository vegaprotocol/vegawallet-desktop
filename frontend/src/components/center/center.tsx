import type { ReactNode } from 'react'

interface CenterProps {
  children: ReactNode
}

export function Center({ children }: CenterProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}
    >
      <div>{children}</div>
    </div>
  )
}
