import { Outlet, Route, Routes } from 'react-router-dom'

import { Home } from './home'
import { Onboard } from './onboard'
import { WalletCreate } from './wallet-create'
import { WalletImport } from './wallet-import'
import { Wallet } from './wallet'
import { WalletList } from './wallet/home'
import { WalletKeyPair } from './wallet/keypair'
import { KeyPairHome } from './wallet/keypair/home'
import { Transactions } from './wallet/keypair/transactions'

// Root paths start with '/'
export enum Paths {
  Home = '/',
  Onboard = '/onboard',
  Wallet = '/wallet'
}

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Outlet />}>
        <Route index={true} element={<Home />} />
        <Route path='onboard' element={<Onboard />} />
        <Route path='wallet-create' element={<WalletCreate />} />
        <Route path='wallet-import' element={<WalletImport />} />
        <Route path='wallet/:wallet' element={<Wallet />}>
          <Route index={true} element={<WalletList />} />
          <Route path='keypair/:pubkey' element={<WalletKeyPair />}>
            <Route index={true} element={<KeyPairHome />} />
            <Route path='transactions' element={<Transactions />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
