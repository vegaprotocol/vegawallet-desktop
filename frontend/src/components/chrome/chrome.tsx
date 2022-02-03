import React from 'react'
import { Colors } from '../../config/colors'
import { ChromeSidebar } from './chrome-sidebar'
import { ChromeDrawer } from './chrome-drawer'

export const DRAWER_HEIGHT = 70

const layoutStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'min-content 1fr',
  gridTemplateRows: '1fr',
  paddingBottom: DRAWER_HEIGHT
}

/**
 * Handles app layout for main content, sidebar and footer
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: '100%' }}>
      <div
        style={{
          ...layoutStyles,
          height: '100%',
          background: Colors.BLACK,
          overflowY: 'auto'
        }}
      >
        <main style={{ gridColumn: '2 / 3', padding: 20, overflowY: 'auto' }}>
          {children}
        </main>
        <div
          style={{
            backgroundRepeat: 'no-repeat',
            gridColumn: '1 / 2',
            gridRow: '1 / 3',
            minWidth: 240,
            background: Colors.DARK_GRAY_1
          }}
        >
          <ChromeSidebar />
        </div>
      </div>
      <ChromeDrawer />
    </div>
  )
}
