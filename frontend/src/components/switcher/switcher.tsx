import './switcher.scss'
import React from 'react'
import { useGlobal } from '../../contexts/global/global-context'
import { KeyPair } from '../../models/list-keys'
import { useHistory } from 'react-router'

type DropdownType = 'network' | 'keypair'

export function Switcher() {
  const history = useHistory()
  const { state, dispatch } = useGlobal()
  const [currDropdown, setCurrDropdown] = React.useState<DropdownType | null>(
    null
  )

  return (
    <div className='switcher'>
      <Dropdown
        current={state.network}
        options={state.networks.map(n => ({ value: n, text: n }))}
        isOpen={currDropdown === 'network'}
        onSelect={n => {
          dispatch({ type: 'CHANGE_NETWORK', network: n })
          setCurrDropdown(null)
        }}
        onOpen={() =>
          setCurrDropdown(currDropdown === 'network' ? null : 'network')
        }
        secondaryText='Config'
        onClickSecondary={n => {
          setCurrDropdown(null)
          history.push(`/network`)
        }}
      />
      {state.keypairs?.length ? (
        <Dropdown
          current={
            `wallet: ${state.wallet} keypair: ${state.keypair?.Name} ${state.keypair?.PublicKeyShort}` ||
            'Select'
          }
          options={state.keypairs.map(k => ({
            value: k.PublicKey,
            text: k.PublicKeyShort
          }))}
          isOpen={currDropdown === 'keypair'}
          onSelect={pubkey => {
            const keypair = state.keypairs?.find(
              (kp: KeyPair) => kp.PublicKey === pubkey
            )
            if (keypair) {
              dispatch({ type: 'CHANGE_KEYPAIR', keypair })
            }
            setCurrDropdown(null)
          }}
          onOpen={() =>
            setCurrDropdown(currDropdown === 'keypair' ? null : 'keypair')
          }
        />
      ) : null}
    </div>
  )
}

function Dropdown({
  current,
  options,
  isOpen,
  secondaryText,
  onSelect,
  onClickSecondary,
  onOpen
}: {
  current: string
  options: Array<{ value: string; text: string }>
  isOpen: boolean
  secondaryText?: string
  onSelect: (value: string) => void
  onClickSecondary?: (value: string) => void
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
          <li key={o.value}>
            <button type='button' onClick={() => onSelect(o.value)}>
              {o.text}
            </button>
            {secondaryText && onClickSecondary && (
              <button type='button' onClick={() => onClickSecondary(o.value)}>
                {secondaryText}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
