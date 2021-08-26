import './wallet-list.scss'
import React from 'react'
import { Link } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
import { Wallets } from './wallet-container'

interface WalletListProps {
  wallets: Wallets
}

export const WalletList = ({ wallets }: WalletListProps) => {
  const walletNames = Object.keys(wallets)
  return (
    <>
      <BulletHeader tag='h1'>Wallets</BulletHeader>
      {walletNames.length ? (
        <ul className='wallet-list'>
          {walletNames.map(wallet => (
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
