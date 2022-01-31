import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { WalletPaths } from '.'
import { Header } from '../../components/header'
import { Button } from '../../components/button'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { Copy } from '../../components/icons/copy'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { Fonts } from '../../config/fonts'
import { Intent } from '../../config/intent'
import { addKeypairAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../router-config'

export function WalletDetail() {
  const { state, dispatch } = useGlobal()

  async function generateKeypair() {
    if (!state.wallet?.name) {
      AppToaster.show({ message: 'No wallet', intent: Intent.DANGER })
      return
    }

    dispatch(addKeypairAction(state.wallet.name))
  }

  if (!state.wallets.length || !state.wallet) {
    return <Redirect to={Paths.Wallet} />
  }

  return (
    <>
      <Header>
        Wallet name:{' '}
        <span style={{ color: Colors.TEXT_COLOR_DEEMPHASISE }}>
          {state.wallet.name}
        </span>
      </Header>
      {state.wallet.keypairs?.length ? (
        <table style={{ marginBottom: 15 }}>
          <thead>
            <tr>
              <th style={{ padding: 0 }}>Keypair name</th>
              <th style={{ textAlign: 'right', padding: 0 }}>Public key</th>
            </tr>
          </thead>
          <tbody>
            {state.wallet.keypairs.map(kp => {
              return (
                <tr key={kp.publicKey}>
                  <td style={{ textAlign: 'left', padding: 0 }}>
                    <Link to={`${WalletPaths.Keypair}/${kp.publicKey}`}>
                      {kp.name}
                    </Link>
                  </td>
                  <td style={{ padding: 0 }}>
                    <CopyWithTooltip text={kp.publicKey}>
                      <ButtonUnstyled
                        style={{
                          color: Colors.TEXT_COLOR_DEEMPHASISE,
                          fontFamily: Fonts.MONO
                        }}>
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
      <p>
        <Button onClick={generateKeypair}>Generate Keypair</Button>
      </p>
    </>
  )
}
