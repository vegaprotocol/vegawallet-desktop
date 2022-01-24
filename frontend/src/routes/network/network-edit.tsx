import React from 'react'
import { Header } from '../../components/bullet-header'
import { updateNetworkConfigAction } from '../../contexts/network/network-actions'
import { useNetwork } from '../../contexts/network/network-context'
import { stopServiceAction } from '../../contexts/service/service-actions'
import { useService } from '../../contexts/service/service-context'
import { NetworkConfigContainer } from './network-config-container'
import { NetworkConfigForm } from './network-config-form'

export const NetworkEdit = () => {
  const { dispatch: dispatchNetwork } = useNetwork()
  const { dispatch: dispatchService } = useService()

  return (
    <NetworkConfigContainer>
      {config => (
        <>
          <Header>Edit Network: {config.Name}</Header>
          <NetworkConfigForm
            config={config}
            onSubmit={updatedConfig => {
              dispatchService(stopServiceAction())
              dispatchNetwork(updateNetworkConfigAction(updatedConfig))
            }}
          />
        </>
      )}
    </NetworkConfigContainer>
  )
}
