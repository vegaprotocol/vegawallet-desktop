import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { ImportMnemonic } from './import-mnemonic'
import { ImportPath } from './import-path'
import { ImportSelect } from './import-select'
import { WalletCreator } from './wallet-creator'

export function Import() {
  const match = useRouteMatch()

  return (
    <Switch>
      <Route path={`${match.path}/create`}>
        <WalletCreator request={{ VegaHome: '', Name: '', Passphrase: '' }} />
      </Route>
      <Route path={`${match.path}/path`}>
        <ImportPath />
      </Route>
      <Route path={`${match.path}/mnemonic`}>
        <ImportMnemonic
          request={{
            VegaHome: '',
            Name: '',
            Passphrase: '',
            Mnemonic: '',
            Version: 2
          }}
        />
      </Route>
      <Route path={match.path} exact>
        <ImportSelect />
      </Route>
    </Switch>
  )
}
