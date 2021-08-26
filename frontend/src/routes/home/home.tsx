import React from 'react'
import { WalletList } from './wallet-list'
import { Route, Switch } from 'react-router-dom'
import { Wallet } from './wallet'
import { WalletKey } from './wallet-key'
import { WalletContainer } from './wallet-container'

export const Home = () => {
  return (
    <WalletContainer>
      {({ wallets, setWallets }) => (
        <Switch>
          <Route path='/wallet/:wallet/:key'>
            <WalletKey wallets={wallets} />
          </Route>
          <Route path='/wallet/:wallet'>
            <Wallet wallets={wallets} />
          </Route>
          <Route path='/' exact>
            <WalletList wallets={wallets} />
          </Route>
        </Switch>
      )}
    </WalletContainer>
  )
}
