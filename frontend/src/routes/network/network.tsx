import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { GetNetworkConfig } from '../../api/service'
import { BulletHeader } from '../../components/bullet-header'
import { useGlobal } from '../../contexts/global/global-context'
import type { Network as NetworkModel } from '../../models/network'
import { NetworkDetails } from './network-details'
import { NetworkEdit } from './network-edit'

export const Network = () => {
  const match = useRouteMatch()
  const {
    state: { network }
  } = useGlobal()
  const [config, setConfig] = React.useState<NetworkModel | null>(null)

  React.useEffect(() => {
    setConfig(null)
    GetNetworkConfig(network)
      .then(result => {
        setConfig(result)
      })
      .catch(err => {
        console.error(err)
      })
  }, [network])

  if (!config) {
    return (
      <>
        <BulletHeader tag='h1'>Network ({network})</BulletHeader>
        <p>No network configuration found</p>
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
