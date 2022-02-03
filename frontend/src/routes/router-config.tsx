import { Wallet } from './wallet'
import { WalletImport } from './wallet-import'
import { Service } from './service'
import { Home } from './home'

export enum Paths {
  Home = '/',
  Service = '/service',
  Wallet = '/wallet',
  WalletImport = '/wallet-import'
}

const routerConfig = [
  {
    path: Paths.Service,
    name: 'Service',
    component: Service,
    exact: false
  },
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
