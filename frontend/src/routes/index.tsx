import { useMatch, useRoutes } from 'react-router-dom'

import { Chrome } from '../components/chrome'
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

export const AppRouter = () => {
  const onboardMatch = useMatch(Paths.Onboard)

  const routes = useRoutes([
    {
      path: Paths.Onboard,
      element: <div>Onboard</div>
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

  if (onboardMatch) {
    return routes
  }

  return <Chrome>{routes}</Chrome>
}
