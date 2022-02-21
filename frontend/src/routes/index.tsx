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
import { WalletKeyPair } from './wallet/wallet-key-pair'
import { WalletList } from './wallet/wallet-list'
import { WalletCreate } from './wallet-create'
import { WalletImport } from './wallet-import'

export enum Paths {
  Home = '/',
  Onboard = '/onboard',
  Wallet = '/wallet',
  WalletCreate = '/wallet-create',
  WalletImport = '/wallet-import'
}

export enum OnboardPaths {
  Home = '/onboard',
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
          // default child route, Wallet only renders an Outlet
          path: '',
          element: <WalletList />,
          index: true
        },
        {
          path: 'keypair/:pubkey',
          element: <WalletKeyPair />
        }
      ]
    },
    {
      path: Paths.Home,
      element: <Home />,
      index: true
    }
  ])

  // Wrap onboard pages with splash page
  if (isOnboard) {
    return <Splash>{routes}</Splash>
  }

  // Rest of the pages get regular chrome with network drawer
  return <Chrome>{routes}</Chrome>
}
