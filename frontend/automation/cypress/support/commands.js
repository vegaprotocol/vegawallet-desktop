require('cypress-downloadfile/lib/downloadFileCommand')

Cypress.Commands.add('getByTestId', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('clean', () => {
  return cy.exec('npm run clean')
})

Cypress.Commands.add('setVegaHome', () => {
  const vegaHome = Cypress.env('vegaHome')
  cy.clean()
  cy.visit('/#')
  return cy
    .window()
    .then(async win => {
      const handler = win.go.backend.Handler
      await handler.InitialiseApp({
        vegaHome
      })
    })
    .then(() => {
      cy.reload()
    })
})

Cypress.Commands.add('restoreWallet', () => {
  const passphrase = '123'

  // Clear any existing wallets
  cy.clean()

  // Visit a page so that the window object is bootstrapped with backend functions
  cy.visit('#/wallet')

  return (
    cy
      .window()
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

        await handler.ImportNetwork({
          url: Cypress.env('testnetConfigUrl'),
          name: 'fairground'
        })
        await handler.ImportNetwork({
          url: Cypress.env('mainnetConfigUrl'),
          name: 'mainnet'
        })
      })
      .then(() => {
        cy.reload()
      })
  )
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
