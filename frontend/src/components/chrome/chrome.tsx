import React from 'react'
import { ChromeFooter } from './chrome-footer'
import { Colors } from '../../config/colors'
import { ChromeSidebar } from './chrome-sidebar'
import { useHistory } from 'react-router-dom'
import { ButtonUnstyled } from '../button-unstyled'

const layoutStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'min-content 1fr',
  gridTemplateRows: '1fr min-content'
}

/**
 * Handles app layout for main content, sidebar and footer
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const history = useHistory()
  return (
    <div
      style={{
        ...layoutStyles,
        height: '100%',
        background: Colors.BLACK,
        overflowY: 'auto'
      }}>
      <main style={{ gridColumn: '2 / 3', padding: 20, overflowY: 'auto' }}>
        <div>
          <ButtonUnstyled onClick={() => history.goBack()}>Back</ButtonUnstyled>
        </div>
        {children}
      </main>
      <div
        style={{
          gridColumn: '1 / 2',
          gridRow: '1 / 3',
          minWidth: 270,
          background: Colors.DARK_GRAY_1
        }}>
        <ChromeSidebar />
      </div>
      <div style={{ gridColumn: '1 / 3', gridRow: '2 / 3' }}>
        <ChromeFooter />
      </div>
    </div>
  )
}
