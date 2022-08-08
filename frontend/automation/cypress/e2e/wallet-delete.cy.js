const { unlockWallet } = require('../support/helpers')

describe('wallet delete', () => {
  let walletName
  let passphrase
  const form = 'delete-wallet-form'

  before(() => {
    cy.clean()
    cy.mockGQL()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreNetwork(handler, 'custom')
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

  it('deletes a wallet', () => {
    unlockWallet(walletName, passphrase)
    cy.getByTestId('delete-wallet').click()
    submitForm()
    cy.getByTestId('helper-text').contains('Required')
    cy.getByTestId(form).get('input[type="text"]').type('invalid text')
    submitForm()
    cy.getByTestId('helper-text').contains('Invalid confirmation text')
    cy.getByTestId(form)
      .get('input[type="text"]')
      .clear()
      .type(`Delete ${walletName}`)
    submitForm()
    cy.getByTestId('toast').contains('Wallet deleted')
    cy.getByTestId('home-splash').should('be.visible')
    cy.getByTestId(`wallet-${walletName}`).should('not.exist')
  })

  function submitForm() {
    cy.getByTestId(form)
      .should('be.visible')
      .get('button[type="submit"]')
      .click()
  }
})
