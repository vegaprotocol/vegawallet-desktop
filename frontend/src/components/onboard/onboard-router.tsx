import { useRoutes } from 'react-router-dom'

import { Paths } from '../../routes'
import { Splash } from '../splash'
import {
  Onboard,
  OnboardHome,
  OnboardNetwork,
  OnboardSettings,
  OnboardWalletCreate,
  OnboardWalletImport
} from './onboard'

// Nested paths DONT have '/'
export enum OnboardPaths {
  Settings = 'settings',
  WalletCreate = 'wallet-create',
  WalletImport = 'wallet-import',
  Network = 'network'
}

export function OnboardRouter() {
  const routes = useRoutes([
    {
      path: '/',
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
    }
  ])
  return <Splash>{routes}</Splash>
}
