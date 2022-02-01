import React from 'react'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { Paths } from '../router-config'
import { ImportRecoveryPhrase } from './import-recovery-phrase'
import { ImportSelect } from './import-select'
import { WalletCreator } from './wallet-creator'

export enum ImportPaths {
  Create = '/wallet-import/create',
  RecoveryPhrase = '/wallet-import/recovery-phrase'
}

export function WalletImport() {
  const history = useHistory()
  const match = useRouteMatch()

  return (
    <Switch>
      <Route path={ImportPaths.Create}>
        <WalletCreator onComplete={() => history.push(Paths.Wallet)} />
      </Route>
      <Route path={ImportPaths.RecoveryPhrase}>
        <ImportRecoveryPhrase onComplete={() => history.push(Paths.Wallet)} />
      </Route>
      <Route path={match.path} exact>
        <ImportSelect />
      </Route>
    </Switch>
  )
}
