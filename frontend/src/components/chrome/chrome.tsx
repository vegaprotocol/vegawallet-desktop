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
          background: Colors.BLACK,
          borderTop: '3px solid'
        }}
      >
        <main
          style={{
            gridColumn: '2 / 3',
            height: '100%',
            padding: 20,
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
