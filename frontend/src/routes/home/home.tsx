import { Navigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { Splash } from '../../components/splash'
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
    </Splash>
  )
}
