import * as Dialog from '@radix-ui/react-dialog'
import React, { useState } from 'react'
import { animated, config, useTransition } from 'react-spring'

import { Colors } from '../../config/colors'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { useWindowSize } from '../../hooks/use-window-size'
import { truncateMiddle } from '../../lib/truncate-middle'
import { ButtonUnstyled } from '../button-unstyled'
import { Header } from '../header'
import { KeyPairList } from '../key-pair-list'
import { ChromeDrawer } from './chrome-drawer'

export const DRAWER_HEIGHT = 70
const SIDEBAR_WIDTH = 320

/**
 * Handles app layout for main content, sidebar and footer
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const { wallet, keypair } = useCurrentKeypair()
  const [open, setOpen] = useState(false)
  const { width } = useWindowSize()
  const isWide = width > 900
  const transitions = useTransition(open, {
    from: { opacity: 0, x: -SIDEBAR_WIDTH },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: -SIDEBAR_WIDTH },
    config: { ...config.default, duration: 170 }
  })

  return (
    <>
      <div
        className='vega-border-image'
        style={{
          position: 'relative',
          display: isWide ? 'grid' : 'block',
          gridTemplateColumns: `${SIDEBAR_WIDTH}px 1fr`,
          paddingBottom: DRAWER_HEIGHT,
          height: '100%',
          background: Colors.DARK_GRAY_1,
          borderTop: '3px solid'
        }}
        data-testid='app-chrome'
      >
        {isWide ? (
          <aside
            style={{
              background: Colors.DARK_GRAY_2,
              overflowY: 'auto'
            }}
          >
            <KeyPairList />
          </aside>
        ) : (
          <Dialog.Root open={open} onOpenChange={setOpen}>
            {transitions((styles, item) =>
              item ? (
                <>
                  <Dialog.Overlay forceMount asChild>
                    <animated.div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        height: '100%',
                        background: 'rgba(54, 54, 54 ,0.8)',
                        opacity: styles.opacity
                      }}
                    />
                  </Dialog.Overlay>
                  <Dialog.Content forceMount asChild>
                    <animated.div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 320,
                        height: '100%',
                        paddingBottom: DRAWER_HEIGHT,
                        background: Colors.DARK_GRAY_2,
                        translateX: styles.x
                      }}
                    >
                      <KeyPairList onSelect={() => setOpen(false)} />
                    </animated.div>
                  </Dialog.Content>
                </>
              ) : null
            )}
          </Dialog.Root>
        )}
        <div
          style={{
            height: '100%',
            overflowY: 'auto'
          }}
        >
          <div style={{ padding: 20 }}>
            <Header
              style={{ display: 'flex', alignItems: 'center', margin: 0 }}
            >
              {!isWide && (
                <ButtonUnstyled
                  style={{ marginRight: 10 }}
                  onClick={() => setOpen(x => !x)}
                >
                  Wallet
                </ButtonUnstyled>
              )}
              <span>
                {wallet && wallet.name}
                {keypair &&
                  ` : ${truncateMiddle(keypair.publicKey)} : ${keypair.name}`}
              </span>
            </Header>
          </div>
          <main>{children}</main>
        </div>
      </div>
      <ChromeDrawer />
    </>
  )
}
