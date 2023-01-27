import 'core-js/stable'
import { createRoot } from 'react-dom/client'

import App from './app'

const element = document.getElementById('app')

if (element) {
  const root = createRoot(element)

  root.render(<App />)
} else {
  throw Error('Could not find root element with id "app".')
}
