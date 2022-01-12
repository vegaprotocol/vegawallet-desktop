import React from 'react'
import { changeNetworkAction } from '../../contexts/network/network-actions'
import { useNetwork } from '../../contexts/network/network-context'
import { DropdownItem, DropdownMenu } from '../dropdown-menu'

export function NetworkSwitcher() {
  const { state, dispatch } = useNetwork()

  // If the user has no networks dont render switcher
  if (!state.networks.length || !state.network) {
    return null
  }

  return (
    <DropdownMenu
      trigger={state.network.toUpperCase()}
      content={state.networks.map(network => (
        <DropdownItem
          key={network}
          onClick={() => dispatch(changeNetworkAction(network))}>
          {network}
        </DropdownItem>
      ))}
    />
  )
}
