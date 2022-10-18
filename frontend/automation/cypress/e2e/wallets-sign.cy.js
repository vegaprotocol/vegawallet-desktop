const { unlockWallet, authenticate, goToKey } = require('../support/helpers')

describe('wallet sign key', () => {
  let walletName
  let passphrase
  let pubkey

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
    pubkey = Cypress.env('testWalletPublicKey')
  })

  it('message signing success', () => {
    unlockWallet(walletName, passphrase)
    goToKey(pubkey)
    goToSign()
    signMessage('Sign message successfully')
    authenticate(passphrase)
    cy.getByTestId('toast').contains('Message signed successfully')
    cy.getByTestId('sign-more').click()
    signMessage('Sign message successfully')
    authenticate(passphrase)
    cy.contains('Message signed successfully')

    function signMessage(message) {
      cy.getByTestId('message-field').clear().type(message)
      cy.getByTestId('sign').click()
    }
  })

  it('message signing failure', () => {
    cy.getByTestId('sign-more').click()
    signMessage('Sign message failure')
    authenticate('invalid')
    cy.getByTestId('toast')
      .contains('Error')
      .should(
        'have.text',
        'Error: could not retrieve the wallet: wrong passphrase'
      )
  })
})

function goToSign() {
  cy.getByTestId('keypair-sign').click()
}

function signMessage(message) {
  cy.getByTestId('message-field').type(message)
  cy.getByTestId('sign').click()
}
