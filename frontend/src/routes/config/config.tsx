import React from 'react'

import { GetConfig } from '../../api/service'
import { Config as ConfigModel } from '../../models/config'
import { ConfigDetails } from './config-details'
import { ErrorMessage } from '../../components/error-message'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { ConfigEdit } from './config-edit'

export const Config = () => {
  const match = useRouteMatch()
  const [configErrorMessage, setConfigErrorMessage] = React.useState<
    string | null
  >(null)
  const [config, setConfig] = React.useState<ConfigModel | null>(null)

  React.useEffect(() => {
    GetConfig()
      .then(result => {
        setConfig(result)
      })
      .catch(error => {
        setConfigErrorMessage(error)
      })
  }, [])

  if (!config) {
    return <ErrorMessage message={configErrorMessage || ''} />
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
