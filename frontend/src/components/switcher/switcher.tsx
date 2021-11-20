import './switcher.scss'
import React from 'react'
import { useGlobal } from '../../contexts/global/global-context'
import { KeyPair } from '../../models/list-keys'

type DropdownType = 'network' | 'wallet' | 'keypair'

export function Switcher() {
  const [state, dispatch] = useGlobal()
  const [currDropdown, setCurrDropdown] = React.useState<DropdownType | null>(
    null
  )

  return (
    <div className='switcher'>
      <Dropdown
        current={state.network}
        options={state.networks}
        isOpen={currDropdown === 'network'}
        onSelect={n => {
          dispatch({ type: 'CHANGE_NETWORK', network: n })
          setCurrDropdown(null)
        }}
        onOpen={() =>
          setCurrDropdown(currDropdown === 'network' ? null : 'network')
        }
      />
      <Dropdown
        current={state.wallet}
        options={state.wallets}
        isOpen={currDropdown === 'wallet'}
        onSelect={w => {
          dispatch({ type: 'CHANGE_WALLET', wallet: w })
          setCurrDropdown(null)
        }}
        onOpen={() =>
          setCurrDropdown(currDropdown === 'wallet' ? null : 'wallet')
        }
      />
      <Dropdown
        current={state.keypair.PublicKey}
        options={state.keypairs.map((k: KeyPair) => k.PublicKey)}
        isOpen={currDropdown === 'keypair'}
        onSelect={pubkey => {
          const keypair = state.keypairs.find(
            (kp: KeyPair) => kp.PublicKey === pubkey
          )
          dispatch({ type: 'CHANGE_KEYPAIR', keypair })
          setCurrDropdown(null)
        }}
        onOpen={() =>
          setCurrDropdown(currDropdown === 'keypair' ? null : 'keypair')
        }
      />
    </div>
  )
}

function Dropdown({
  current,
  options,
  isOpen,
  onSelect,
  onOpen
}: {
  current: string
  options: Array<string>
  isOpen: boolean
  onSelect: (value: string) => void
  onOpen: () => void
}) {
  return (
    <div className='switcher-dropdown'>
      <button onClick={() => onOpen()} type='button'>
        {current}
      </button>
      <ul
        style={{
          display: isOpen ? 'block' : 'none'
        }}>
        {options.map(o => (
          <li key={o}>
            <button type='button' onClick={() => onSelect(o)}>
              {o}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
