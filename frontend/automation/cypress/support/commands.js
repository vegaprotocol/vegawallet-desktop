const path = require('path')
const { hasOperationName } = require('./graphql')
const { generateAccounts } = require('./helpers')

require('cypress-downloadfile/lib/downloadFileCommand')

Cypress.Commands.add('getByTestId', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('clean', () => {
  return cy.exec('npm run clean')
})

Cypress.Commands.add('backend', () => {
  cy.visit('/')
  return cy.window().then(win => {
    return win.go.backend.Handler
  })
})

Cypress.Commands.add('setVegaHome', handler => {
  return handler.InitialiseApp({
    vegaHome: Cypress.env('vegaHome')
  })
})

Cypress.Commands.add('restoreWallet', handler => {
  const passphrase = '123'
  return handler
    .ImportWallet({
      wallet: 'test',
      recoveryPhrase:
        'behave unveil treat stone forward priority shoulder output woman dinner wide oval once fire move perfect together sail hero local try cinnamon clip hawk',
      version: 2,
      passphrase
    })
    .then(res => {
      // Store env vars for later use in tests and then import a network
      Cypress.env('testWalletPassphrase', passphrase)
      Cypress.env('testWalletName', res.wallet.name)
      Cypress.env('testWalletPublicKey', res.key.publicKey)
    })
})

Cypress.Commands.add('restoreNetwork', (handler, name) => {
  const allowedNetworks = ['mainnet1', 'fairground', 'custom']
  if (!allowedNetworks.includes(name)) {
    throw new Error(`Must provide one of: ${allowedNetworks.join(', ')}`)
  }

  if (name === 'custom') {
    const location = path.join(
      Cypress.config('projectRoot'),
      'network-config/custom.toml'
    )
    return handler.ImportNetwork({
      filePath: location,
      name
    })
  }

  const url =
    name === 'mainnet1'
      ? Cypress.env('mainnetConfigUrl')
      : Cypress.env('testnetConfigUrl')

  return handler.ImportNetwork({
    url,
    name
  })
})

Cypress.Commands.add('sendTransaction', transaction => {
  const sendTransaction = async () => {
    const baseUrl = Cypress.env('walletServiceUrl')
    const pubKey = Cypress.env('testWalletPublicKey')
    const wallet = Cypress.env('testWalletName')
    const passphrase = Cypress.env('testWalletPassphrase')

    const tokenRes = await fetch(`${baseUrl}/auth/token`, {
      method: 'post',
      body: JSON.stringify({
        wallet,
        passphrase
      })
    })
    const tokenJSON = await tokenRes.json()

    // NOTE: Specifically not returning anything at the end of this promise so that cy.wrap
    // will complete and cypress will move on to the next task, this allows us to
    // inspect the dom and trigger actions (IE reject/approve transaction) while the promise
    // is left hanging

    fetch(`${baseUrl}/command/sync`, {
      method: 'post',
      headers: {
        authorization: `Bearer ${tokenJSON.token}`
      },
      body: JSON.stringify({
        pubKey,
        propagate: true,
        ...transaction
      })
    })
  }

  cy.wrap(sendTransaction())
})

Cypress.Commands.add('mockGQL', () => {
  const url = 'https://mock.vega.xyz/query'
  cy.intercept('GET', url, req => {
    req.reply({
      statusCode: 200
    })
  }).as('nodeTest')

  cy.intercept('POST', url, req => {
    if (hasOperationName(req, 'Accounts')) {
      req.alias = 'Accounts'
      req.reply({
        body: {
          data: {
            party: {
              __typename: 'Party',
              id: Cypress.env('testWalletPublicKey'),
              accounts: generateAccounts()
            }
          }
        }
      })
    }
  })
})
