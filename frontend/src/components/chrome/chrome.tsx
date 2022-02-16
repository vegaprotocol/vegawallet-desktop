import React from 'react'

import { Colors } from '../../config/colors'
import { ChromeDrawer } from './chrome-drawer'

export const DRAWER_HEIGHT = 70

/**
 * Handles app layout for main content, sidebar and footer
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        className='vega-border-image'
        style={{
          paddingBottom: DRAWER_HEIGHT,
          height: '100%',
          background: Colors.DARK_GRAY_1,
          borderTop: '3px solid'
        }}
      >
        <main
          style={{
            height: '100%',
            overflowY: 'auto'
          }}
        >
          {children}
        </main>
      </div>
      <ChromeDrawer />
    </>
  )
}
