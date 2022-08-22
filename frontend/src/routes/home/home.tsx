import { useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { Dialog } from '../../components/dialog'
import { Header } from '../../components/header'
import { Vega } from '../../components/icons'
import { RadioGroup } from '../../components/radio-group'
import { Splash } from '../../components/splash'
import { Colors } from '../../config/colors'
import {
  getKeysAction,
  updateTelemetry
} from '../../contexts/global/global-actions'
import { AppStatus, useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../'

const TelemetryDialog = () => {
  const {
    state: { config },
    dispatch
  } = useGlobal()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      consent: 'no'
    }
  })

  const onSubmit = (data: { consent: string }) => {
    dispatch(
      updateTelemetry({ consentAsked: true, enabled: data.consent === 'yes' })
    )
  }

  return (
    <Dialog open={config?.telemetry.consentAsked === false}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-testid='telemetry-optin-form'
      >
        <Header style={{ marginTop: 0 }}>Report bugs and crashes</Header>
        <p style={{ marginBottom: '1em' }}>
          Selecting yes will help developers improve the software
        </p>
        <div style={{ marginBottom: '1em' }}>
          <RadioGroup
            name='consent'
            // TODO: Figure out how best to type the control prop
            control={control as any}
            options={[
              { label: 'No', value: 'no' },
              { label: 'Yes', value: 'yes' }
            ]}
          />
        </div>
        <Button type='submit' data-testid='telemetry-optin-continue'>
          Continue
        </Button>
      </form>
    </Dialog>
  )
}

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
    <Splash data-testid='home-splash' style={{ textAlign: 'center' }}>
      <Header
        style={{
          margin: '0 0 30px 0',
          color: Colors.WHITE,
          textAlign: 'center'
        }}
      >
        <Vega />
      </Header>
      {wallets.length > 0 && (
        <>
          <ButtonGroup orientation='vertical'>
            {wallets.map(w => (
              <Button
                onClick={() => {
                  dispatch(getKeysAction(w.name))
                }}
                data-testid={`wallet-${w.name.replace(' ', '-')}`}
                key={w.name}
              >
                {w.name}
              </Button>
            ))}
          </ButtonGroup>
          <p style={{ margin: '20px 0', textAlign: 'center' }}>OR</p>
        </>
      )}
      <ButtonGroup orientation='vertical' style={{ marginBottom: 20 }}>
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
      <TelemetryDialog />
    </Splash>
  )
}
