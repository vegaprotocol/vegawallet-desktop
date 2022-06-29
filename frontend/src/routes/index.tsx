import { useRoutes } from 'react-router-dom'

import { Chrome } from '../components/chrome'
import {
  Onboard,
  OnboardHome,
  OnboardNetwork,
  OnboardSettings,
  OnboardWalletCreate,
  OnboardWalletImport
} from '../components/onboard'
import { Splash } from '../components/splash'
import { useIsOnboard } from '../hooks/use-is-onboard'
import { Home } from './home'
import { Wallet } from './wallet'
import { Sign } from './wallet/sign'
import { WalletKeyPair } from './wallet/wallet-key-pair'
import { WalletList } from './wallet/wallet-list'
import { WalletCreate } from './wallet-create'
import { WalletImport } from './wallet-import'

// Root paths start with '/'
export enum Paths {
  Home = '/',
  Onboard = '/onboard',
  Wallet = '/wallet',
  WalletCreate = '/wallet-create',
  WalletImport = '/wallet-import'
}

// Nested paths DONT have '/'
export enum OnboardPaths {
  Settings = '/onboard/settings',
  WalletCreate = '/onboard/wallet-create',
  WalletImport = '/onboard/wallet-import',
  Network = '/onboard/network'
}

export const AppRouter = () => {
  const isOnboard = useIsOnboard()

  const routes = useRoutes([
    {
      path: Paths.Onboard,
      element: <Onboard />,
      children: [
        {
          index: true,
          element: <OnboardHome />
        },
        {
          path: OnboardPaths.Settings,
          element: <OnboardSettings />
        },
        {
          path: OnboardPaths.WalletCreate,
          element: <OnboardWalletCreate />
        },
        {
          path: OnboardPaths.WalletImport,
          element: <OnboardWalletImport />
        },
        {
          path: OnboardPaths.Network,
          element: <OnboardNetwork />
        }
      ]
    },
    {
      path: Paths.WalletCreate,
      element: <WalletCreate />
    },
    {
      path: Paths.WalletImport,
      element: <WalletImport />
    },
    {
      path: Paths.Wallet,
      element: <Wallet />,
      children: [
        {
          path: ':wallet',
          element: (
            <div style={{ padding: 20 }}>
              <p>Select a key</p>
            </div>
          )
        },
        {
          path: ':wallet/keypair/:pubkey',
          element: <WalletKeyPair />
        },
        {
          path: ':wallet/keypair/:pubkey/sign',
          element: <Sign />
        },
        {
          index: true,
          element: (
            <div style={{ padding: 20 }}>
              <p>Select a wallet</p>
            </div>
          )
        }
      ]
    },
    {
      element: <Home />,
      index: true
    }
  ])

  // Wrap onboard pages with splash page
  if (isOnboard) {
    return <Splash>{routes}</Splash>
  }

  // Rest of the pages get regular chrome with network
  return <Chrome>{routes}</Chrome>
}
