import React from 'react'
import { Paths } from '../router-config'
import { Route, Switch } from 'react-router-dom'
import { Header } from '../../components/header'

export const Sign = () => {
  return (
    <Switch>
      <Route path={Paths.Sign} exact={true}>
        <>
          <Header style={{ marginTop: 0 }}>Sign</Header>
        </>
      </Route>
    </Switch>
  )
}
