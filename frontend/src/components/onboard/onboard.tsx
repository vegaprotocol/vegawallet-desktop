import React from 'react'
import { useForm } from 'react-hook-form'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { InitialiseApp } from '../../api/service'
import { Colors } from '../../config/colors'
import { AppStatus, useGlobal } from '../../contexts/global/global-context'
import { useNetwork } from '../../contexts/network/network-context'
import { ImportRecoveryPhrase } from '../../routes/wallet-import/import-recovery-phrase'
import { WalletCreator } from '../../routes/wallet-import/wallet-creator'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { FormGroup } from '../form-group'
import { Header } from '../header'
import { Vega } from '../icons'
import { NetworkImportForm } from '../network-import-form'

export function Onboard() {
  const [isImport, setIsImport] = React.useState(false)
  return (
    <Switch>
      <Route path='/' exact={true}>
        <OnboardHome setIsImport={setIsImport} />
      </Route>
      <Route path='/onboard/settings'>
        <OnboardSettings isImport={isImport} />
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

interface OnboardHomeProps {
  setIsImport: (isImport: boolean) => void
}

function OnboardHome({ setIsImport }: OnboardHomeProps) {
  const history = useHistory()
  const {
    state: { wallets, status }
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
          onClick={() => {
            if (status === AppStatus.Initialised) {
              history.push('/onboard/wallet-create')
            } else {
              history.push('/onboard/settings')
            }
          }}>
          Create new wallet
        </Button>
        <Button
          onClick={() => {
            setIsImport(true)
            if (status === AppStatus.Initialised) {
              history.push('/onboard/wallet-import')
            } else {
              history.push('/onboard/settings')
            }
          }}>
          Use recovery phrase
        </Button>
      </ButtonGroup>
    </div>
  )
}

interface Fields {
  vegaHome: string
}

function OnboardSettings({ isImport }: { isImport: boolean }) {
  const history = useHistory()
  const { register, handleSubmit } = useForm<Fields>({
    defaultValues: { vegaHome: '' }
  })

  const submit = React.useCallback(
    async (values: Fields) => {
      try {
        await InitialiseApp({
          vegaHome: values.vegaHome
        })
        if (isImport) {
          history.push('/onboard/wallet-import')
        } else {
          history.push('/onboard/wallet-create')
        }
      } catch (err) {
        console.error(err)
      }
    },
    [isImport, history]
  )

  return (
    <OnboardPanel>
      <Header style={{ marginTop: 0 }}>Initialise Vega Wallet</Header>
      <form onSubmit={handleSubmit(submit)}>
        <FormGroup
          label='Vega home'
          labelFor='vegaHome'
          helperText='Leave blank to use default'>
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

  const onComplete = React.useCallback(() => {
    history.push('/onboard/network')
  }, [history])

  return (
    <OnboardPanel>
      <WalletCreator onComplete={onComplete} />
    </OnboardPanel>
  )
}

function OnboardWalletImport() {
  const history = useHistory()
  const onComplete = React.useCallback(() => {
    history.push('/onboard/network')
  }, [history])

  return (
    <OnboardPanel>
      <ImportRecoveryPhrase onComplete={onComplete} />
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
      style={{ width: '90vw', background: Colors.BLACK, padding: '30px 25px' }}>
      {children}
    </div>
  )
}
