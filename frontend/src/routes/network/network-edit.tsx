import React from 'react'
import { Link } from 'react-router-dom'
import { NetworkPaths } from '.'

import { BulletHeader } from '../../components/bullet-header'
import { updateNetworkConfigAction } from '../../contexts/network/network-actions'
import { useNetwork } from '../../contexts/network/network-context'
import { NetworkConfigForm } from './network-config-form'

export const NetworkEdit = () => {
  const {
    state: { config },
    dispatch
  } = useNetwork()

  if (!config) {
    return <p>No network configuration found</p>
  }

  return (
    <>
      <div>
        <Link to={NetworkPaths.Config}>Back</Link>
      </div>
      <BulletHeader tag='h1'>Edit configuration</BulletHeader>
      <NetworkConfigForm
        config={config}
        onSubmit={config => dispatch(updateNetworkConfigAction(config))}
      />
    </>
  )
}
