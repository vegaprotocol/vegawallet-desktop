import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { ImportMnemonic } from './import-mnemonic'
import { ImportPath } from './import-path'
import { ImportSelect } from './import-select'

export function Import() {
  const match = useRouteMatch()

  return (
    <Switch>
      <Route path={`${match.path}/path`}>
        <ImportPath />
      </Route>
      <Route path={`${match.path}/mnemonic`}>
        <ImportMnemonic
          request={{ RootPath: '', Name: '', Passphrase: '', Mnemonic: '' }}
        />
      </Route>
      <Route path={match.path} exact={true}>
        <ImportSelect />
      </Route>
    </Switch>
  )
}
