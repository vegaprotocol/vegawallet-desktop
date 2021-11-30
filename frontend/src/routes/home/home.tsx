import React from 'react'
import { WalletList } from './wallet-list'
import { Route, Switch } from 'react-router-dom'
import { Wallet } from './wallet'
import { WalletLoader } from '../../components/wallet-loader'
import { WalletPassword } from './wallet-password'
import { WalletKeyPair } from './wallet-key-pair'

export const Home = () => {
  return (
    <WalletLoader>
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
          <WalletList />
        </Route>
      </Switch>
    </WalletLoader>
  )
}
