import { Network } from './network'
import { Wallet } from './wallet'
import { Import } from './import'
import { Service } from './service'
import { Home } from './home'

export enum Paths {
  Home = '/',
  Service = '/service',
  Network = '/network',
  Import = '/import',
  Wallet = '/wallet'
}

const routerConfig = [
  {
    path: Paths.Service,
    name: 'Console',
    component: Service,
    exact: false
  },
  {
    path: Paths.Network,
    name: 'Network',
    component: Network,
    exact: false
  },
  {
    path: Paths.Import,
    name: 'Import',
    component: Import,
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
