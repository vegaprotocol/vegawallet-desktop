import React from 'react'
import { Paths } from '../router-config'
import { Route, Switch } from 'react-router-dom'
import { Header } from '../../components/header'
import { Button } from '../../components/button'

export const Sign = () => {
  return (
    <Switch>
      <Route path={Paths.Sign} exact={true}>
        <>
          <Header style={{ marginTop: 0 }}>Sign</Header>
          <textarea
            style={{
              marginTop: 4,
              marginBottom: 4
            }}
          ></textarea>
          <Button
            style={{
              marginTop: 4,
              marginBottom: 4
            }}
          >
            Sign
          </Button>
          <textarea
            disabled={true}
            style={{
              marginTop: 4,
              marginBottom: 4
            }}
          ></textarea>
          <Button
            style={{
              marginTop: 4,
              marginBottom: 4
            }}
          >
            Send
          </Button>
        </>
      </Route>
    </Switch>
  )
}
