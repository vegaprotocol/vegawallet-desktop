import './network-switcher.scss'
import React from 'react'
import { useGlobal } from '../../contexts/global/global-context'
import { Dropdown } from './dropdown'

type DropdownType = 'network' | 'keypair'

export function NetworkSwitcher() {
  const { state, dispatch } = useGlobal()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className='network-switcher'>
      <Dropdown
        isOpen={isOpen}
        target={
          <button
            onClick={() => setIsOpen(curr => !curr)}
            style={{
              appearance: 'none',
              border: 0,
              background: 'transparent',
              padding: '7px 10px'
            }}
            type='button'>
            {state.network.toUpperCase()}
          </button>
        }
        contents={
          <ul className='network-switcher__list'>
            {state.networks.map(n => (
              <li
                key={n}
                onClick={() => {
                  dispatch({ type: 'CHANGE_NETWORK', network: n })
                  setIsOpen(false)
                }}>
                {n.toUpperCase()}
              </li>
            ))}
          </ul>
        }
      />
    </div>
  )
}
