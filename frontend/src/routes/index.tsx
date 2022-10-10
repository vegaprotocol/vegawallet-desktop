import { Outlet, Route, Routes } from 'react-router-dom'

import { Center } from '../components/center'
import { Home } from './home'
import { Onboard } from './onboard'
import { Wallet } from './wallet'
import { Delete } from './wallet/delete'
import { KeyPairHome } from './wallet/keypair/home'
import { Metadata } from './wallet/keypair/metadata'
import { Sign } from './wallet/keypair/sign'
import { Taint } from './wallet/keypair/taint'
import { WalletKeyPair } from './wallet/wallet-key-pair'
import { WalletCreate } from './wallet-create'
import { WalletImport } from './wallet-import'

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
          <Route
            index={true}
            element={
              <Center>
                <p>Select a key</p>
              </Center>
            }
          />
          <Route path='delete' element={<Delete />} />
          <Route path='keypair/:pubkey' element={<WalletKeyPair />}>
            <Route index={true} element={<KeyPairHome />} />
            <Route path='sign' element={<Sign />} />
            <Route path='taint' element={<Taint />} />
            <Route path='metadata' element={<Metadata />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
