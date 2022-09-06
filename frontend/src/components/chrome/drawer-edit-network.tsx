import React from 'react'

import { useGlobal } from '../../contexts/global/global-context'
import { NetworkConfigContainer } from '../network-config-container'
import { NetworkConfigForm } from '../network-config-form'

interface DrawerEditNetworkProps {
  selectedNetwork: string | null
}

export function DrawerEditNetwork({ selectedNetwork }: DrawerEditNetworkProps) {
  const { actions, dispatch } = useGlobal()

  return (
    <NetworkConfigContainer name={selectedNetwork}>
      {config => (
        <NetworkConfigForm
          config={config}
          onSubmit={updatedConfig => {
            dispatch(
              actions.updateNetworkConfigAction(
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
