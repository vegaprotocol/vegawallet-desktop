import React from 'react'
import { Link } from 'react-router-dom'

import { BulletHeader } from '../../components/bullet-header'
import type { Config } from '../../models/config'
import { ConfigEditor } from './config-editor'

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
