import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { DRAWER_HEIGHT } from '../../components/chrome'
import { Lock } from '../../components/icons/lock'
import { OpenLock } from '../../components/icons/open-lock'
import { TelemetryDialog } from '../../components/telemetry-dialog'
import { Title } from '../../components/title'
import { Colors } from '../../config/colors'
import { AppStatus, useGlobal } from '../../contexts/global/global-context'
import { useOpenWallet } from '../../hooks/use-open-wallet'
import { sortWallet } from '../../lib/wallet-helpers'
import { Paths } from '../'

const itemStyles = {
  display: 'flex',
  alignItem: 'center',
  justifyContent: 'space-between',
  borderTop: `1px solid ${Colors.BLACK}`,
  padding: `18px 0`,
  textDecoration: 'none',
  width: '100%'
}

const actionStyles: CSSProperties = {
  position: 'fixed',
  bottom: DRAWER_HEIGHT,
  left: 0
}

/**
 * Redirects to import if no wallets are loaded, or to wallet home
 */
export const Home = () => {
  const { open } = useOpenWallet()
  const {
    state: { wallets, status },
    dispatch
  } = useGlobal()

  const actionWrapperStyles = wallets.length ? actionStyles : undefined

  const walletsList = useMemo(
    () => Object.values(wallets).sort(sortWallet),
    [wallets]
  )

  if (status === AppStatus.Onboarding) {
    return <Navigate to={Paths.Onboard} />
  }

  return (
    <div data-testid='wallet-home' style={{ padding: 20 }}>
      <Title
        style={{
          margin: '0 0 30px 0',
          color: Colors.WHITE
        }}
      >
        Wallets
      </Title>
      <div
        style={{
          paddingBottom: 144,
          width: '100%'
        }}
      >
        <div
          style={{
            borderBottom: `${walletsList.length > 0 ? '1' : '0'}px solid ${
              Colors.BLACK
            }`
          }}
        >
          {walletsList.map(w => (
            <ButtonUnstyled
              style={itemStyles}
              onClick={() => open(w.name)}
              data-testid={`wallet-${w.name.replace(' ', '-')}`}
              key={w.name}
            >
              <div>{w.name}</div>
              <div style={{ color: Colors.GRAY_1 }}>
                {w.auth ? (
                  <OpenLock style={{ width: 20, margin: '0 20px' }} />
                ) : (
                  <Lock style={{ width: 20, margin: '0 20px' }} />
                )}
              </div>
            </ButtonUnstyled>
          ))}
        </div>
      </div>
      <div
        style={{
          textAlign: 'center',
          padding: 20,
          width: '100%',
          backgroundColor: Colors.DARK_GRAY_1,
          ...actionWrapperStyles
        }}
      >
        <ButtonGroup style={{ marginBottom: 20 }}>
          <Link to='/wallet-create'>
            <Button data-testid='create-new-wallet' style={{ width: '100%' }}>
              Create wallet
            </Button>
          </Link>
          <Link to='/wallet-import'>
            <Button data-testid='import-wallet' style={{ width: '100%' }}>
              Import wallet
            </Button>
          </Link>
        </ButtonGroup>
        <p>
          <ButtonUnstyled
            onClick={() => dispatch({ type: 'SET_SETTINGS_MODAL', open: true })}
            data-testid='home-settings'
          >
            App settings
          </ButtonUnstyled>
        </p>
      </div>
      <TelemetryDialog />
    </div>
  )
}
