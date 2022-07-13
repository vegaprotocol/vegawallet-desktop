import type { ReactNode } from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { Colors } from '../../config/colors'
import { addKeypairAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { useAccounts } from '../../hooks/use-accounts'
import { truncateMiddle } from '../../lib/truncate-middle'
import { Button } from '../button'

interface KeyPairListProps {
  onSelect?: (pubkey: string) => void
}

export function KeyPairList({ onSelect }: KeyPairListProps) {
  const {
    state: { wallet },
    dispatch
  } = useGlobal()

  if (!wallet?.keypairs?.length) {
    // wallet.tsx will redirect to appropriate place
    return null
  }

  return (
    <>
      <ul style={{ borderTop: `1px solid ${Colors.BLACK}` }}>
        {wallet.keypairs.map(kp => (
          <SidebarListItem key={kp.publicKey}>
            <div>
              <NavLink
                to={`/wallet/${wallet.name.replace(' ', '-')}/keypair/${
                  kp.publicKey
                }`}
                onClick={() => {
                  if (typeof onSelect === 'function') {
                    onSelect(kp.publicKey)
                  }
                }}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: 20,
                  textDecoration: 'none',
                  color: isActive ? Colors.VEGA_YELLOW : Colors.TEXT_COLOR
                })}
              >
                <span style={{ display: 'block' }}>{kp.name}</span>
                <span
                  style={{
                    display: 'block',
                    color: Colors.TEXT_COLOR_DEEMPHASISE
                  }}
                >
                  {truncateMiddle(kp.publicKey)}
                </span>
              </NavLink>
              <AssetSummary publicKey={kp.publicKey} />
            </div>
          </SidebarListItem>
        ))}
      </ul>
      <div style={{ padding: 20 }}>
        <Button
          style={{ width: '100%' }}
          onClick={() => dispatch(addKeypairAction(wallet.name))}
          data-testid='generate-keypair'
        >
          Generate key pair
        </Button>
      </div>
    </>
  )
}

interface SidebarListItemProps {
  children: ReactNode
}

function SidebarListItem({ children }: SidebarListItemProps) {
  const [hover, setHover] = useState(false)
  const getBgColor = () => {
    if (hover) {
      return Colors.DARK_GRAY_3
    }

    return 'none'
  }
  return (
    <li
      data-testid='wallet-list'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: getBgColor(),
        borderBottom: `1px solid ${Colors.BLACK}`
      }}
    >
      {children}
    </li>
  )
}

interface AssetSummaryProps {
  publicKey: string
}

function AssetSummary({ publicKey }: AssetSummaryProps) {
  const { accounts, loading, error } = useAccounts(publicKey)
  const renderAccountInfo = () => {
    if (loading) {
      return 'Loading assets'
    }

    if (error) {
      return 'Could not load asset information'
    }

    const totalAssets = Object.keys(accounts).length
    if (!totalAssets) {
      return 'No assets'
    }

    return `${totalAssets} asset${totalAssets > 1 ? 's' : ''}`
  }
  return (
    <div style={{ padding: '0 20px 20px' }} data-testid='asset-summary'>
      {renderAccountInfo()}
    </div>
  )
}
