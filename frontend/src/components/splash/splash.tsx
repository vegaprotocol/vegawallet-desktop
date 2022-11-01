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
        width: '100%',
        top: '35px',
        bottom: 0,
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        overflowY: 'auto',
        color: Colors.WHITE,
        ...style
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 545,
          minHeight: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '100%',
          padding: 20
        }}
      >
        {children}
      </div>
    </div>
  )
}
