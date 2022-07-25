import { Outlet, Route, Routes, useLocation } from 'react-router-dom'

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
import { Settings } from './settings'
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
  const location = useLocation()
  // @ts-ignore types dont appear to be set up to take state from link
  const background = location.state && location.state.background
  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<Outlet />}>
          <Route index={true} element={<Home />} />
          <Route path='onboard' element={<Onboard />}>
            <Route index={true} element={<OnboardHome />} />
            <Route path='settings' element={<OnboardSettings />} />
            <Route path='wallet-create' element={<OnboardWalletCreate />} />
            <Route path='wallet-import' element={<OnboardWalletImport />} />
            <Route path='network' element={<OnboardNetwork />} />
          </Route>
          <Route path='wallet-create' element={<WalletCreate />} />
          <Route path='wallet-import' element={<WalletImport />} />
          <Route path='network-import' element={<NetworkImport />} />
          <Route path='wallet/:wallet' element={<Wallet />}>
            <Route
              index={true}
              element={
                <Center>
                  <p>Select a key</p>
                </Center>
              }
            />
            <Route path='settings' element={<Settings />} />
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
      {background && (
        <Routes>
          <Route path='settings' element={<Settings />} />
          <Route path='wallet/:wallet/settings' element={<Settings />} />
        </Routes>
      )}
    </>
  )
}
