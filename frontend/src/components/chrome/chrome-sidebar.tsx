import * as Dialog from '@radix-ui/react-dialog'
import { useNavigate } from 'react-router-dom'
import { animated, config, useTransition } from 'react-spring'

import { APP_FRAME_HEIGHT } from '../../app-loader'
import { Colors } from '../../config/colors'
import type { Wallet } from '../../contexts/global/global-context'
import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { Cross } from '../icons/cross'
import { KeyPairList } from '../key-pair-list'
import { DRAWER_HEIGHT } from './chrome'

export const SIDEBAR_WIDTH = 375

interface ChromeSidebarProps {
  open: boolean
  isWide: boolean
  height: number
  setOpen: (open: boolean) => void
}

export function ChromeSidebar({
  isWide,
  open,
  height,
  setOpen
}: ChromeSidebarProps) {
  return isWide ? (
    <>
      <SidebarHeader />
      <KeyPairList />
    </>
  ) : (
    <SidebarDialog open={open} height={height} setOpen={setOpen} />
  )
}

interface SidebarDialogProps {
  open: boolean
  height: number
  setOpen: (open: boolean) => void
}

function SidebarDialog({ open, height, setOpen }: SidebarDialogProps) {
  const transitions = useTransition(open, {
    from: { opacity: 0, x: -SIDEBAR_WIDTH },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: -SIDEBAR_WIDTH },
    config: { ...config.default, duration: 170 }
  })
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {transitions(
        (styles, item) =>
          item && (
            <>
              <Dialog.Overlay forceMount asChild>
                <animated.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
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
                    width: SIDEBAR_WIDTH,
                    height: height - DRAWER_HEIGHT - APP_FRAME_HEIGHT,
                    background: Colors.DARK_GRAY_2,
                    borderRight: `1px solid ${Colors.BLACK}`,
                    translateX: styles.x,
                    overflowY: 'auto',
                    zIndex: 1
                  }}
                >
                  <SidebarHeader close={() => setOpen(false)} />
                  <KeyPairList onSelect={() => setOpen(false)} />
                </animated.div>
              </Dialog.Content>
            </>
          )
      )}
    </Dialog.Root>
  )
}

interface SidebarHeaderProps {
  close?: () => void
}

function SidebarHeader({ close }: SidebarHeaderProps) {
  const navigate = useNavigate()
  const {
    state: { wallet },
    actions,
    dispatch
  } = useGlobal()

  function handleLock(wallet: Wallet) {
    if (wallet.auth) {
      dispatch(actions.deactivateWalletAction(wallet.name))
      navigate('/')
    }
  }

  if (!wallet) {
    return null
  }

  return (
    <div
      style={{
        padding: '10px 5px 10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <ButtonUnstyled
        onClick={() => handleLock(wallet)}
        style={{ fontSize: 14 }}
        data-testid='log-out'
      >
        Log out
      </ButtonUnstyled>
      <span
        style={{
          color: Colors.WHITE,
          fontSize: 20,
          textTransform: 'uppercase'
        }}
        data-testid='wallet-name'
      >
        {wallet.name}
      </span>
      <span style={{ width: 38, height: 38 }}>
        {close && (
          <ButtonUnstyled onClick={close} style={{ fontSize: 14 }}>
            <Cross style={{ width: 38, height: 38 }} />
          </ButtonUnstyled>
        )}
      </span>
    </div>
  )
}
