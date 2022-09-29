import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { truncateMiddle } from '../../lib/truncate-middle'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'

interface KeyPairListProps {
  onSelect?: (pubkey: string) => void
}

export function KeyPairList({ onSelect }: KeyPairListProps) {
  const {
    state: { wallet },
    actions,
    dispatch
  } = useGlobal()

  const keypairs = Object.values(wallet?.keypairs || {})

  if (!keypairs.length) {
    // wallet.tsx will redirect to appropriate place
    return null
  }

  return (
    <>
      <ul style={{ borderTop: `1px solid ${Colors.BLACK}` }}>
        {keypairs.map(kp => (
          <SidebarListItem key={kp.publicKey}>
            <div data-testid={`keypair-${kp.publicKey}`}>
              <NavLink
                to={`/wallet/${wallet?.name.replace(' ', '-')}/keypair/${
                  kp.publicKey
                }`}
                onClick={() => {
                  if (typeof onSelect === 'function') {
                    kp.publicKey && onSelect(kp.publicKey)
                  }
                }}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: 20,
                  textDecoration: 'none',
                  color: isActive ? Colors.VEGA_YELLOW : Colors.TEXT_COLOR
                })}
              >
                <span
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center'
                  }}
                >
                  <span data-testid='wallet-item-name'>{kp.name}</span>
                  {kp.isTainted ? (
                    <span
                      style={{
                        color: Colors.VEGA_RED,
                        textTransform: 'uppercase',
                        fontSize: '0.8rem',
                        marginLeft: '1rem'
                      }}
                    >
                      Tainted
                    </span>
                  ) : (
                    ''
                  )}
                </span>
                <span
                  style={{
                    display: 'block',
                    color: Colors.TEXT_COLOR_DEEMPHASISE
                  }}
                >
                  {kp.publicKey && truncateMiddle(kp.publicKey)}
                </span>
              </NavLink>
            </div>
          </SidebarListItem>
        ))}
      </ul>
      <ButtonGroup orientation='vertical' style={{ padding: 20 }}>
        <Button
          onClick={() => {
            if (wallet?.name) {
              dispatch(actions.addKeypairAction(wallet?.name))
            }
            dispatch({ type: 'SET_SIDEBAR', open: false })
          }}
          data-testid='generate-keypair'
        >
          Generate key pair
        </Button>
        <Link
          to='delete'
          onClick={() => dispatch({ type: 'SET_SIDEBAR', open: false })}
          data-testid='delete-wallet'
        >
          <Button style={{ width: '100%' }}>Delete wallet</Button>
        </Link>
      </ButtonGroup>
      <div style={{ textAlign: 'center', padding: '0 20px 20px' }}>
        <button
          onClick={() => dispatch({ type: 'SET_SETTINGS_MODAL', open: true })}
          style={{ textDecoration: 'underline' }}
          data-testid='wallet-app-settings'
        >
          App settings
        </button>
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
      data-testid='wallet-item'
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
