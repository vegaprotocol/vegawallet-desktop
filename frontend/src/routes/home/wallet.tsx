import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
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
              <li key={kp.PublicKey} style={{ marginBottom: 10 }}>
                <Link to={`/wallet/${kp.PublicKey}`}>{kp.Name}</Link>{' '}
                <CopyWithTooltip text={kp.PublicKey}>
                  <button
                    style={{
                      appearance: 'none',
                      border: 0,
                      background: 'transparent',
                      padding: 0
                    }}>
                    <span className='text-muted'>
                      {kp.PublicKeyShort}{' '}
                      <Copy style={{ width: 10, height: 10 }} />
                    </span>
                  </button>
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
