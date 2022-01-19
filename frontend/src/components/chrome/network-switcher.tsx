import React from 'react'
import { changeNetworkAction } from '../../contexts/network/network-actions'
import { useNetwork } from '../../contexts/network/network-context'
import { DropdownItem, DropdownMenu } from '../dropdown-menu'
import { ButtonUnstyled } from '../button-unstyled'
import { DropdownArrow } from '../icons/dropdown-arrow'

export function NetworkSwitcher() {
  const { state, dispatch } = useNetwork()

  // If the user has no networks dont render switcher
  if (!state.networks.length || !state.network) {
    return null
  }

  return (
    <DropdownMenu
      trigger={
        <ButtonUnstyled
          style={{
            padding: '10px 15px',
            textTransform: 'uppercase',
            letterSpacing: '0.3em'
          }}>
          {state.network.toUpperCase()}
          <DropdownArrow style={{ width: 13, height: 13, marginLeft: 10 }} />
        </ButtonUnstyled>
      }
      content={
        <div
          style={{
            minWidth: 130,
            background: `url(${process.env.PUBLIC_URL}/vega-bg.png)`,
            backgroundSize: 'cover'
          }}>
          {state.networks.map(network => (
            <DropdownItem key={network}>
              <ButtonUnstyled
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  lineHeight: 1,
                  textAlign: 'left'
                }}
                onClick={() => dispatch(changeNetworkAction(network))}>
                {network}
              </ButtonUnstyled>
            </DropdownItem>
          ))}
        </div>
      }
    />
  )
}
