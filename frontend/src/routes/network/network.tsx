import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { GetNetworkConfig } from '../../api/service'
import { BulletHeader } from '../../components/bullet-header'
import type { Network as NetworkModel } from '../../models/network'
import { NetworkDetails } from './network-details'
import { NetworkEdit } from './network-edit'

export const Network = () => {
  const match = useRouteMatch()
  const [config, setConfig] = React.useState<NetworkModel | null>(null)

  React.useEffect(() => {
    // FIXME This should be dynamically set by a dropdown.
    GetNetworkConfig('fairground')
      .then(result => {
        setConfig(result)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  if (!config) {
    return (
      <>
        <BulletHeader tag='h1'>Network (fairground)</BulletHeader>
        <p>No network</p>
      </>
    )
  }

  return (
    <Switch>
      <Route path={match.path} exact={true}>
        <NetworkDetails config={config} />
      </Route>
      <Route path={`${match.path}/edit`}>
        <NetworkEdit config={config} />
      </Route>
    </Switch>
  )
}
