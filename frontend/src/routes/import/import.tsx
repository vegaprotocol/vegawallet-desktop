import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { ImportRecoveryPhrase } from './import-recovery-phrase'
import { ImportSelect } from './import-select'
import { WalletCreator } from './wallet-creator'

export enum ImportPaths {
  Create = '/import/create',
  RecoveryPhrase = '/import/recovery-phrase'
}

export function Import() {
  const match = useRouteMatch()

  return (
    <Switch>
      <Route path={ImportPaths.Create}>
        <WalletCreator />
      </Route>
      <Route path={ImportPaths.RecoveryPhrase}>
        <ImportRecoveryPhrase />
      </Route>
      <Route path={match.path} exact>
        <ImportSelect />
      </Route>
    </Switch>
  )
}
