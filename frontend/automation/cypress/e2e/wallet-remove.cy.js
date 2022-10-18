const { unlockWallet } = require('../support/helpers')

describe('wallet remove', () => {
  let walletName
  let passphrase
  const form = 'remove-wallet-form'

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

  it('removes a wallet', () => {
    unlockWallet(walletName, passphrase)
    cy.getByTestId('remove-wallet').click()
    submitForm()
    cy.getByTestId('helper-text').contains('Required')
    cy.getByTestId(form).get('input[type="text"]').type('invalid text')
    submitForm()
    cy.getByTestId('helper-text').contains('Invalid confirmation text')
    cy.getByTestId(form)
      .get('input[type="text"]')
      .clear()
      .type(`Remove ${walletName}`)
    submitForm()
    cy.getByTestId('toast').contains('Wallet removed')
    cy.getByTestId('wallet-home').should('be.visible')
    cy.getByTestId(`wallet-${walletName}`).should('not.exist')
  })

  function submitForm() {
    cy.getByTestId(form)
      .should('be.visible')
      .get('button[type="submit"]')
      .click()
  }
})
