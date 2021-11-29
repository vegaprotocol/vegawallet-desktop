import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { useGlobal } from '../contexts/global/global-context'
import routerConfig from './router-config'

export const AppRouter = () => {
  const [state] = useGlobal()
  return (
    <div>
      <div>
        <p>network: {state.network}</p>
        <p>wallet: {state.wallet}</p>
        <p>keypar: {JSON.stringify(state.keypair)}</p>
      </div>
    </div>
  )
  // return (
  //   <Switch>
  //     {routerConfig.map(({ path, component: Component, exact, name }) => {
  //       return (
  //         <Route key={name} path={path} exact={exact}>
  //           <Component />
  //         </Route>
  //       )
  //     })}
  //   </Switch>
  // )
}
