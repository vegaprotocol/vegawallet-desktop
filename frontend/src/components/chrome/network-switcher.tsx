import React from 'react'
import { Link } from 'react-router-dom'
import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { Dropdown, DropdownMenu, DropdownMenuItem } from '../popovers'

export function NetworkSwitcher() {
  const { state, dispatch } = useGlobal()

  return (
    <Dropdown
      content={
        <DropdownMenu>
          {state.networks.map(n => (
            <DropdownMenuItem key={n}>
              <ButtonUnstyled
                onClick={() => {
                  dispatch({ type: 'CHANGE_NETWORK', network: n })
                }}>
                {n.toUpperCase()}
              </ButtonUnstyled>
              <Link
                to='network'
                onClick={() =>
                  dispatch({ type: 'CHANGE_NETWORK', network: n })
                }>
                Config
              </Link>
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
        {state.network ? state.network.toUpperCase() : 'None'}
      </ButtonUnstyled>
    </Dropdown>
  )
}
