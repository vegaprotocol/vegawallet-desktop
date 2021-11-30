import './network-switcher.scss'
import React from 'react'
import { Link } from 'react-router-dom'
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
                style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  onClick={() => {
                    dispatch({ type: 'CHANGE_NETWORK', network: n })
                    setIsOpen(false)
                  }}>
                  {n.toUpperCase()}
                </span>
                <Link
                  to='network'
                  onClick={() =>
                    dispatch({ type: 'CHANGE_NETWORK', network: n })
                  }>
                  Config
                </Link>
              </li>
            ))}
          </ul>
        }
      />
    </div>
  )
}
