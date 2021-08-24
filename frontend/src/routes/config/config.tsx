import React from 'react'

import { GetConfig } from '../../api/service'
import { Config as ConfigModel } from '../../models/config'
import { ConfigDetails } from './config-details'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { ConfigEdit } from './config-edit'
import { BulletHeader } from '../../components/bullet-header'

export const Config = () => {
  const match = useRouteMatch()
  const [config, setConfig] = React.useState<ConfigModel | null>(null)

  React.useEffect(() => {
    GetConfig()
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
