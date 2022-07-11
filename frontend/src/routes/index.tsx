import { Route, Routes } from 'react-router-dom'

import { Center } from '../components/center'
import { Home } from './home'
import { NetworkImport } from './network-import'
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
        <Route
          index={true}
          element={
            <Center>
              <p>Select a key</p>
            </Center>
          }
        />
        <Route path='keypair/:pubkey' element={<WalletKeyPair />} />
        <Route path='keypair/:pubkey/sign' element={<Sign />} />
      </Route>
      <Route path='/wallet-create' element={<WalletCreate />} />
      <Route path='/wallet-import' element={<WalletImport />} />
      <Route path='/network-import' element={<NetworkImport />} />
    </Routes>
  )
}
