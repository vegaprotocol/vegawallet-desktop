import { Route, Routes } from 'react-router-dom'

import { Home } from './home'
import {
  Onboard,
  OnboardHome,
  OnboardNetwork,
  OnboardSettings,
  OnboardWalletCreate,
  OnboardWalletImport
} from './onboard'
import { Wallet } from './wallet'
import { Sign } from './wallet/sign'
import { WalletKeyPair } from './wallet/wallet-key-pair'
import { WalletCreate } from './wallet-create'
import { WalletImport } from './wallet-import'

// Root paths start with '/'
export enum Paths {
  Home = '/',
  Onboard = '/onboard',
  Wallet = '/wallet'
}

export enum OnboardPaths {
  Settings = 'settings',
  WalletCreate = 'wallet-create',
  WalletImport = 'wallet-import',
  Network = 'network'
}

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/onboard' element={<Onboard />}>
        <Route index={true} element={<OnboardHome />} />
        <Route path='settings' element={<OnboardSettings />} />
        <Route path='wallet-create' element={<OnboardWalletCreate />} />
        <Route path='wallet-import' element={<OnboardWalletImport />} />
        <Route path='network' element={<OnboardNetwork />} />
      </Route>
      <Route path='/wallet/:wallet' element={<Wallet />}>
        <Route index={true} element={<div>Select a key</div>} />
        <Route path='keypair/:pubkey' element={<WalletKeyPair />} />
      </Route>
    </Routes>
  )
}
