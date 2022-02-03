import React from 'react'
import { useHistory } from 'react-router-dom'
import { ImportPaths } from '.'
import { Header } from '../../components/header'
import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'

export function ImportSelect() {
  const history = useHistory()
  return (
    <>
      <Header style={{ marginTop: 0 }}>Create or import wallet</Header>
      <ButtonGroup orientation='vertical'>
        {[
          {
            path: ImportPaths.Create,
            text: 'Create new wallet',
            testId: 'create-new-wallet'
          },
          {
            path: ImportPaths.RecoveryPhrase,
            text: 'Import with recovery phrase',
            testId: 'import-wallet'
          }
        ].map(route => {
          return (
            <Button
              data-testid={route.testId}
              key={route.path}
              onClick={() => history.push(route.path)}
            >
              {route.text}
            </Button>
          )
        })}
      </ButtonGroup>
    </>
  )
}
