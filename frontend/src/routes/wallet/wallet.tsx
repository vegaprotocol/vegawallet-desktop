import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Paths } from '../router-config'
import { WalletKeyPair } from './wallet-key-pair'
import { WalletList } from './wallet-list'

export const Wallet = () => {
  return (
    <Switch>
      <Route path={`${Paths.Wallet}/keypair/:pubkey`}>
        <WalletKeyPair />
      </Route>
      <Route path={Paths.Wallet}>
        <WalletList />
      </Route>
    </Switch>
  )
}

export function createKeypairRoute(pubkey: string) {
  return `${Paths.Wallet}/keypair/${pubkey}`
}
