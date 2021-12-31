import { Network } from './network'
import { Home } from './home'
import { Import } from './import'
import { Service } from './service'

export enum Paths {
  Service = '/service',
  Network = '/network',
  Import = '/import',
  Home = '/'
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
    path: Paths.Home,
    name: 'Home',
    component: Home,
    exact: false
  }
]

export default routerConfig
