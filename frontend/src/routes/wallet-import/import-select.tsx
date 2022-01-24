import React from 'react'
import { useHistory } from 'react-router-dom'
import { ImportPaths } from '.'
import { Header } from '../../components/bullet-header'
import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'

export function ImportSelect() {
  const history = useHistory()
  return (
    <>
      <Header>Create or import wallet</Header>
      <ButtonGroup orientation='vertical'>
        {[
          { path: ImportPaths.Create, text: 'Create new' },
          {
            path: ImportPaths.RecoveryPhrase,
            text: 'Import by recovery phrase'
          }
        ].map(route => {
          return (
            <Button key={route.path} onClick={() => history.push(route.path)}>
              {route.text}
            </Button>
          )
        })}
      </ButtonGroup>
    </>
  )
}
