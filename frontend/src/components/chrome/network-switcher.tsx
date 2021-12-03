import React from 'react'
import { Link } from 'react-router-dom'
import { changeNetworkAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../../routes/router-config'
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
                  dispatch(changeNetworkAction(n))
                }}>
                {n.toUpperCase()}
              </ButtonUnstyled>
              <Link
                to={Paths.Network}
                onClick={() => dispatch(changeNetworkAction(n))}>
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
