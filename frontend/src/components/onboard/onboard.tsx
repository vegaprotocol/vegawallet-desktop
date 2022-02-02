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

export function Onboard() {
  return (
    <Switch>
      <Route path='/' exact={true}>
        <OnboardHome />
      </Route>
      <Route path='/onboard/settings'>
        <OnboardSettings />
      </Route>
      <Route path='/onboard/wallet-create'>
        <OnboardWalletCreate />
      </Route>
      <Route path='/onboard/wallet-import'>
        <OnboardWalletImport />
      </Route>
      <Route path='/onboard/network'>
        <OnboardNetwork />
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
    return <Redirect to='/onboard/network' />
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Header style={{ margin: '0 0 30px 0' }}>
        <Vega />
      </Header>
      <ButtonGroup orientation='vertical' style={{ marginBottom: 20 }}>
        <Button
          onClick={async () => {
            await InitialiseApp({
              vegaHome: process.env.REACT_APP_VEGA_HOME || ''
            })
            history.push('/onboard/wallet-create')
          }}
        >
          Create new wallet
        </Button>
        <Button
          onClick={async () => {
            await InitialiseApp({
              vegaHome: process.env.REACT_APP_VEGA_HOME || ''
            })
            history.push('/onboard/wallet-import')
          }}
        >
          Use recovery phrase
        </Button>
      </ButtonGroup>
      <p>
        <ButtonUnstyled onClick={() => history.push('/onboard/settings')}>
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
        history.push('/')
      } catch (err) {
        console.error(err)
      }
    },
    [history]
  )

  return (
    <OnboardPanel>
      <Header style={{ marginTop: 0 }}>Advanced settings</Header>
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
    <OnboardPanel>
      {response ? (
        <WalletCreateFormSuccess
          response={response}
          callToAction={
            <Button onClick={() => history.push('/onboard/network')}>
              Import network
            </Button>
          }
        />
      ) : (
        <>
          <Header style={{ marginTop: 0 }}>Create wallet</Header>
          <WalletCreateForm submit={submit} />
        </>
      )}
    </OnboardPanel>
  )
}

function OnboardWalletImport() {
  const history = useHistory()
  const { submit, response } = useImportWallet()

  React.useEffect(() => {
    if (response) {
      history.push('/onboard/network')
    }
  }, [response, history])

  return (
    <OnboardPanel>
      <Header style={{ marginTop: 0 }}>Import a wallet</Header>
      <WalletImportForm submit={submit} />
    </OnboardPanel>
  )
}

function OnboardNetwork() {
  const history = useHistory()
  const { dispatch } = useGlobal()

  const onComplete = React.useCallback(() => {
    dispatch({ type: 'FINISH_ONBOARDING' })
    history.push('/')
  }, [history, dispatch])

  return (
    <OnboardPanel>
      <Header style={{ marginTop: 0 }}>Import a network</Header>
      <NetworkImportForm onComplete={onComplete} />
    </OnboardPanel>
  )
}

interface OnboardPanelProps {
  children: React.ReactNode
}

function OnboardPanel({ children }: OnboardPanelProps) {
  return (
    <div
      style={{ width: '90vw', background: Colors.BLACK, padding: '30px 25px' }}
    >
      {children}
    </div>
  )
}
