import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { Copy } from '../../components/icons/copy'
import { useGlobal } from '../../contexts/global/global-context'

export function Wallet() {
  const { state } = useGlobal()

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
        <ul>
          {state.wallet.keypairs.map(kp => {
            return (
              <li key={kp.publicKey} style={{ marginBottom: 10 }}>
                <Link to={`/wallet/${kp.publicKey}`}>{kp.name}</Link>{' '}
                <CopyWithTooltip text={kp.publicKey}>
                  <ButtonUnstyled>
                    <span className='text-muted'>
                      {kp.PublicKeyShort}{' '}
                      <Copy style={{ width: 10, height: 10 }} />
                    </span>
                  </ButtonUnstyled>
                </CopyWithTooltip>
              </li>
            )
          })}
        </ul>
      ) : (
        <p>No keypairs in this wallet</p>
      )}
    </>
  )
}
