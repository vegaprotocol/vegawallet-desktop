import React, { HTMLAttributes } from 'react'

interface SplashProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * Component to display content centered in the middle of the screen
 */
export function Splash({ children, style, ...props }: SplashProps) {
  return (
    <div
      {...props}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        ...style
      }}>
      <div style={{ marginTop: 40 }}>{children}</div>
    </div>
  )
}
