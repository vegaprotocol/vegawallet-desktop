import React from 'react'
import { WalletList } from './wallet-list'
import { Route, Switch } from 'react-router-dom'
import { WalletKeyPair } from './wallet-key-pair'
import { Paths } from '../router-config'

export const Wallet = () => {
  return (
    <Switch>
      <Route path={`${Paths.Wallet}/keypair/:pubkey`}>
        <WalletKeyPair />
      </Route>
      <Route path={Paths.Wallet} exact={true}>
        <WalletList />
      </Route>
    </Switch>
  )
}

export function createKeypairRoute(pubkey: string) {
  return `${Paths.Wallet}/keypair/${pubkey}`
}
