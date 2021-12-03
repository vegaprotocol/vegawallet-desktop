import React from 'react'
import ReactDOM from 'react-dom'
import 'core-js/stable'
import './index.scss'
import App from './app'
import reportWebVitals from './report-web-vitals'
import * as Wails from '@wailsapp/runtime'

/**
TODO:
- Re-add start and stop console buttons
- Ensure config editing is working
- Make wallet list better
- Make network switcher better
- Use enums for route strings
- Alignments of alias and pubkey
- Permission for import wallet by path
- Unmarshal request json for import by mnemonic
- Check config editing
- Tests
*/

Wails.Init(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app')
  )
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
