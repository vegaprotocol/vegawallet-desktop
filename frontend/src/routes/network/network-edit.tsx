import React from 'react'

import { BulletHeader } from '../../components/bullet-header'
import type { Network } from '../../models/network'
import { NetworkEditor } from './network-editor'

export const NetworkEdit = ({ config }: { config: Network }) => {
  return (
    <>
      <BulletHeader tag='h1'>Edit configuration</BulletHeader>
      <NetworkEditor config={config} />
    </>
  )
}
