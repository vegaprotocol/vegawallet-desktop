import React from 'react'
import { setDrawerAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { NetworkSwitcher } from './network-switcher'
// @ts-ignore
import bg from '../../images/vega-bg.png'

export function ChromeHeader() {
  const { state, dispatch } = useGlobal()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 45,
        borderBottom: `3px solid`,
        borderImage: `url(${bg}) 15%`,
        background: '#040404'
      }}
    >
      <ButtonUnstyled
        style={{
          padding: '10px 15px',
          textTransform: 'uppercase',
          letterSpacing: '0.3em'
        }}
        onClick={() => dispatch(setDrawerAction(!state.drawerOpen))}
      >
        Menu
      </ButtonUnstyled>
      <NetworkSwitcher />
    </div>
  )
}
