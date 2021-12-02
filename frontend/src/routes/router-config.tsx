import { Network } from './network'
import { Home } from './home'
import { Import } from './import'
import { Console } from './console'

const routerConfig = [
  {
    path: '/console',
    name: 'Console',
    component: Console,
    exact: false
  },
  {
    path: '/network',
    name: 'Network',
    component: Network,
    exact: false
  },
  {
    path: '/import',
    name: 'Import',
    component: Import,
    exact: false
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    exact: false
  }
]

export default routerConfig
