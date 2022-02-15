import { useRoutes } from 'react-router-dom'

import { Home } from './home'
import { Wallet } from './wallet'
import { WalletKeyPair } from './wallet/wallet-key-pair'
import { WalletList } from './wallet/wallet-list'
import { WalletCreate } from './wallet-create'
import { WalletImport } from './wallet-import'

export enum Paths {
  Home = '/',
  Wallet = '/wallet',
  WalletCreate = '/wallet-create',
  WalletImport = '/wallet-import'
}

export const AppRouter = () => {
  const routes = useRoutes([
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

  return routes
}
