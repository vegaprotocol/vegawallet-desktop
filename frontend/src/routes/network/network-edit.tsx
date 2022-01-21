import React from 'react'
import { useParams } from 'react-router-dom'

import { BulletHeader } from '../../components/bullet-header'
import { updateNetworkConfigAction } from '../../contexts/network/network-actions'
import { useNetwork } from '../../contexts/network/network-context'
import { stopServiceAction } from '../../contexts/service/service-actions'
import { useService } from '../../contexts/service/service-context'
import { NetworkConfigForm } from './network-config-form'
import { useNetworkConfig } from './use-network-config'

export const NetworkEdit = () => {
  const { name } = useParams<{ name: string }>()
  const { dispatch: dispatchNetwork } = useNetwork()
  const { dispatch: dispatchService } = useService()
  const config = useNetworkConfig(name)

  if (!config) {
    return <p>No network configuration found</p>
  }

  return (
    <>
      <BulletHeader tag='h1'>Edit configuration</BulletHeader>
      <NetworkConfigForm
        config={config}
        onSubmit={updatedConfig => {
          dispatchService(stopServiceAction())
          dispatchNetwork(updateNetworkConfigAction(updatedConfig))
        }}
      />
    </>
  )
}
