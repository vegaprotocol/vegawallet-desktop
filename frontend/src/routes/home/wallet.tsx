import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { WalletPaths } from '.'
import { BulletHeader } from '../../components/bullet-header'
import { Button } from '../../components/button'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { Copy } from '../../components/icons/copy'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import { addKeypairAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../router-config'

export function Wallet() {
  const { state, dispatch } = useGlobal()

  async function generateKeypair() {
    if (!state.wallet?.name) {
      AppToaster.show({ message: 'No wallet', intent: Intent.DANGER })
      return
    }

    dispatch(addKeypairAction(state.wallet.name))
  }

  if (!state.wallets.length || !state.wallet) {
    return <Redirect to={Paths.Home} />
  }

  return (
    <>
      <div>
        <Link to={Paths.Home}>Back</Link>
      </div>
      <BulletHeader tag='h1'>{state.wallet.name}</BulletHeader>
      {state.wallet.keypairs?.length ? (
        <ul style={{ marginBottom: 15 }}>
          {state.wallet.keypairs.map(kp => {
            return (
              <li
                key={kp.publicKey}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 10
                }}>
                <Link to={`${WalletPaths.Home}/${kp.publicKey}`}>
                  {kp.name}
                </Link>{' '}
                <CopyWithTooltip text={kp.publicKey}>
                  <span
                    style={{
                      color: Colors.TEXT_MUTED,
                      fontFamily: '"Roboto Mono", monospace'
                    }}>
                    {kp.publicKeyShort}{' '}
                    <Copy style={{ width: 12, height: 12 }} />
                  </span>
                </CopyWithTooltip>
              </li>
            )
          })}
        </ul>
      ) : null}
      <p>
        <Button onClick={generateKeypair}>Generate Keypair</Button>
      </p>
    </>
  )
}
