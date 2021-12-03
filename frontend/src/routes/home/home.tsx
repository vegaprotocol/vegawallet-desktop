import React from 'react'
import { WalletList } from './wallet-list'
import { Route, Redirect, Switch } from 'react-router-dom'
import { Wallet } from './wallet'
import { WalletPassword } from './wallet-password'
import { WalletKeyPair } from './wallet-key-pair'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../router-config'

export enum WalletPaths {
  Auth = '/wallet/auth',
  Keypair = '/wallet/:pubkey',
  Home = '/wallet'
}

export const Home = () => {
  const { state } = useGlobal()
  return (
    <Switch>
      <Route path={WalletPaths.Auth} exact>
        <WalletPassword />
      </Route>
      <Route path={WalletPaths.Keypair}>
        <WalletKeyPair />
      </Route>
      <Route path={WalletPaths.Home}>
        <Wallet />
      </Route>
      <Route path='/' exact>
        {state.wallets.length ? <WalletList /> : <Redirect to={Paths.Import} />}
      </Route>
    </Switch>
  )
}
