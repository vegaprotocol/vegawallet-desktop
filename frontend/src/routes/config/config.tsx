import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { GetServiceConfig } from '../../api/service'
import { BulletHeader } from '../../components/bullet-header'
import type { Config as ConfigModel } from '../../models/config'
import { ConfigDetails } from './config-details'
import { ConfigEdit } from './config-edit'

export const Config = () => {
  const match = useRouteMatch()
  const [config, setConfig] = React.useState<ConfigModel | null>(null)

  React.useEffect(() => {
    GetServiceConfig()
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
        <BulletHeader tag='h1'>Config</BulletHeader>
        <p>No wallet</p>
      </>
    )
  }

  return (
    <Switch>
      <Route path={match.path} exact={true}>
        <ConfigDetails config={config} />
      </Route>
      <Route path={`${match.path}/edit`}>
        <ConfigEdit config={config} />
      </Route>
    </Switch>
  )
}
