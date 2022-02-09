import React from 'react'

import { updateNetworkConfigAction } from '../../contexts/network/network-actions'
import { useNetwork } from '../../contexts/network/network-context'
import { stopServiceAction } from '../../contexts/service/service-actions'
import { useService } from '../../contexts/service/service-context'
import { NetworkConfigContainer } from '../network-config-container'
import { NetworkConfigForm } from '../network-config-form'

interface DrawerEditNetworkProps {
  selectedNetwork: string | null
}

export function DrawerEditNetwork({ selectedNetwork }: DrawerEditNetworkProps) {
  const { dispatch: dispatchService } = useService()
  const { dispatch: dispatchNetwork } = useNetwork()
  return (
    <NetworkConfigContainer name={selectedNetwork}>
      {config => (
        <NetworkConfigForm
          config={config}
          onSubmit={updatedConfig => {
            dispatchService(stopServiceAction())
            dispatchNetwork(updateNetworkConfigAction(updatedConfig))
          }}
        />
      )}
    </NetworkConfigContainer>
  )
}
