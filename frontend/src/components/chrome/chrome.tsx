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
        style={{
          paddingBottom: DRAWER_HEIGHT,
          height: '100%',
          background: Colors.BLACK,
          overflowY: 'auto'
        }}
      >
        <main style={{ gridColumn: '2 / 3', padding: 20, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
      <ChromeDrawer />
    </>
  )
}
