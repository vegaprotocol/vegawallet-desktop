import { Link, Navigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { Header } from '../../components/header'
import { Vega } from '../../components/icons'
import { Splash } from '../../components/splash'
import { Colors } from '../../config/colors'
import { getKeysAction } from '../../contexts/global/global-actions'
import { AppStatus, useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../'

/**
 * Redirects to import if no wallets are loaded, or to wallet home
 */
export const Home = () => {
  const {
    state: { status, wallets },
    dispatch
  } = useGlobal()

  if (status === AppStatus.Onboarding) {
    return <Navigate to={Paths.Onboard} />
  }

  return (
    <Splash>
      <Header
        style={{
          margin: '0 0 30px 0',
          color: Colors.WHITE,
          textAlign: 'center'
        }}
      >
        <Vega />
      </Header>
      <ButtonGroup orientation='vertical'>
        {wallets.map(w => (
          <Button
            onClick={() => {
              dispatch(getKeysAction(w.name))
            }}
            key={w.name}
          >
            {w.name}
          </Button>
        ))}
      </ButtonGroup>
      <p style={{ margin: '20px 0', textAlign: 'center' }}>OR</p>
      <ButtonGroup orientation='vertical'>
        <Link to='/wallet-create'>
          <Button style={{ width: '100%' }}>Create wallet</Button>
        </Link>
        <Link to='/wallet-import'>
          <Button style={{ width: '100%' }}>Import wallet</Button>
        </Link>
      </ButtonGroup>
    </Splash>
  )
}
