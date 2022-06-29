import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Colors } from '../../config/colors'
import {
  addKeypairAction,
  deactivateWalletAction,
  getKeysAction
} from '../../contexts/global/global-actions'
import type { Wallet } from '../../contexts/global/global-context'
import { useGlobal } from '../../contexts/global/global-context'
import { truncateMiddle } from '../../lib/truncate-middle'
import { Paths } from '../../routes'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { Lock } from '../icons/lock'
import { Unlock } from '../icons/unlock'

export function ChromeSidebar() {
  const navigate = useNavigate()
  const {
    state: { wallets, wallet },
    dispatch
  } = useGlobal()

  function handleUnlock(wallet: Wallet) {
    if (!wallet.auth) {
      dispatch(
        getKeysAction(wallet.name, success => {
          if (success) {
            navigate(`wallet/${wallet.name}`)
          }
        })
      )
    }
  }

  function handleLock(wallet: Wallet) {
    if (wallet.auth) {
      dispatch(deactivateWalletAction(wallet.name))
      navigate(Paths.Wallet)
    }
  }

  return (
    <aside style={{ background: Colors.DARK_GRAY_2 }}>
      {wallet?.auth ? (
        <KeyPairList />
      ) : (
        <>
          <ul>
            {wallets.map(wallet => (
              <WalletListItem
                key={wallet.name}
                wallet={wallet}
                onUnlock={handleUnlock}
                onLock={handleLock}
              />
            ))}
          </ul>
          <div style={{ padding: 20 }}>
            <AddButtons />
          </div>
        </>
      )}
    </aside>
  )
}

function KeyPairList() {
  const navigate = useNavigate()
  const {
    state: { wallet },
    dispatch
  } = useGlobal()

  if (!wallet?.keypairs?.length) {
    return <p>No keypairs. TODO: Generate one</p>
  }

  return (
    <>
      <ul>
        {wallet.keypairs.map(kp => (
          <li
            key={kp.publicKey}
            style={{
              padding: 20,
              background: Colors.DARK_GRAY_2,
              borderBottom: `1px solid ${Colors.BLACK}`,
              cursor: 'pointer'
            }}
            tabIndex={0}
            onClick={() =>
              navigate(`/wallet/${wallet.name}/keypair/${kp.publicKey}`)
            }
          >
            <div>{kp.name}</div>
            <div>{truncateMiddle(kp.publicKey)}</div>
          </li>
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
  onLock: (wallet: Wallet) => void
}

function WalletListItem({ wallet, onUnlock, onLock }: WalletListItemProps) {
  const [hover, setHover] = useState(false)

  const getBgColor = (wallet: Wallet) => {
    if (wallet.auth) {
      return Colors.DARK_GRAY_2
    }

    if (hover) {
      return Colors.DARK_GRAY_3
    }

    return 'none'
  }

  return (
    <li
      data-testid='wallet-list'
      key={wallet.name}
      tabIndex={0}
      onClick={() => onUnlock(wallet)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 20,
        background: getBgColor(wallet),
        cursor: wallet.auth ? 'default' : 'pointer',
        borderBottom: `1px solid ${Colors.BLACK}`
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <span>{wallet.name}</span>
        <KeypairLockStatus wallet={wallet} />
      </div>
      {/* {wallet.auth && <WalletDetail wallet={wallet} onLock={onLock} />} */}
    </li>
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
