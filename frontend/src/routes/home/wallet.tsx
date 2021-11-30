import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Redirect } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
import { Copy } from '../../components/icons/copy'
import { useGlobal } from '../../contexts/global/global-context'

export function Wallet() {
  const { state } = useGlobal()

  if (!state.wallet) {
    return <Redirect to='/' />
  }

  if (state.keypairs === null) {
    return <Redirect to='/wallet/auth' />
  }

  return (
    <>
      <BulletHeader tag='h1'>{state.wallet}</BulletHeader>
      {state.keypairs.length ? (
        <ul>
          {state.keypairs.map(kp => (
            <li key={kp.PublicKey} style={{ marginBottom: 10 }}>
              <CopyToClipboard text={kp.PublicKey}>
                <button
                  style={{
                    appearance: 'none',
                    border: 0,
                    background: 'transparent',
                    padding: 0
                  }}>
                  {state.keypair?.Name}{' '}
                  <span className='text-muted'>
                    {kp.PublicKeyShort}{' '}
                    <Copy style={{ width: 10, height: 10 }} />
                  </span>
                </button>
              </CopyToClipboard>
            </li>
          ))}
        </ul>
      ) : (
        <p>No keypairs in this wallet</p>
      )}
    </>
  )
}
