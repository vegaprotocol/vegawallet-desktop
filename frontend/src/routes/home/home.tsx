import React from 'react'
import { IsAppInitialised, ListWallets } from '../../api/service'
import { WalletList } from './wallet-list'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Wallet } from './wallet'

export const Home = () => {
  // if (walletStatus === WalletStatus.None) {
  //   return <Redirect to='/import' />
  // }

  return (
    <Switch>
      <Route path='/wallet/:wallet'>
        <Wallet />
      </Route>
      <Route path='/' exact>
        {/* <WalletList wallets={wallets} /> */}
      </Route>
    </Switch>
  )
}
