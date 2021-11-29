import React from 'react'
import { WalletList } from './wallet-list'
import { Route, Switch } from 'react-router-dom'
import { Wallet } from './wallet'
import { WalletLoader } from '../../components/wallet-loader'
import { WalletPassword } from './wallet-password'

export const Home = () => {
  return (
    <WalletLoader>
      <Switch>
        <Route path='/wallet/auth'>
          <WalletPassword />
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
