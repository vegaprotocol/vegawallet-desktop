import React from 'react'
import { Link } from 'react-router-dom'
import { WalletPaths } from '.'
import { BulletHeader } from '../../components/bullet-header'
import { changeWalletAction } from '../../contexts/global/global-actions'
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
            <li
              key={wallet.name}
              style={{
                marginBottom: 10
              }}>
              <Link
                to={WalletPaths.Home}
                onClick={() => dispatch(changeWalletAction(wallet.name))}>
                {wallet.name}
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
