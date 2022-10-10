import type { ReactNode } from 'react'

import { ButtonUnstyled } from '../../components/button-unstyled'
import { Title } from '../../components/title'
import { useGlobal } from '../../contexts/global/global-context'
import { useWindowSize } from '../../hooks/use-window-size'

interface HeaderProps {
  center: ReactNode
  right: ReactNode
}

export function Header({ center, right }: HeaderProps) {
  const { dispatch } = useGlobal()
  const { width } = useWindowSize()
  const isWide = width > 900

  return (
    <Title
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
    </Title>
  )
}
