import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { GetNetworkConfig } from '../../api/service'
import { BulletHeader } from '../../components/bullet-header'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import type { Network as NetworkModel } from '../../models/network'
import { NetworkDetails } from './network-details'
import { NetworkEdit } from './network-edit'

export enum NetworkPaths {
  Edit = '/network/edit'
}

export const Network = () => {
  const match = useRouteMatch()
  const { state } = useGlobal()
  const [config, setConfig] = React.useState<NetworkModel | null>(null)

  React.useEffect(() => {
    async function run() {
      if (!state.network) {
        AppToaster.show({ message: 'No network selected', color: Colors.RED })
        return
      }
      setConfig(null)
      try {
        const config = await GetNetworkConfig(state.network)
        setConfig(config)
      } catch (err) {
        console.error(err)
      }
    }

    run()
  }, [state.network])

  if (!config) {
    return (
      <>
        <BulletHeader tag='h1'>Network ({state.network})</BulletHeader>
        <p>No network configuration found</p>
      </>
    )
  }

  return (
    <Switch>
      <Route path={match.path} exact={true}>
        <NetworkDetails config={config} />
      </Route>
      <Route path={NetworkPaths.Edit}>
        <NetworkEdit config={config} />
      </Route>
    </Switch>
  )
}
