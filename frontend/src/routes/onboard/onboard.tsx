import React from 'react'
import { useForm } from 'react-hook-form'
import { Outlet, useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { FormGroup } from '../../components/form-group'
import { Input } from '../../components/forms/input'
import { Header } from '../../components/header'
import { Vega } from '../../components/icons'
import { NetworkImportForm } from '../../components/network-import-form'
import { Splash } from '../../components/splash'
import { AppToaster } from '../../components/toaster'
import { WalletCreateForm } from '../../components/wallet-create-form'
import { WalletCreateFormSuccess } from '../../components/wallet-create-form/wallet-create-form-success'
import { WalletImportForm } from '../../components/wallet-import-form'
import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import { useGlobal } from '../../contexts/global/global-context'
import { useCreateWallet } from '../../hooks/use-create-wallet'
import { useImportWallet } from '../../hooks/use-import-wallet'
import { createLogger } from '../../lib/logging'
import { Paths } from '..'

const logger = createLogger('Onboard')

export function Onboard() {
  return (
    <Splash style={{ textAlign: 'center' }}>
      <Outlet />
    </Splash>
  )
}

export function OnboardHome() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState<
    'create' | 'import' | 'existing' | null
  >(null)
  const defaultVegaHome =
    'Cypress' in window
      ? // @ts-ignore only injected when running in cypress
        window.Cypress.env('vegaHome')
      : ''

  const {
    dispatch,
    actions,
    service,
    state: { version, onboarding }
  } = useGlobal()

  const initialiseWithDefaultHome = async () => {
    try {
      await service.InitialiseApp({ vegaHome: defaultVegaHome })
    } catch (err) {
      logger.error(err)
    }
  }

  const handleImportExistingWallet = async () => {
    try {
      setLoading('existing')

      await service.InitialiseApp({ vegaHome: defaultVegaHome })

      // Navigate to wallet create onboarding if no wallets are found
      if (onboarding.wallets.length) {
        // Add wallets and networks to state
        dispatch({ type: 'ADD_WALLETS', wallets: onboarding.wallets })
      } else {
        navigate('/onboard/wallet-create')
        return
      }

      // If use doesnt have networks go to the import network section on onboarding
      // otherwise go to home to complete onboarding
      if (onboarding.networks.length) {
        const config = await service.GetAppConfig()
        const defaultNetwork = config.defaultNetwork
          ? config.defaultNetwork
          : onboarding.networks[0]
        const defaultNetworkConfig = await service.GetNetworkConfig(
          defaultNetwork
        )
        dispatch({
          type: 'ADD_NETWORKS',
          networks: onboarding.networks,
          network: defaultNetwork,
          networkConfig: defaultNetworkConfig
        })
      } else {
        navigate('/onboard/network')
        return
      }

      // Found wallets and networks, go to the main app
      dispatch(actions.completeOnboardAction(() => navigate(Paths.Home)))
    } catch (err) {
      logger.error(err)
    }
  }

  const renderExistingMessage = () => {
    if (!onboarding.wallets.length && !onboarding.networks.length) {
      return null
    }

    let message: string
    let buttonText: string

    if (onboarding.wallets.length && !onboarding.networks.length) {
      message = 'Existing wallets found, but no networks.'
      buttonText = 'Import network'
    } else if (!onboarding.wallets.length && onboarding.networks.length) {
      message = 'Existing networks found, but no wallets'
      buttonText = 'Create wallet'
    } else {
      message = 'Existing wallets and networks found'
      buttonText = 'Use existing'
    }

    return (
      <>
        <p style={{ marginBottom: 20 }}>{message}</p>
        <ButtonGroup>
          <Button
            loading={loading === 'existing'}
            onClick={handleImportExistingWallet}
          >
            {buttonText}
          </Button>
        </ButtonGroup>
        <p style={{ margin: '20px 0' }}>OR</p>
      </>
    )
  }

  return (
    <>
      <Header style={{ margin: '0 0 30px 0', color: Colors.WHITE }}>
        <Vega />
      </Header>
      {renderExistingMessage()}
      <ButtonGroup orientation='vertical' style={{ marginBottom: 20 }}>
        <Button
          loading={loading === 'create'}
          data-testid='create-new-wallet'
          onClick={async () => {
            setLoading('create')
            await initialiseWithDefaultHome()
            navigate('/onboard/wallet-create')
          }}
        >
          Create new wallet
        </Button>
        <Button
          data-testid='import-wallet'
          loading={loading === 'import'}
          onClick={async () => {
            setLoading('import')
            await initialiseWithDefaultHome()
            navigate('/onboard/wallet-import')
          }}
        >
          Use recovery phrase
        </Button>
      </ButtonGroup>
      <p>
        <ButtonUnstyled
          data-testid='advanced-options'
          onClick={() => navigate('/onboard/settings')}
        >
          Advanced options
        </ButtonUnstyled>
      </p>
      {version && <p>version {version}</p>}
    </>
  )
}

