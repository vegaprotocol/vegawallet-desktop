import React from 'react'
import { Link } from 'react-router-dom'
import { NetworkPaths } from '.'

import { BulletHeader } from '../../components/bullet-header'
import type { Network } from '../../models/network'
import { NetworkEditor } from './network-editor'

interface NetworkEditProps {
  config: Network
  setConfig: React.Dispatch<React.SetStateAction<Network | null>>
}

export const NetworkEdit = ({ config, setConfig }: NetworkEditProps) => {
  return (
    <>
      <div>
        <Link to={NetworkPaths.Config}>Back</Link>
      </div>
      <BulletHeader tag='h1'>Edit configuration</BulletHeader>
      <NetworkEditor config={config} setConfig={setConfig} />
    </>
  )
}
