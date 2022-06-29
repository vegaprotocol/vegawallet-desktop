import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { Header } from '../../components/header'
import { Copy } from '../../components/icons/copy'
import { Lock } from '../../components/icons/lock'
import { Unlock } from '../../components/icons/unlock'
import { Colors } from '../../config/colors'
import { Fonts } from '../../config/fonts'
import {
  addKeypairAction,
  changeWalletAction,
  deactivateWalletAction,
  getKeysAction
} from '../../contexts/global/global-actions'
import type { KeyPair, Wallet } from '../../contexts/global/global-context'
import { useGlobal } from '../../contexts/global/global-context'
import { useAccounts } from '../../hooks/use-accounts'
import { Paths } from '../'

export const WalletList = () => {
  const {
    state: { wallets },
    dispatch
  } = useGlobal()

  function handleUnlock(wallet: Wallet) {
    if (!wallet.auth) {
      dispatch(getKeysAction(wallet.name))
    }
  }

  function handleLock(wallet: Wallet) {
    if (wallet.auth) {
      dispatch(deactivateWalletAction(wallet.name))
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'min-content 1fr min-content',
        height: '100%'
      }}
    >
      <div style={{ padding: 20 }}>
        <Header
          style={{
            margin: 0
          }}
          data-testid='wallets-header'
        >
          Wallets
        </Header>
      </div>
      <div>
        {wallets.length ? (
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
        ) : (
          <div style={{ padding: '0 20px' }}>
            <p>No wallets</p>
          </div>
        )}
      </div>
      <div style={{ padding: 20 }}>
        <AddButtons />
      </div>
    </div>
  )
}

interface WalletListItemProps {
  wallet: Wallet
  onUnlock: (wallet: Wallet) => void
  onLock: (wallet: Wallet) => void
}

function WalletListItem({ wallet, onUnlock, onLock }: WalletListItemProps) {
  const [hover, setHover] = React.useState(false)

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
        borderTop: `1px solid ${Colors.BLACK}`
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
      {wallet.auth && <WalletDetail wallet={wallet} onLock={onLock} />}
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

interface WalletDetailProps {
  wallet: Wallet
  onLock: (wallet: Wallet) => void
}

function WalletDetail({ wallet, onLock }: WalletDetailProps) {
  const { dispatch } = useGlobal()

  return (
    <div style={{ marginTop: 20 }}>
      {wallet.keypairs?.length ? (
        <div>
          {wallet.keypairs.map(kp => {
            return (
              <KeyPairDetail
                keypair={kp}
                key={kp.publicKey}
                walletName={wallet.name}
              />
            )
          })}
        </div>
      ) : null}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 20
        }}
      >
        <ButtonUnstyled
          data-testid='generate-keypair'
          onClick={() => dispatch(addKeypairAction(wallet.name))}
        >
          Generate key pair
        </ButtonUnstyled>
        <ButtonUnstyled data-testid='lock' onClick={() => onLock(wallet)}>
          Lock
        </ButtonUnstyled>
      </div>
    </div>
  )
}

interface KeyPairDetailProps {
  keypair: KeyPair
  walletName: string
}

function KeyPairDetail({ keypair, walletName }: KeyPairDetailProps) {
  const { dispatch } = useGlobal()
  const { accounts, loading, error } = useAccounts(keypair.publicKey)

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
    <div key={keypair.publicKey}>
      <p>
        <Link
          onClick={() => {
            dispatch(changeWalletAction(walletName))
          }}
          to={`keypair/${keypair.publicKey}`}
        >
          {keypair.name}
        </Link>
      </p>
      <p>
        <CopyWithTooltip text={keypair.publicKey}>
          <ButtonUnstyled
            style={{
              color: Colors.TEXT_COLOR_DEEMPHASISE,
              fontFamily: Fonts.MONO,
              textDecoration: 'none'
            }}
          >
            {keypair.publicKeyShort}{' '}
            <Copy
              style={{
                position: 'relative',
                top: -2,
                width: 12,
                height: 12
              }}
            />
          </ButtonUnstyled>
        </CopyWithTooltip>
      </p>
      <p>{renderAccountInfo()}</p>
    </div>
  )
}
