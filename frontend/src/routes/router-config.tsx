import { Config } from './config'
import { Home } from './home'
import { Import } from './import'

const routerConfig = [
  {
    path: '/config',
    name: 'Config',
    component: Config,
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
