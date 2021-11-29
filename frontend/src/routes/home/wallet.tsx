import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
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
      <BulletHeader tag='h1'>
        {state.wallet} / <Link to='/'>Back</Link>
      </BulletHeader>
      {state.keypairs.length ? (
        <ul>
          {state.keypairs.map(kp => (
            <li key={kp.PublicKey} style={{ marginBottom: 15 }}>
              <p>
                {kp.Name} - {kp.PublicKeyShort}
                {state.keypair?.PublicKey === kp.PublicKey ? ' (selected)' : ''}
              </p>
              <div>
                <pre>{JSON.stringify(kp, null, 2)}</pre>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No wallets</p>
      )}
    </>
  )
}
