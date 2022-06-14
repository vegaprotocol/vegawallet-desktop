require('cypress-downloadfile/lib/downloadFileCommand')

const axios = require('axios')

Cypress.Commands.add('getByTestId', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('clean', () => {
  return cy.exec('npm run clean')
})

Cypress.Commands.add('restoreWallet', () => {
  const passphrase = '123'

  // Visit a page so that the window object is bootstrapped with backend functions
  cy.visit('#/wallet')

  cy.window()
    // Init wallet with local vega home
    .then(async win => {
      const handler = win.go.backend.Handler

      // First initialise app with local frontend directory
      await handler.InitialiseApp({
        vegaHome: './frontend/automation/test-wallets'
      })

      // Import wallet using known recovery phrase setting
      const res = await handler.ImportWallet({
        wallet: 'test',
        recoveryPhrase:
          'behave unveil treat stone forward priority shoulder output woman dinner wide oval once fire move perfect together sail hero local try cinnamon clip hawk',
        version: 2,
        passphrase
      })

      // Store env vars for later use in tests and then import a network
      Cypress.env('testWalletPassphrase', passphrase)
      Cypress.env('testWalletName', res.wallet.name)
      Cypress.env('testWalletPublicKey', res.key.publicKey)

      return handler.ImportNetwork({
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
