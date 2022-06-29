import type { ReactNode } from 'react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useRoutes } from 'react-router-dom'

import { Colors } from '../../config/colors'
import {
  addKeypairAction,
  deactivateWalletAction,
  getKeysAction
} from '../../contexts/global/global-actions'
import type { Wallet } from '../../contexts/global/global-context'
import { useGlobal } from '../../contexts/global/global-context'
import { useAccounts } from '../../hooks/use-accounts'
import { truncateMiddle } from '../../lib/truncate-middle'
import { Paths } from '../../routes'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { ButtonUnstyled } from '../button-unstyled'
import { Header } from '../header'
import { Lock } from '../icons/lock'
import { Unlock } from '../icons/unlock'

export function ChromeSidebar() {
  const routes = useRoutes([
    {
      path: Paths.Wallet,
      element: <Outlet />,
      children: [
        {
          element: <WalletList />,
          index: true
        },
        {
          path: ':wallet/*',
          element: <KeyPairList />
        }
      ]
    }
  ])

  return <aside style={{ background: Colors.DARK_GRAY_2 }}>{routes}</aside>
}

function WalletList() {
  const navigate = useNavigate()
  const {
    state: { wallets },
    dispatch
  } = useGlobal()

  function handleUnlock(wallet: Wallet) {
    if (!wallet.auth) {
      dispatch(
        getKeysAction(wallet.name, success => {
          if (success) {
            navigate(wallet.name)
          }
        })
      )
    } else {
      navigate(wallet.name)
    }
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
          <Header style={{ margin: 0 }}>Select wallet</Header>
          <ButtonUnstyled onClick={() => navigate(-1)}>Back</ButtonUnstyled>
        </div>
      </div>
      <ul style={{ borderTop: `1px solid ${Colors.BLACK}` }}>
        {wallets.map(wallet => (
          <WalletListItem
            key={wallet.name}
            wallet={wallet}
            onUnlock={handleUnlock}
          />
        ))}
      </ul>
      <div style={{ padding: 20 }}>
        <AddButtons />
      </div>
    </>
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
      navigate(Paths.Wallet)
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
          <ButtonUnstyled onClick={() => handleLock(wallet)}>
            Lock
          </ButtonUnstyled>
        </div>
      </div>
      <ul style={{ borderTop: `1px solid ${Colors.BLACK}` }}>
        {wallet.keypairs.map(kp => (
          <SidebarListItem key={kp.publicKey}>
            <div>
              <NavLink
                to={`keypair/${kp.publicKey}`}
                style={{
                  display: 'block',
                  padding: 20,
                  textDecoration: 'none'
                }}
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
        <ButtonGroup orientation='vertical'>
          <Button onClick={() => dispatch(addKeypairAction(wallet.name))}>
            Generate key pair
          </Button>
        </ButtonGroup>
      </div>
    </>
  )
}

interface WalletListItemProps {
  wallet: Wallet
  onUnlock: (wallet: Wallet) => void
}

function WalletListItem({ wallet, onUnlock }: WalletListItemProps) {
  return (
    <SidebarListItem key={wallet.name}>
      <NavLink
        to={wallet.name}
        onClick={() => onUnlock(wallet)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          padding: 20,
          textDecoration: 'none'
        }}
      >
        <span>{wallet.name}</span>
        <KeypairLockStatus wallet={wallet} />
      </NavLink>
    </SidebarListItem>
  )
}

interface KeypairLockStatusProps {
  wallet: Wallet
}

function KeypairLockStatus({ wallet }: KeypairLockStatusProps) {
  const iconStyles: React.CSSProperties = {
    position: 'relative',
    top: -2,
    width: 12,
    height: 12
  }

  return (
    <div>
      {wallet.auth ? (
        <>
          Unlocked <Unlock style={iconStyles} />
        </>
      ) : (
        <>
          Locked <Lock style={iconStyles} />
        </>
      )}
    </div>
  )
}

function AddButtons() {
  const navigate = useNavigate()
  return (
    <div style={{ marginTop: 20 }}>
      <ButtonGroup orientation='vertical'>
        {[
          {
            path: Paths.WalletCreate,
            text: 'Create new',
            testId: 'create-new-wallet'
          },
          {
            path: Paths.WalletImport,
            text: 'Import by recovery phrase',
            testId: 'import-wallet'
          }
        ].map(route => {
          return (
            <Button
              data-testid={route.testId}
              key={route.path}
              onClick={() => navigate(route.path)}
            >
              {route.text}
            </Button>
          )
        })}
      </ButtonGroup>
    </div>
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
