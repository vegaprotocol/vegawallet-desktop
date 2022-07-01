import type { ReactNode } from 'react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { Colors } from '../../config/colors'
import {
  addKeypairAction,
  deactivateWalletAction
} from '../../contexts/global/global-actions'
import type { Wallet } from '../../contexts/global/global-context'
import { useGlobal } from '../../contexts/global/global-context'
import { useAccounts } from '../../hooks/use-accounts'
import { truncateMiddle } from '../../lib/truncate-middle'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { ButtonUnstyled } from '../button-unstyled'
import { Header } from '../header'

export function ChromeSidebar() {
  return (
    <aside
      style={{
        background: Colors.DARK_GRAY_2,
        overflowY: 'auto'
      }}
    >
      <KeyPairList />
    </aside>
  )
}

function KeyPairList() {
  const navigate = useNavigate()
  const {
    state: { wallet },
    dispatch
  } = useGlobal()

  function handleLock(wallet: Wallet) {
    if (wallet.auth) {
      dispatch(deactivateWalletAction(wallet.name))
      navigate('/')
    }
  }

  if (!wallet?.keypairs?.length) {
    // wallet.tsx will redirect to appropriate place
    return null
  }

  return (
    <>
      <div style={{ padding: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Header style={{ margin: 0 }}>Select key pair</Header>
          <ButtonUnstyled
            onClick={() => handleLock(wallet)}
            style={{ fontSize: 14 }}
          >
            Lock
          </ButtonUnstyled>
        </div>
      </div>
      <ul style={{ borderTop: `1px solid ${Colors.BLACK}` }}>
        {wallet.keypairs.map(kp => (
          <SidebarListItem key={kp.publicKey}>
            <div>
              <NavLink
                to={`/wallet/${wallet.name.replace(' ', '-')}/keypair/${
                  kp.publicKey
                }`}
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
  return <div style={{ padding: '0 20px 20px' }}>{renderAccountInfo()}</div>
}
