require('cypress-downloadfile/lib/downloadFileCommand')
const axios = require('axios')

Cypress.Commands.add('getByTestId', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('clean', () => {
  return cy.exec('npm run clean')
})

Cypress.Commands.add('restoreWallet', () => {
  let win
  const passphrase = '123'

  // Visit a page so that the window object is bootstrapped with backend functions
  cy.visit('#/wallet')

  cy.window()
    // Init wallet with local vega home
    .then(w => {
      win = w
      return win.go.backend.Handler.InitialiseApp({
        vegaHome: './frontend/automation/test-wallets'
      })
    })

    // Import wallet using known recovery phrase setting
    .then(() => {
      return win.go.backend.Handler.ImportWallet({
        wallet: 'test',
        recoveryPhrase:
          'behave unveil treat stone forward priority shoulder output woman dinner wide oval once fire move perfect together sail hero local try cinnamon clip hawk',
        version: 2,
        passphrase
      })
    })
    // Store env vars for later use in tests and then import a network
    .then(res => {
      // Set wallet name and public key for later use
      Cypress.env('testWalletPassphrase', passphrase)
      Cypress.env('testWalletName', res.wallet.name)
      Cypress.env('testWalletPublicKey', res.key.publicKey)

      return win.go.backend.Handler.ImportNetwork({
        url: Cypress.env('testnetConfigUrl'),
        name: 'fairground'
      })
    })
})

Cypress.Commands.add('sendTransaction', transaction => {
  const sendTransaction = async () => {
    const baseUrl = Cypress.env('walletServiceUrl')
    const pubKey = Cypress.env('testWalletPublicKey')
    const wallet = Cypress.env('testWalletName')
    const passphrase = Cypress.env('testWalletPassphrase')

    const tokenRes = await axios({
      method: 'post',
      url: `${baseUrl}/auth/token`,
      data: {
        wallet,
        passphrase
      }
    })

    axios({
      method: 'post',
      url: `${baseUrl}/command/sync`,
      headers: {
        authorization: `Bearer ${tokenRes.data.token}`
      },
      data: {
        pubKey,
        propagate: true,
        ...transaction
      }
    })
  }

  cy.wrap(sendTransaction())
})
