import React from 'react'
import { Link } from 'react-router-dom'
import { NetworkPaths } from '.'

import { BulletHeader } from '../../components/bullet-header'
import type { Network } from '../../models/network'
import { NetworkEditor } from './network-editor'

export const NetworkEdit = ({ config }: { config: Network }) => {
  return (
    <>
      <div>
        <Link to={NetworkPaths.Config}>Back</Link>
      </div>
      <BulletHeader tag='h1'>Edit configuration</BulletHeader>
      <NetworkEditor config={config} />
    </>
  )
}
