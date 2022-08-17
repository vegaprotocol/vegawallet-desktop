const { unlockWallet } = require('../support/helpers')

describe('settings', () => {
  let passphrase
  let walletName

  before(() => {
    passphrase = Cypress.env('testWalletPassphrase')
    walletName = Cypress.env('testWalletName')

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

  it('dialog opens and can be closed', () => {
    cy.getByTestId('home-settings').click()
    cy.getByTestId('settings-form').should('be.visible')
    cy.getByTestId('cancel-settings').click()
    cy.getByTestId('settings-form').should('not.exist')
  })

  it('saves and reloads', () => {
    cy.getByTestId('home-settings').click()
    cy.getByTestId('settings-form').should('be.visible')

    // assert and change log level
    cy.getByTestId('log-level').should('have.value', 'info').select('debug')

    // change telemetry
    const radioGroupSelector = '[role="radiogroup"]'
    cy.get(radioGroupSelector).find('input[value="yes"]').should('be.checked')
    cy.get(radioGroupSelector).find('button[value="no"]').click()

    // submit
    cy.getByTestId('update-settings').click()

    // page should reload and settings form should now not show
    cy.getByTestId('settings-form').should('not.exist')

    cy.getByTestId('home-settings').click()
    cy.getByTestId('log-level').should('have.value', 'debug')
    cy.get(radioGroupSelector).find('input[value="no"]').should('be.checked')
    cy.getByTestId('cancel-settings').click()
  })

  it('can be accessed from the wallet sidebar', () => {
    unlockWallet(walletName, passphrase)
    cy.getByTestId('wallet-app-settings').click()
    cy.getByTestId('settings-form').should('be.visible')
  })
})
