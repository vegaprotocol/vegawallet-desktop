import type { HTMLAttributes } from 'react'
import React from 'react'

import { Colors } from '../../config/colors'

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
        overflowY: 'auto',
        backgroundColor: Colors.DARK_GRAY_1,
        color: Colors.WHITE,
        ...style
      }}
    >
      <div
        style={{ width: 545, maxWidth: '100%', marginTop: '13%', padding: 20 }}
      >
        {children}
      </div>
    </div>
  )
}
