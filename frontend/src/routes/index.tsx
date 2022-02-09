import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import routerConfig, { Paths } from './router-config'

export const AppRouter = () => {
  return (
    <Switch>
      {routerConfig.map(({ path, component: Component, exact, name }) => {
        return (
          <Route key={name} path={path} exact={exact}>
            <Component />
          </Route>
        )
      })}
      {/* Redirect to home if no route match */}
      <Route>
        <Redirect to={Paths.Home} />
      </Route>
    </Switch>
  )
}
