import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { NetworkDetails } from './network-details'
import { NetworkEdit } from './network-edit'
import { NetworkImport } from './network-import'

export enum NetworkPaths {
  Config = '/network',
  Edit = '/network/edit',
  Import = '/network/import'
}

export const Network = () => {
  return (
    <Switch>
      <Route path={NetworkPaths.Import} exact={true}>
        <NetworkImport />
      </Route>
      <Route path={NetworkPaths.Config} exact={true}>
        <NetworkDetails />
      </Route>
      <Route path={NetworkPaths.Edit}>
        <NetworkEdit />
      </Route>
    </Switch>
  )
}
