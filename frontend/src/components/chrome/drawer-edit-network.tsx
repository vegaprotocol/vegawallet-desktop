import React from 'react'

import { updateNetworkConfigAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { NetworkConfigContainer } from '../network-config-container'
import { NetworkConfigForm } from '../network-config-form'

interface DrawerEditNetworkProps {
  selectedNetwork: string | null
}

export function DrawerEditNetwork({ selectedNetwork }: DrawerEditNetworkProps) {
  const { dispatch } = useGlobal()

  return (
    <NetworkConfigContainer name={selectedNetwork}>
      {config => (
        <NetworkConfigForm
          config={config}
          onSubmit={updatedConfig => {
            dispatch(
              updateNetworkConfigAction(
                selectedNetwork as string,
                updatedConfig
              )
            )
          }}
        />
      )}
    </NetworkConfigContainer>
  )
}
