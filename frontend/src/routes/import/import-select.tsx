import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ImportPaths } from '.'
import { BulletHeader } from '../../components/bullet-header'
import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'

export function ImportSelect() {
  const location = useLocation()
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
          const isActive = location.pathname === route.path
          const className = ['fill', isActive ? 'active' : ''].join(' ')
          return (
            <Link to={route.path} key={route.path}>
              <Button className={className}>{route.text}</Button>
            </Link>
          )
        })}
      </ButtonGroup>
    </>
  )
}
