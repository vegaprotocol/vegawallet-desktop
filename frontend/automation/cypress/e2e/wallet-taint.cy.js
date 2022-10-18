const { unlockWallet, authenticate, goToKey } = require('../support/helpers')

describe('wallet taint key', () => {
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

  it('message taint success', () => {
    unlockWallet(walletName, passphrase)
    goToKey(pubkey)
    goToTaint()
    taintKey()
    authenticate(passphrase)
    cy.getByTestId('toast')
      .contains('This key has been tainted')
      .getByTestId('close')
      .click()
    cy.getByTestId('keypair-taint-notification').should('exist')
  })

  it('message untaint success', () => {
    goToTaint()
    taintKey()
    authenticate(passphrase)
    cy.getByTestId('toast').contains('This key has been untainted')
    cy.getByTestId('keypair-taint-notification').should('not.exist')
  })
})

function goToTaint() {
  cy.getByTestId('keypair-taint').click()
}

function taintKey() {
  cy.getByTestId('taint-action').click()
}
