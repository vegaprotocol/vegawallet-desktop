import { authenticate, unlockWallet } from '../support/helpers'

const passphrase = Cypress.env('testWalletPassphrase')
const walletName = Cypress.env('testWalletName')
const newWalletName = `${Math.random().toString(36).substring(2)}`

describe('edit wallet', () => {
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

  it('edits wallet name', () => {
    //0001-WALL-069 must be able to change wallet name
    unlockWallet(walletName, passphrase)
    cy.getByTestId('edit-wallet').click()
    cy.getByTestId('edit-wallet-form')
      .should('be.visible')
      .within(() => {
        cy.get('input').clear().type(newWalletName)
        cy.get('button[type="submit"]').click()
      })
    cy.getByTestId('edit-wallet-form').should('not.exist')
    authenticate(passphrase)
    cy.getByTestId('header-title').should('have.text', newWalletName)
  })
})
