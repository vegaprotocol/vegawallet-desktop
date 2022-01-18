import React from 'react'
import { changeNetworkAction } from '../../contexts/network/network-actions'
import { useNetwork } from '../../contexts/network/network-context'
import { ButtonUnstyled } from '../button-unstyled'
import { DropdownItem, DropdownMenu } from '../dropdown-menu'
// @ts-ignore
import bg from '../../images/vega-bg.png'

export function NetworkSwitcher() {
  const { state, dispatch } = useNetwork()

  // If the user has no networks dont render switcher
  if (!state.networks.length || !state.network) {
    return null
  }

  return (
    <DropdownMenu
      style={{}}
      trigger={
        <ButtonUnstyled
          style={{
            letterSpacing: '0.3em',
            padding: '10px 30px 10px 15px'
          }}>
          {state.network.toUpperCase()}
          <div
            style={{
              position: 'absolute',
              right: 15,
              bottom: 17,
              display: 'inline-block',
              borderBottom: '2px solid white',
              borderRight: '2px solid white',
              width: 6,
              height: 6,
              transform: 'rotate(45deg)'
            }}
          />
        </ButtonUnstyled>
      }
      content={
        <div
          style={{
            minWidth: 130,
            background: `url(${bg})`,
            backgroundSize: 'cover'
          }}>
          {state.networks.map(network => (
            <DropdownItem
              key={network}
              style={{
                width: '100%',
                padding: '10px 15px',
                lineHeight: 1,
                textAlign: 'left'
              }}
              onClick={() => dispatch(changeNetworkAction(network))}>
              {network}
            </DropdownItem>
          ))}
        </div>
      }
    />
  )
}
