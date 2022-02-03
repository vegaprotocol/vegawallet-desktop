import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Header } from '../../components/header'
import { Button } from '../../components/button'
import { ButtonUnstyled } from '../../components/button-unstyled'
import {
  chnageWalletAction,
  deactivateWalletAction,
  getKeysAction
} from '../../contexts/global/global-actions'
import { useGlobal, Wallet } from '../../contexts/global/global-context'
import { Paths } from '../router-config'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { WalletPaths } from '.'
import { Colors } from '../../config/colors'
import { Fonts } from '../../config/fonts'
import { Copy } from '../../components/icons/copy'
import { ButtonGroup } from '../../components/button-group'
import { Lock } from '../../components/icons/lock'
import { Unlock } from '../../components/icons/unlock'

export const WalletList = () => {
  const {
    state: { wallets },
    dispatch
  } = useGlobal()

  function toggleLockKeypair(wallet: Wallet) {
    if (wallet.auth) {
      dispatch(deactivateWalletAction(wallet.name))
    } else {
      dispatch(getKeysAction(wallet.name))
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
                onWalletSelect={toggleLockKeypair}
              />
            ))}
          </ul>
        ) : (
          <p>No wallets</p>
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
  onWalletSelect: (wallet: Wallet) => void
}

function WalletListItem({ wallet, onWalletSelect }: WalletListItemProps) {
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
      key={wallet.name}
      tabIndex={0}
      onClick={() => onWalletSelect(wallet)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 20,
        background: getBgColor(wallet),
        cursor: 'pointer',
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
      {wallet.auth && <WalletDetail wallet={wallet} />}
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
  const history = useHistory()
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
              onClick={() => history.push(route.path)}
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
}

function WalletDetail({ wallet }: WalletDetailProps) {
  const { dispatch } = useGlobal()

  return (
    <div style={{ marginTop: 20 }}>
      {wallet.keypairs?.length ? (
        <table>
          <thead>
            <tr>
              <th style={{ padding: 0 }}>Keypair name</th>
              <th style={{ textAlign: 'right', padding: 0 }}>Public key</th>
            </tr>
          </thead>
          <tbody>
            {wallet.keypairs.map(kp => {
              return (
                <tr key={kp.publicKey}>
                  <td style={{ textAlign: 'left', padding: 0 }}>
                    <Link
                      onClick={() => {
                        dispatch(chnageWalletAction(wallet.name))
                      }}
                      to={`${WalletPaths.Keypair}/${kp.publicKey}`}
                    >
                      {kp.name}
                    </Link>
                  </td>
                  <td style={{ padding: 0 }}>
                    <CopyWithTooltip text={kp.publicKey}>
                      <ButtonUnstyled
                        style={{
                          color: Colors.TEXT_COLOR_DEEMPHASISE,
                          fontFamily: Fonts.MONO
                        }}
                      >
                        {kp.publicKeyShort}{' '}
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
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <p>No keypairs</p>
      )}
    </div>
  )
}
