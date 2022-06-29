import { useRoutes } from 'react-router-dom'

import { Chrome } from '../components/chrome'
import { Home } from './home'
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
  const routes = useRoutes([
    {
      path: Paths.Wallet,
      element: <Wallet />,
      children: [
        {
          path: 'create',
          element: <WalletCreate />
        },
        {
          path: 'import',
          element: <WalletImport />
        },
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

  // Rest of the pages get regular chrome with network
  return <Chrome>{routes}</Chrome>
}
