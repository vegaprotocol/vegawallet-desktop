import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { ImportMnemonic } from './import-mnemonic'
import { ImportPath } from './import-path'
import { ImportSelect } from './import-select'
import { WalletCreator } from './wallet-creator'

export function Import() {
  const match = useRouteMatch()

  return (
    <>
      <ImportSelect />
      <div style={{ marginTop: 20 }}>
        <Switch>
          <Route path={`${match.path}/create`}>
            <WalletCreator
              request={{ RootPath: '', Name: '', Passphrase: '' }}
            />
          </Route>
          <Route path={`${match.path}/path`}>
            <ImportPath />
          </Route>
          <Route path={`${match.path}/mnemonic`}>
            <ImportMnemonic
              request={{ RootPath: '', Name: '', Passphrase: '', Mnemonic: '' }}
            />
          </Route>
        </Switch>
      </div>
    </>
  )
}
