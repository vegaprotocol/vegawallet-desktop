import type { ReactNode } from 'react'

import { ButtonUnstyled } from '../../components/button-unstyled'
import { Header } from '../../components/header'
import { useGlobal } from '../../contexts/global/global-context'
import { useWindowSize } from '../../hooks/use-window-size'

interface WalletHeaderProps {
  center: ReactNode
  right: ReactNode
}

export function WalletHeader({ center, right }: WalletHeaderProps) {
  const { dispatch } = useGlobal()
  const { width } = useWindowSize()
  const isWide = width > 900

  return (
    <Header
      style={{ display: 'flex', alignItems: 'start', margin: 0, padding: 20 }}
    >
      <span style={{ flex: 1 }}>
        {!isWide && (
          <ButtonUnstyled
            style={{ marginRight: 10 }}
            onClick={() => dispatch({ type: 'SET_SIDEBAR', open: true })}
          >
            Wallet
          </ButtonUnstyled>
        )}
      </span>
      <span style={{ flex: 1, textAlign: 'center' }}>{center}</span>
      <span style={{ flex: 1, textAlign: 'right' }}>{right}</span>
    </Header>
  )
}
