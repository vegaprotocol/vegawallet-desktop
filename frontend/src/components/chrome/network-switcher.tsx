import React from 'react'
import { changeNetworkAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { Dropdown, DropdownMenu, DropdownMenuItem } from '../popovers'

export function NetworkSwitcher() {
  const { state, dispatch } = useGlobal()

  // If the user has no networks dont render switcher
  if (!state.networks.length || !state.network) {
    return null
  }

  return (
    <div style={{ display: 'flex' }}>
      <Dropdown
        content={
          <DropdownMenu>
            {state.networks.map(network => (
              <DropdownMenuItem
                key={network}
                active={network === state.network}>
                <ButtonUnstyled
                  className='link'
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 15px',
                    lineHeight: 1,
                    textAlign: 'left'
                  }}
                  onClick={() => {
                    dispatch(changeNetworkAction(network))
                  }}>
                  {network}
                </ButtonUnstyled>
              </DropdownMenuItem>
            ))}
          </DropdownMenu>
        }>
        <ButtonUnstyled
          style={{
            fontFamily: 'AlphaLyrae',
            letterSpacing: '0.3em',
            padding: '10px 15px'
          }}>
          {state.network.toUpperCase()}
        </ButtonUnstyled>
      </Dropdown>
    </div>
  )
}
