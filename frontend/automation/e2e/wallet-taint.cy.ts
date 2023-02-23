import { authenticate, goToKey, unlockWallet } from '../support/helpers'

const passphrase = Cypress.env('testWalletPassphrase')
const walletName = Cypress.env('testWalletName')
const pubkey = Cypress.env('testWalletPublicKey')

describe('wallet taint key', () => {
  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreWallet(handler)
      })
      .then(() => {
        cy.waitForHome()
      })
  })

  it('message taint success', () => {
    unlockWallet(walletName, passphrase)
    goToKey(pubkey)
    // 0001-WALL-057 must select a key I wish to taint
    goToTaint()
    taintKey()
    // 0001-WALL-058 must be prompted to enter wallet password to taint key
    authenticate(passphrase)
    cy.getByTestId('toast')
      .contains('This key has been tainted')
      .getByTestId('close')
      .click({ multiple: true })
    cy.getByTestId('keypair-taint-notification')
      .should('exist')
      .within(() => {
        cy.contains(
          'This key is marked as unsafe to use. Untaint it to enable this key to be used to sign transactions.'
        ).should('be.visible')
      })
  })

  it('message untaint success', () => {
    goToTaint()
    taintKey()
    // 0001-WALL-061 must select a key to un-taint and be required to enter wallet password
    authenticate(passphrase)
    cy.getByTestId('toast').should(
      'contain.text',
      'This key has been untainted'
    )
    cy.getByTestId('keypair-taint-notification').should('not.exist')
  })
})

function goToTaint() {
  cy.getByTestId('keypair-taint-toggle').should('exist')
  cy.getByTestId('keypair-taint-toggle').click()
}

function taintKey() {
  cy.getByTestId('taint-action').click()
}
