import React from 'react'
import { ChromeFooter } from './chrome-footer'
import { ChromeHeader } from './chrome-header'
import { ChromeDrawerMenu } from '../button-unstyled/chrome-drawer-menu'

const layoutStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateRows: 'min-content 1fr min-content'
}

export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        ...layoutStyles,
        height: '100%',
        background: '#101010',
        overflowY: 'auto'
      }}>
      <ChromeHeader />
      <main style={{ padding: 15, overflowY: 'auto' }}>{children}</main>
      <ChromeFooter />
      <ChromeDrawerMenu />
    </div>
  )
}
