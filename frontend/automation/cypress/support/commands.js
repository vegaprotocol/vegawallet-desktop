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
    .SubmitWalletAPIRequest({
      id: '0',
      jsonrpc: '2.0',
      method: 'admin.import_wallet',
      params: {
        wallet: 'test',
        recoveryPhrase:
          'behave unveil treat stone forward priority shoulder output woman dinner wide oval once fire move perfect together sail hero local try cinnamon clip hawk',
        version: 2,
        passphrase
      }
    })
    .then(res => {
      // Store env vars for later use in tests and then import a network
      Cypress.env('testWalletPassphrase', passphrase)
      Cypress.env('testWalletName', res.result.wallet.name)
      Cypress.env('testWalletPublicKey', res.result.key.publicKey)
    })
})

Cypress.Commands.add('restoreNetwork', (handler, name = 'test') => {
  const location = path.join(
    Cypress.config('projectRoot'),
    'network-config/test.toml'
  )
  Cypress.env('testNetworkPath', location)
  return handler
    .SubmitWalletAPIRequest({
      id: '0',
      jsonrpc: '2.0',
      method: 'admin.import_network',
      params: {
        filePath: location,
        name
      }
    })
    .then(res => res.result)
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
    .then(() => {
      // console.log('errrrrrrror')
    })
    .catch(err => {
      console.log('errrrrrrror')
    })
})

Cypress.Commands.add('mockRequests', () => {
  cy.log('mocking presets')
  cy.intercept(
    'GET',
    'https://raw.githubusercontent.com/vegaprotocol/networks/master/networks.json',
    {
      body: [
        {
          name: 'fairground',
          configFileUrl:
            'https://raw.githubusercontent.com/vegaprotocol/networks/master/fairground/fairground.toml',
          sha: '5a0f0091cf4943f55a01d11f02f10b70c42c3e57'
        },
        {
          name: 'mainnet1',
          configFileUrl:
            'https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml',
          sha: '0dfd8d1539ae28a460d5ef2d28067156192b944c'
        }
      ]
    }
  ).as('presets')
  const url = 'https://mock.vega.xyz/query'
  cy.log('mocking gql GET ' + url)
  cy.intercept('GET', url, req => {
    req.reply({
      statusCode: 200
    })
  }).as('nodeTest')
  cy.log('mocking gql POST ' + url)
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
  }).as('GQL')
})

Cypress.Commands.add('waitForHome', () => {
  cy.visit('/')
  cy.getByTestId('home-splash', { timeout: 30000 }).should('exist')
  cy.get('body').then(body => {
    cy.wait(500)
    if (body.find('[data-testid="telemetry-option-form"]').length > 0) {
      cy.get('button[role="radio"][value="no"]').click()
      cy.getByTestId('telemetry-option-continue').click()
    }
  })
})
