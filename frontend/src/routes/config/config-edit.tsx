import React from 'react'
import { Config } from '../../models/config'
import { Link } from 'react-router-dom'
import { ConfigEditor } from './config-editor'
import { BulletHeader } from '../../components/bullet-header'

export const ConfigEdit = ({ config }: { config: Config }) => {
  return (
    <>
      <BulletHeader tag='h1'>
        Edit configuration / <Link to='/config'>Back</Link>
      </BulletHeader>

      <ConfigEditor config={config} />
    </>
  )
}
