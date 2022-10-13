const { unlockWallet } = require('../support/helpers')

describe('wallet service', () => {
  let passphrase = ''
  let walletName = ''

  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreNetwork(handler)
        cy.restoreWallet(handler)
      })
      .then(() => {
        cy.waitForHome()
      })
  })

  beforeEach(() => {
    passphrase = Cypress.env('testWalletPassphrase')
    walletName = Cypress.env('testWalletName')
  })

  it('starts service automatically', () => {
    unlockWallet(walletName, passphrase)
    cy.getByTestId('service-status').should(
      'contain.text',
      'Wallet Service: test'
    )
  })
})
