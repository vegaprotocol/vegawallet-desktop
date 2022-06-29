import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { Header } from '../../components/header'
import { Copy } from '../../components/icons/copy'
import { Colors } from '../../config/colors'
import { Fonts } from '../../config/fonts'
import {
  addKeypairAction,
  changeWalletAction
} from '../../contexts/global/global-actions'
import type { KeyPair, Wallet } from '../../contexts/global/global-context'
import { useGlobal } from '../../contexts/global/global-context'
import { useAccounts } from '../../hooks/use-accounts'
import { Paths } from '../'

export const WalletList = () => {
  const {
    state: { wallet }
  } = useGlobal()

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'min-content 1fr min-content',
        height: '100%'
      }}
    >
      <div>
        {wallet && wallet.auth ? (
          <div>{wallet.name}</div>
        ) : (
          <div style={{ padding: '0 20px' }}>
            <p>No wallet selected</p>
          </div>
        )}
      </div>
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
          to={`${walletName}/keypair/${keypair.publicKey}`}
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
