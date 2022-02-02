import { Wallet } from './wallet'
import { WalletImport } from './wallet-import'
import { Home } from './home'

export enum Paths {
  Home = '/',
  Wallet = '/wallet',
  WalletImport = '/wallet-import'
}

const routerConfig = [
  {
    path: Paths.WalletImport,
    name: 'WalletImport',
    component: WalletImport,
    exact: false
  },
  {
    path: Paths.Wallet,
    name: 'Wallet',
    component: Wallet,
    exact: false
  },
  {
    path: Paths.Home,
    name: 'Home',
    component: Home,
    exact: true
  }
]

export default routerConfig
