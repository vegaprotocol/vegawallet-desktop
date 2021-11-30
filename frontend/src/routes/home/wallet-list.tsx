import React from 'react'
import { Link } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
import { useGlobal } from '../../contexts/global/global-context'

export const WalletList = () => {
  const {
    state: { wallets },
    dispatch
  } = useGlobal()

  return (
    <>
      <BulletHeader tag='h1'>Wallets</BulletHeader>
      <p>
        <Link to='/import'>Create/Import Wallet</Link>
      </p>
      {wallets.length ? (
        <ul className='wallet-list'>
          {wallets.map(wallet => (
            <li
              key={wallet.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                textTransform: 'uppercase',
                alignItems: 'center',
                marginBottom: 10
              }}>
              <span>{wallet.name}</span>
              <Link
                to='/wallet'
                onClick={() =>
                  dispatch({ type: 'CHANGE_WALLET', wallet: wallet.name })
                }>
                Select
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No wallets</p>
      )}
    </>
  )
}
