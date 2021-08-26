import React from 'react'
import { WalletList } from './wallet-list'
import { Route, Switch } from 'react-router-dom'
import { Wallet } from './wallet'
import { WalletKey } from './wallet-key'
import { WalletContainer } from './wallet-container'

export const Home = () => {
  return (
    <Switch>
      <Route path='/wallet/:wallet/:key'>
        <WalletContainer>
          {({ keys }) => <WalletKey keys={keys} />}
        </WalletContainer>
      </Route>
      <Route path='/wallet/:wallet'>
        <WalletContainer>
          {({ keys }) => <Wallet keys={keys} />}
        </WalletContainer>
      </Route>
      <Route path='/' exact>
        <WalletList />
      </Route>
    </Switch>
  )
}
