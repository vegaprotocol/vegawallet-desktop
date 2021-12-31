import React from 'react'

interface SplashProps {
  children: React.ReactNode
}

/**
 * Component to display content centered in the middle of the screen
 */
export function Splash({ children }: SplashProps) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div>{children}</div>
    </div>
  )
}
