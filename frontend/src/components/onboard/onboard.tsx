import * as Sentry from '@sentry/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Outlet, useNavigate } from 'react-router-dom'

import { Colors } from '../../config/colors'
import { DEFAULT_VEGA_HOME } from '../../config/environment'
import { Intent } from '../../config/intent'
import { useGlobal } from '../../contexts/global/global-context'
import { useNetwork } from '../../contexts/network/network-context'
import { useCreateWallet } from '../../hooks/use-create-wallet'
import { useImportWallet } from '../../hooks/use-import-wallet'
import { OnboardPaths, Paths } from '../../routes'
import { Service } from '../../service'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { ButtonUnstyled } from '../button-unstyled'
import { FormGroup } from '../form-group'
import { Header } from '../header'
import { Vega } from '../icons'
import { NetworkImportForm } from '../network-import-form'
import { AppToaster } from '../toaster'
import { WalletCreateForm } from '../wallet-create-form'
import { WalletCreateFormSuccess } from '../wallet-create-form/wallet-create-form-success'
import { WalletImportForm } from '../wallet-import-form'

export function Onboard() {
  return <Outlet />
}

export function OnboardHome() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState<
    'create' | 'import' | 'existing' | null
  >(null)
  const {
    dispatch: globalDispatch,
    state: { version, onboarding }
  } = useGlobal()
  const { dispatch: networkDispatch } = useNetwork()

  const initialiseWithDefaultHome = async () => {
    try {
      await Service.InitialiseApp({ vegaHome: DEFAULT_VEGA_HOME })
    } catch (err) {
      Sentry.captureException(err)
    }
  }

  const handleImportExistingWallet = async () => {
    try {
      setLoading('existing')

      await Service.InitialiseApp({ vegaHome: DEFAULT_VEGA_HOME })

      const [wallets, networks] = await Promise.all([
        Service.ListWallets(),
        Service.ListNetworks()
      ])

      globalDispatch({ type: 'ADD_WALLETS', wallets: wallets.wallets })
      networkDispatch({
        type: 'ADD_NETWORKS',
        networks: networks.networks
      })
      globalDispatch({ type: 'INIT_APP', isInit: true })

      // If use doesnt have networks go to the import network section on onboarding
      // otherwise go to home to complete onboarding
      if (!onboarding.networks.length) {
        navigate(OnboardPaths.Network)
      } else {
        navigate(Paths.Home)
      }
    } catch (err) {
      Sentry.captureException(err)
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Header style={{ margin: '0 0 30px 0', color: Colors.WHITE }}>
        <Vega />
      </Header>
      {onboarding.wallets.length ? (
        <p style={{ maxWidth: 370 }}>
          Existing wallet found. Either use existing, create a new wallet or
          import from your recovery phrase
        </p>
      ) : null}
      <ButtonGroup orientation='vertical' style={{ marginBottom: 20 }}>
        {onboarding.wallets.length || onboarding.networks.length ? (
          <Button
            loading={loading === 'existing'}
            onClick={handleImportExistingWallet}
          >
            Use existing
          </Button>
        ) : null}
        <Button
          loading={loading === 'create'}
          data-testid='create-new-wallet'
          onClick={async () => {
            setLoading('create')
            await initialiseWithDefaultHome()
            navigate(OnboardPaths.WalletCreate)
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
            navigate(OnboardPaths.WalletImport)
          }}
        >
          Use recovery phrase
        </Button>
      </ButtonGroup>
      <p>
        <ButtonUnstyled
          data-testid='advanced-options'
          onClick={() => navigate(OnboardPaths.Settings)}
        >
          Advanced options
        </ButtonUnstyled>
      </p>
      {version && <p>version {version}</p>}
    </div>
  )
}

interface Fields {
  vegaHome: string
}

export function OnboardSettings() {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<Fields>()
  const [loading, setLoading] = React.useState(false)

  const submit = React.useCallback(
    async (values: Fields) => {
      try {
        setLoading(true)
        await Service.InitialiseApp({
          vegaHome: values.vegaHome
        })
        AppToaster.show({ message: 'App initialised', intent: Intent.SUCCESS })
        navigate(Paths.Onboard)
      } catch (err) {
        Sentry.captureException(err)
        setLoading(false)
      }
    },
    [navigate]
  )

  return (
    <OnboardPanel title='Advanced settings' back={Paths.Onboard}>
      <form onSubmit={handleSubmit(submit)}>
        <FormGroup
          label='Vega home'
          labelFor='vegaHome'
          helperText='Leave blank to use default'
        >
          <input type='text' {...register('vegaHome')} />
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
  const navigate = useNavigate()
  const { submit, response } = useCreateWallet()

  return (
    <OnboardPanel title='Create wallet' back={Paths.Onboard}>
      {response ? (
        <WalletCreateFormSuccess
          response={response}
          callToAction={
            <Button
              onClick={() => navigate(OnboardPaths.Network)}
              data-testid='onboard-import-network-button'
            >
              Next: Import network
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
  const navigate = useNavigate()
  const { submit, response } = useImportWallet()

  React.useEffect(() => {
    if (response) {
      navigate(OnboardPaths.Network)
    }
  }, [response, navigate])

  return (
    <OnboardPanel title='Import a wallet' back={Paths.Onboard}>
      <WalletImportForm submit={submit} cancel={() => navigate(-1)} />
    </OnboardPanel>
  )
}

export function OnboardNetwork() {
  const navigate = useNavigate()
  const { dispatch } = useGlobal()

  const onComplete = React.useCallback(() => {
    dispatch({ type: 'INIT_APP', isInit: true })
    navigate(Paths.Home)
  }, [dispatch, navigate])

  return (
    <OnboardPanel title='Import a network' back={OnboardPaths.WalletCreate}>
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
        width: '90vw',
        minWidth: 352,
        maxWidth: 520,
        background: Colors.BLACK,
        border: `1px solid ${Colors.LIGHT_GRAY_3}`
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
