const { unlockWallet, authenticate } = require('../support/helpers')

describe('wallet taint key', () => {
  let walletName
  let passphrase

  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreNetwork(handler, 'mainnet1')
        cy.restoreWallet(handler)
      })
      .then(() => {
        cy.visit('/')
        cy.getByTestId('home-splash', { timeout: 30000 }).should('exist')
      })
  })

  beforeEach(() => {
    passphrase = Cypress.env('testWalletPassphrase')
    walletName = Cypress.env('testWalletName')
  })

  it('message taint success', () => {
    unlockWallet(walletName, passphrase)
    goToTaintPage()
    taintKey()
    authenticate(passphrase)
    cy.getByTestId('toast').contains('This key has been tainted')
  })

  it('message untaint success', () => {
    taintKey()
    authenticate(passphrase)
    cy.getByTestId('toast').contains('This key has been untainted')
  })
})

function goToTaintPage() {
  cy.getByTestId('wallet-actions').click()
  cy.getByTestId('wallet-action-taint').click()
  cy.get('html').click() // close dropdown
}

function taintKey(message) {
  cy.getByTestId('taint-action').click()
}
