import { Link, Navigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { Lock } from '../../components/icons/lock'
import { TelemetryDialog } from '../../components/telemetry-dialog'
import { Title } from '../../components/title'
import { Colors } from '../../config/colors'
import { AppStatus, useGlobal } from '../../contexts/global/global-context'
import { useOpenWallet } from '../../hooks/use-open-wallet'
import { Paths } from '../'

const itemStyles = {
  display: 'flex',
  alignItem: 'center',
  justifyContent: 'space-between',
  borderTop: `1px solid ${Colors.BLACK}`,
  padding: `18px 0`,
  cursor: 'pointer'
}

/**
 * Redirects to import if no wallets are loaded, or to wallet home
 */
export const Home = () => {
  const { open } = useOpenWallet()
  const {
    state: { status, wallets },
    dispatch
  } = useGlobal()

  if (status === AppStatus.Onboarding) {
    return <Navigate to={Paths.Onboard} />
  }

  return (
    <div
      className='vega-border-image'
      style={{ borderTop: '3px solid', padding: 20 }}
    >
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
            borderBottom: `${wallets.length > 0 ? '1' : '0'}px solid ${
              Colors.BLACK
            }`
          }}
        >
          {wallets.map(w => (
            <div
              style={itemStyles}
              onClick={() => open(w.name)}
              data-testid={`wallet-${w.name.replace(' ', '-')}`}
              key={w.name}
            >
              <div>{w.name}</div>
              <div style={{ color: Colors.GRAY_1 }}>
                <Lock style={{ width: 20, margin: '0 20px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          textAlign: 'center',
          padding: 20,
          width: '100%',
          backgroundColor: Colors.DARK_GRAY_1,
          ...(wallets.length
            ? {
                position: 'fixed',
                bottom: 0,
                left: 0
              }
            : {})
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
          <button
            style={{ textDecoration: 'underline' }}
            onClick={() => dispatch({ type: 'SET_SETTINGS_MODAL', open: true })}
            data-testid='home-settings'
          >
            App settings
          </button>
        </p>
      </div>
      <TelemetryDialog />
    </div>
  )
}
