import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { ImportMnemonic } from './import-mnemonic'
import { ImportSelect } from './import-select'
import { WalletCreator } from './wallet-creator'

export enum ImportPaths {
  Create = '/import/create',
  Path = '/import/path',
  Mnemonic = '/import/mnemonic'
}

export function Import() {
  const match = useRouteMatch()

  return (
    <Switch>
      <Route path={ImportPaths.Create}>
        <WalletCreator request={{ Name: '', Passphrase: '' }} />
      </Route>
      <Route path={ImportPaths.Mnemonic}>
        <ImportMnemonic
          request={{
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
