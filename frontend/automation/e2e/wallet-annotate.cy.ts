import { authenticate, goToKey, unlockWallet } from '../support/helpers'

const passphrase = Cypress.env('testWalletPassphrase')
const walletName = Cypress.env('testWalletName')
const pubkey = Cypress.env('testWalletPublicKey')

describe('wallet annotate metadata', () => {
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

  it('handles key name update', () => {
    // 0001-WALL-055 must be able to change key name/alias
    const NEW_NAME = 'new name'
    goToUpdate(walletName, passphrase, pubkey)

    cy.getByTestId('metadata-key-0').contains('Name')
    cy.getByTestId('metadata-value-0').should('exist')

    cy.getByTestId('metadata-value-0').type(NEW_NAME)
    cy.getByTestId('metadata-submit').click()

    authenticate(passphrase)
    assertSuccessfulUpdate()
    cy.getByTestId('header-title').should('have.text', NEW_NAME)
  })
})

function goToUpdate(walletName: string, passphrase: string, pubkey: string) {
  unlockWallet(walletName, passphrase)
  goToKey(pubkey)
  cy.getByTestId('keypair-update').click()
}

function assertSuccessfulUpdate() {
  cy.getByTestId('toast').should(
    'contain.text',
    'Successfully updated metadata'
  )
}
