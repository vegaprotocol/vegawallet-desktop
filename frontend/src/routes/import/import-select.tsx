import React from 'react'
import { useHistory } from 'react-router-dom'
import { ImportPaths } from '.'
import { BulletHeader } from '../../components/bullet-header'
import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'

export function ImportSelect() {
  const history = useHistory()
  return (
    <>
      <BulletHeader tag='h1'>Create or import wallet</BulletHeader>
      <ButtonGroup>
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
