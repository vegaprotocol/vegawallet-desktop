import './wallet-list.scss'
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
      {wallets.length ? (
        <ul className='wallet-list'>
          {wallets.map(wallet => (
            <li key={wallet} style={{ marginBottom: 5 }}>
              <span>{wallet}</span>
              <Link
                to='/wallet'
                onClick={() => dispatch({ type: 'CHANGE_WALLET', wallet })}>
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
