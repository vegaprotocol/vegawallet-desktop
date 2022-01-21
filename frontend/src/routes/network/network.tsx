import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { NetworkDetails } from './network-details'
import { NetworkEdit } from './network-edit'
import { NetworkOverview } from './network-overview'

export enum NetworkPaths {
  Config = '/network/:name',
  Edit = '/network/:name/edit'
}

export const Network = () => {
  const match = useRouteMatch()
  return (
    <Switch>
      <Route path={NetworkPaths.Config} exact={true}>
        <NetworkDetails />
      </Route>
      <Route path={NetworkPaths.Edit}>
        <NetworkEdit />
      </Route>
      <Route path={match.path} exact={true}>
        <NetworkOverview />
      </Route>
    </Switch>
  )
}
