import React from 'react'
import { Link } from 'react-router-dom'
import { NetworkPaths } from '.'

import { BulletHeader } from '../../components/bullet-header'
import { useBackend } from '../../contexts/backend/backend-context'
import { updateNetworkConfigAction } from '../../contexts/network/network-actions'
import { useNetwork } from '../../contexts/network/network-context'
import { stopServiceAction } from '../../contexts/service/service-actions'
import { useService } from '../../contexts/service/service-context'
import { NetworkConfigForm } from './network-config-form'

export const NetworkEdit = () => {
  const service = useBackend()
  const {
    state: { config },
    dispatch: dispatchNetwork
  } = useNetwork()
  const { dispatch: dispatchService } = useService()

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
        onSubmit={config => {
          dispatchService(stopServiceAction(service))
          dispatchNetwork(updateNetworkConfigAction(config, service))
        }}
      />
    </>
  )
}
