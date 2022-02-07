import React from 'react'
import { useForm } from 'react-hook-form'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { InitialiseApp } from '../../api/service'
import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import { useGlobal } from '../../contexts/global/global-context'
import { useNetwork } from '../../contexts/network/network-context'
import { useCreateWallet } from '../../hooks/use-create-wallet'
import { useImportWallet } from '../../hooks/use-import-wallet'
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
import * as Sentry from '@sentry/react'

enum OnboardPaths {
  Home = '/',
  Settings = '/onboard/settings',
  WalletCreate = '/onboard/wallet-create',
  WalletImport = '/onboard/wallet-import',
  Network = '/onboard/network'
}

export function Onboard() {
  return (
    <Switch>
      <Route path={OnboardPaths.Settings}>
        <OnboardSettings />
      </Route>
      <Route path={OnboardPaths.WalletCreate}>
        <OnboardWalletCreate />
      </Route>
      <Route path={OnboardPaths.WalletImport}>
        <OnboardWalletImport />
      </Route>
      <Route path={OnboardPaths.Network}>
        <OnboardNetwork />
      </Route>
      <Route path={OnboardPaths.Home} exact={true}>
        <OnboardHome />
      </Route>
      {/* If none of the above routes are hit, something has probably gone wrong so redirect to home */}
      <Route>
        <Redirect to={OnboardPaths.Home} />
      </Route>
    </Switch>
  )
}

function OnboardHome() {
  const history = useHistory()
  const {
    state: { wallets, version }
  } = useGlobal()
  const {
    state: { networks }
  } = useNetwork()

  if (wallets.length && !networks.length) {
    return <Redirect to={OnboardPaths.Network} />
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Header style={{ margin: '0 0 30px 0' }}>
        <Vega />
      </Header>
      <ButtonGroup orientation='vertical' style={{ marginBottom: 20 }}>
        <Button
          data-testid='onboard-create-wallet'
          onClick={async () => {
            await InitialiseApp({
              vegaHome: process.env.REACT_APP_VEGA_HOME || ''
            })
            history.push(OnboardPaths.WalletCreate)
          }}
        >
          Create new wallet
        </Button>
        <Button
          onClick={async () => {
            await InitialiseApp({
              vegaHome: process.env.REACT_APP_VEGA_HOME || ''
            })
            history.push(OnboardPaths.WalletImport)
          }}
        >
          Use recovery phrase
        </Button>
      </ButtonGroup>
      <p>
        <ButtonUnstyled onClick={() => history.push(OnboardPaths.Settings)}>
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

function OnboardSettings() {
  const history = useHistory()
  const { register, handleSubmit } = useForm<Fields>()

  const submit = React.useCallback(
    async (values: Fields) => {
      try {
        await InitialiseApp({
          vegaHome: values.vegaHome
        })
        AppToaster.show({ message: 'App initialised', intent: Intent.SUCCESS })
        history.push(OnboardPaths.Home)
      } catch (err) {
        Sentry.captureException(err)
        console.error(err)
      }
    },
    [history]
  )

  return (
    <OnboardPanel title='Advanced settings'>
      <form onSubmit={handleSubmit(submit)}>
        <FormGroup
          label='Vega home'
          labelFor='vegaHome'
          helperText='Leave blank to use default'
        >
          <input type='text' {...register('vegaHome')} />
        </FormGroup>
        <div>
          <Button type='submit'>Initialise</Button>
        </div>
      </form>
    </OnboardPanel>
  )
}

function OnboardWalletCreate() {
  const history = useHistory()
  const { submit, response } = useCreateWallet()

  return (
    <OnboardPanel title='Create wallet'>
      {response ? (
        <WalletCreateFormSuccess
          response={response}
          callToAction={
            <Button
              onClick={() => history.push(OnboardPaths.Network)}
              data-testid='onboard-import-network-button'
            >
              Next: Import network
            </Button>
          }
        />
      ) : (
        <WalletCreateForm
          submit={submit}
          cancel={() => history.push(OnboardPaths.Home)}
        />
      )}
    </OnboardPanel>
  )
}

function OnboardWalletImport() {
  const history = useHistory()
  const { submit, response } = useImportWallet()

  React.useEffect(() => {
    if (response) {
      history.push(OnboardPaths.Network)
    }
  }, [response, history])

  return (
    <OnboardPanel title='Import a wallet'>
      <WalletImportForm
        submit={submit}
        cancel={() => history.push(OnboardPaths.Home)}
      />
    </OnboardPanel>
  )
}

function OnboardNetwork() {
  const history = useHistory()
  const { dispatch } = useGlobal()

  const onComplete = React.useCallback(() => {
    dispatch({ type: 'FINISH_ONBOARDING' })
    history.push(OnboardPaths.Home)
  }, [history, dispatch])

  return (
    <OnboardPanel title='Import a network'>
      <NetworkImportForm onComplete={onComplete} />
    </OnboardPanel>
  )
}

interface OnboardPanelProps {
  children: React.ReactNode
  title: React.ReactNode
}

function OnboardPanel({ children, title }: OnboardPanelProps) {
  const history = useHistory()
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
          <ButtonUnstyled onClick={() => history.goBack()}>Back</ButtonUnstyled>
        </span>
        <span>{title}</span>
        <span style={{ flex: 1 }} />
      </div>
      <div style={{ padding: '30px 25px' }}>{children}</div>
    </div>
  )
}