interface Fields {
  vegaHome: string
}

export function OnboardSettings() {
  const navigate = useNavigate()
  const { service } = useGlobal()
  const { register, handleSubmit } = useForm<Fields>({
    defaultValues: {
      vegaHome:
        'Cypress' in window
          ? // @ts-ignore only injected when running in cypress
            window.Cypress.env('vegaHome')
          : ''
    }
  })
  const [loading, setLoading] = React.useState(false)

  const submit = React.useCallback(
    async (values: Fields) => {
      logger.info('InitAppFromOnboard')
      try {
        setLoading(true)
        await service.InitialiseApp({
          vegaHome: values.vegaHome
        })
        AppToaster.show({ message: 'App initialised', intent: Intent.SUCCESS })
        navigate(Paths.Onboard)
      } catch (err) {
        setLoading(false)
        logger.error(err)
      }
    },
    [navigate, service]
  )

  return (
    <OnboardPanel title='Advanced settings' back={Paths.Onboard}>
      <form onSubmit={handleSubmit(submit)}>
        <FormGroup
          label='Vega home'
          labelFor='vegaHome'
          helperText='Leave blank to use default'
        >
          <Input type='text' {...register('vegaHome')} />
        </FormGroup>
        <ButtonGroup>
          <Button type='submit' loading={loading}>
            Initialise
          </Button>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
        </ButtonGroup>
      </form>
    </OnboardPanel>
  )
}

export function OnboardWalletCreate() {
  const {
    state: { onboarding },
    actions,
    dispatch
  } = useGlobal()
  const navigate = useNavigate()
  const { submit, response } = useCreateWallet()

  return (
    <OnboardPanel title='Create wallet' back={Paths.Onboard}>
      {response ? (
        <WalletCreateFormSuccess
          response={response}
          callToAction={
            <Button
              onClick={() => {
                if (!onboarding.networks.length) {
                  navigate('/onboard/network')
                } else {
                  dispatch(
                    actions.completeOnboardAction(() => navigate(Paths.Home))
                  )
                }
              }}
              data-testid='onboard-import-network-button'
            >
              Continue
            </Button>
          }
        />
      ) : (
        <WalletCreateForm submit={submit} cancel={() => navigate(-1)} />
      )}
    </OnboardPanel>
  )
}

export function OnboardWalletImport() {
  const {
    state: { onboarding },
    actions,
    dispatch
  } = useGlobal()
  const navigate = useNavigate()
  const { submit, response } = useImportWallet()

  React.useEffect(() => {
    if (response) {
      if (!onboarding.networks.length) {
        navigate('/onboard/network')
      } else {
        dispatch(actions.completeOnboardAction(() => navigate(Paths.Home)))
      }
    }
  }, [response, navigate, dispatch, onboarding, actions])

  return (
    <OnboardPanel title='Import a wallet' back={Paths.Onboard}>
      <WalletImportForm submit={submit} cancel={() => navigate(-1)} />
    </OnboardPanel>
  )
}

export function OnboardNetwork() {
  const navigate = useNavigate()
  const { actions, dispatch } = useGlobal()

  const onComplete = React.useCallback(() => {
    dispatch(actions.completeOnboardAction(() => navigate(Paths.Home)))
  }, [dispatch, navigate, actions])

  return (
    <OnboardPanel title='Import a network' back='/onboard/wallet-create'>
      <NetworkImportForm onComplete={onComplete} />
    </OnboardPanel>
  )
}

interface OnboardPanelProps {
  children: React.ReactNode
  title: React.ReactNode
  back: string
}

export function OnboardPanel({ children, title, back }: OnboardPanelProps) {
  const navigate = useNavigate()
  return (
    <div
      style={{
        background: Colors.BLACK,
        border: `1px solid ${Colors.LIGHT_GRAY_3}`,
        textAlign: 'left'
      }}
    >
      <div
        style={{
          display: 'flex',
          padding: '10px 25px',
          borderBottom: `1px solid ${Colors.WHITE}`
        }}
      >
        <span style={{ flex: 1 }}>
          <ButtonUnstyled data-testid='back' onClick={() => navigate(back)}>
            Back
          </ButtonUnstyled>
        </span>
        <span>{title}</span>
        <span style={{ flex: 1 }} />
      </div>
      <div style={{ padding: '30px 25px' }}>{children}</div>
    </div>
  )
}
