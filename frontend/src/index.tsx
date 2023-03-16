import 'core-js/stable'

import React from 'react'
import { createRoot } from 'react-dom/client'
import ResizeObserver from 'resize-observer-polyfill'

import App from './app'
import { ENV } from './config/environment'

if (typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = ResizeObserver
}

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
  root.render(<App />)
} else {
  throw Error('Could not find root element with id "app".')
}
