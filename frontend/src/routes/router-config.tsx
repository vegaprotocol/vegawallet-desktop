import { Network } from './network'
import { Home } from './home'
import { Import } from './import'

const routerConfig = [
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
