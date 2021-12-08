import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { NetworkDetails } from './network-details'
import { NetworkEdit } from './network-edit'

export enum NetworkPaths {
  Config = '/network',
  Edit = '/network/edit'
}

export const Network = () => {
  return (
    <Switch>
      <Route path={NetworkPaths.Config} exact={true}>
        <NetworkDetails />
      </Route>
      <Route path={NetworkPaths.Edit}>
        <NetworkEdit />
      </Route>
    </Switch>
  )
}
