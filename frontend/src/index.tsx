import 'core-js/stable'

import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './app'
import { ENV } from './config/environment'

const element = document.getElementById('app')

if (element) {
  const root = createRoot(element)

  if (ENV === 'development') {
    root.render(<App />)
  } else {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
} else {
  throw Error('Could not find root element with id "app".')
}
