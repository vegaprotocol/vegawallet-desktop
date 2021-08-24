import './wallet-list.scss'
import React from 'react'
import { Link } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'

interface WalletListProps {
  wallets: string[]
}

export const WalletList = ({ wallets }: WalletListProps) => {
  return (
    <>
      <BulletHeader tag='h1'>Wallets</BulletHeader>
      {wallets.length ? (
        <ul className='wallet-list'>
          {wallets.map(wallet => (
            <li key={wallet} style={{ marginBottom: 5 }}>
              <span>{wallet}</span>
              <Link to={`/wallet/${wallet}`}>View</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No wallets</p>
      )}
    </>
  )
}
