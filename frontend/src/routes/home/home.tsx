import React from 'react'
import { WalletList } from './wallet-list'
import { Route, Redirect, Switch } from 'react-router-dom'
import { Wallet } from './wallet'
import { WalletPassword } from './wallet-password'
import { WalletKeyPair } from './wallet-key-pair'
import { useGlobal } from '../../contexts/global/global-context'

export const Home = () => {
  const { state } = useGlobal()
  return (
    <Switch>
      <Route path='/wallet/auth' exact>
        <WalletPassword />
      </Route>
      <Route path='/wallet/:pubkey'>
        <WalletKeyPair />
      </Route>
      <Route path='/wallet'>
        <Wallet />
      </Route>
      <Route path='/' exact>
        {state.wallets.length ? <WalletList /> : <Redirect to='/import' />}
      </Route>
    </Switch>
  )
}
