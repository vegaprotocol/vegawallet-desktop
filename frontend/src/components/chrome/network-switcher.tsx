import React from 'react'
import { Link } from 'react-router-dom'
import { useGlobal } from '../../contexts/global/global-context'
import { Dropdown, DropdownMenu, DropdownMenuItem } from '../popovers'

export function NetworkSwitcher() {
  const { state, dispatch } = useGlobal()
  const buttonStyle: React.CSSProperties = {
    appearance: 'none',
    border: 0,
    background: 'transparent',
    padding: 0
  }
  return (
    <Dropdown
      content={
        <DropdownMenu>
          {state.networks.map(n => (
            <DropdownMenuItem key={n}>
              <button
                style={buttonStyle}
                onClick={() => {
                  dispatch({ type: 'CHANGE_NETWORK', network: n })
                }}>
                {n.toUpperCase()}
              </button>
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
      <button
        style={{
          appearance: 'none',
          border: 0,
          background: 'transparent',
          padding: '7px 10px'
        }}
        type='button'>
        {state.network.toUpperCase()}
      </button>
    </Dropdown>
  )
}
