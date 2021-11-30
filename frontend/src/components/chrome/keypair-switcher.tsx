import React from 'react'
import { KeyPairExtended, Wallet } from '../../contexts/global/global-context'
import { Kebab } from '../icons/kebab'
import { Dropdown, DropdownMenu, DropdownMenuItem } from '../popovers'

interface KeypairSwitcherProps {
  wallet: Wallet
  onSelect: (kp: KeyPairExtended) => void
}

export function KeypairSwitcher({ wallet, onSelect }: KeypairSwitcherProps) {
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
          {wallet.keypairs?.map(kp => (
            <DropdownMenuItem key={kp.PublicKey}>
              <button onClick={() => onSelect(kp)} style={buttonStyle}>
                {kp.Name}{' '}
                <span className='text-muted'>{kp.PublicKeyShort}</span>
              </button>
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      }>
      <button style={buttonStyle}>
        <Kebab style={{ width: 15 }} />
      </button>
    </Dropdown>
  )
}
