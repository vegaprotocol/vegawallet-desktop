import { Network } from './network'
import { Home } from './home'
import { Import } from './import'
import { Console } from './console'

export enum Paths {
  Console = '/console',
  Network = '/network',
  Import = '/import',
  Home = '/'
}

const routerConfig = [
  {
    path: Paths.Console,
    name: 'Console',
    component: Console,
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
