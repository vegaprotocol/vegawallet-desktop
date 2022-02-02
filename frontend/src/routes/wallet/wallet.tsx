import React from 'react'
import { WalletList } from './wallet-list'
import { Route, Switch } from 'react-router-dom'
import { WalletKeyPair } from './wallet-key-pair'
import { Paths } from '../router-config'

export enum WalletPaths {
  Keypair = '/wallet/keypair',
  Detail = '/wallet/detail'
}

export const Wallet = () => {
  return (
    <Switch>
      <Route path={`${WalletPaths.Keypair}/:pubkey`}>
        <WalletKeyPair />
      </Route>
      <Route path={Paths.Wallet} exact={true}>
        <WalletList />
      </Route>
    </Switch>
  )
}
