import React from 'react'

import { Colors } from '../../config/colors'
import { ChromeDrawer } from './chrome-drawer'
import { ChromeSidebar } from './chrome-sidebar'

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
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          paddingBottom: DRAWER_HEIGHT,
          height: '100%',
          background: Colors.DARK_GRAY_1,
          borderTop: '3px solid'
        }}
        data-testid='app-chrome'
      >
        <ChromeSidebar />
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
