import './wallet-list.scss'
import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
import { IsAppInitialised, ListWallets } from '../../api/service'

enum WalletStatus {
  Pending,
  Ready,
  None
}

export function WalletList() {
  const [walletStatus, setWalletStatus] = React.useState(WalletStatus.Pending)
  const [wallets, setWallets] = React.useState<string[]>([])

  React.useEffect(() => {
    async function run() {
      try {
        const isInit = await IsAppInitialised()

        if (!isInit) {
          setWalletStatus(WalletStatus.None)
          return
        }

        const res = await ListWallets()
        setWallets(res.Wallets)
        setWalletStatus(WalletStatus.Ready)
      } catch (err) {
        setWalletStatus(WalletStatus.None)
      }
    }

    run()
  }, [])

  if (walletStatus === WalletStatus.Pending) {
    return null
  }

  if (walletStatus === WalletStatus.None) {
    return <Redirect to='/import' />
  }

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
