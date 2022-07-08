import React, { useState } from 'react'

import { Colors } from '../../config/colors'
import type { KeyPair } from '../../contexts/global/global-context'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { useWindowSize } from '../../hooks/use-window-size'
import { ButtonUnstyled } from '../button-unstyled'
import { Header } from '../header'
import { ChromeDrawer } from './chrome-drawer'
import { ChromeSidebar, SIDEBAR_WIDTH } from './chrome-sidebar'

export const DRAWER_HEIGHT = 70

/**
 * Handles app layout for main content, sidebar and footer
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const { keypair } = useCurrentKeypair()
  const { width, height } = useWindowSize()
  const [sidebar, setSidebar] = useState(false)
  const isWide = width > 900

  return (
    <>
      <div
        className='vega-border-image'
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: isWide ? `${SIDEBAR_WIDTH}px 1fr` : '1fr',
          paddingBottom: DRAWER_HEIGHT,
          height: '100%',
          background: Colors.DARK_GRAY_1,
          borderTop: '3px solid'
        }}
        data-testid='app-chrome'
      >
        <aside
          style={{
            background: Colors.DARK_GRAY_2,
            borderRight: `1px solid ${Colors.BLACK}`,
            overflowY: 'auto'
          }}
        >
          <ChromeSidebar open={sidebar} setOpen={setSidebar} isWide={isWide} />
        </aside>
        <main
          style={{
            height: '100%',
            overflowY: 'auto'
          }}
        >
          <MainHeader
            keypair={keypair}
            isWide={isWide}
            setSidebar={setSidebar}
          />
          {children}
        </main>
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: DRAWER_HEIGHT
        }}
      >
        <ChromeDrawer height={height} />
      </div>
    </>
  )
}

interface MainHeaderProps {
  keypair: KeyPair | undefined
  isWide: boolean
  setSidebar: (open: boolean) => void
}

function MainHeader({ keypair, isWide, setSidebar }: MainHeaderProps) {
  return (
    <Header
      style={{ display: 'flex', alignItems: 'start', margin: 0, padding: 20 }}
    >
      <span style={{ flex: 1 }}>
        {!isWide && (
          <ButtonUnstyled
            style={{ marginRight: 10 }}
            onClick={() => setSidebar(true)}
          >
            Wallet
          </ButtonUnstyled>
        )}
      </span>
      <span style={{ flex: 1, textAlign: 'center' }}>
        {keypair && (
          <>
            <div
              style={{
                color: Colors.WHITE,
                fontSize: 20
              }}
            >
              {keypair.name}
            </div>
            <div style={{ textTransform: 'initial' }}>
              {keypair.publicKeyShort}
            </div>
          </>
        )}
      </span>
      <span style={{ flex: 1 }} />
    </Header>
  )
}
