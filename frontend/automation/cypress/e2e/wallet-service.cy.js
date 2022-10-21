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
      })
      .then(() => {
        cy.waitForHome()
      })
  })

  it('starts service automatically', () => {
    cy.getByTestId('service-status').should(
      'contain.text',
      'Wallet Service: test'
    )
  })
})
