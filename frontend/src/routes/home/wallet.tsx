import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { GenerateKey } from '../../api/service'
import { BulletHeader } from '../../components/bullet-header'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { Copy } from '../../components/icons/copy'
import { useGlobal } from '../../contexts/global/global-context'

export function Wallet() {
  const { state, dispatch } = useGlobal()

  async function generateKeypair() {
    if (!state.wallet?.name) {
      throw new Error('No wallet set')
    }

    try {
      const res = await GenerateKey({
        wallet: state.wallet.name,
        passphrase: state.passphrase,
        metadata: [] // just rely on default naming for now
      })
      dispatch({
        type: 'ADD_KEYPAIR',
        wallet: state.wallet.name,
        keypair: res.key
      })
    } catch (err) {
      console.log(err)
    }
  }

  if (!state.wallets.length) {
    return <Redirect to='/' />
  }

  if (!state.wallet?.keypairs) {
    return <Redirect to='/wallet/auth' />
  }

  return (
    <>
      <BulletHeader tag='h1'>{state.wallet.name}</BulletHeader>
      {state.wallet.keypairs.length ? (
        <ul style={{ marginBottom: 15 }}>
          {state.wallet.keypairs.map(kp => {
            return (
              <li key={kp.publicKey} style={{ marginBottom: 10 }}>
                <Link to={`/wallet/${kp.publicKey}`}>{kp.name}</Link>{' '}
                <CopyWithTooltip text={kp.publicKey}>
                  <ButtonUnstyled>
                    <span className='text-muted'>
                      {kp.publicKeyShort}{' '}
                      <Copy style={{ width: 10, height: 10 }} />
                    </span>
                  </ButtonUnstyled>
                </CopyWithTooltip>
              </li>
            )
          })}
        </ul>
      ) : null}
      <p>
        <button onClick={generateKeypair} type='button'>
          Generate Keypair
        </button>
      </p>
    </>
  )
}
