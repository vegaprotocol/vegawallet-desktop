const { unlockWallet } = require('../support/helpers')

describe('network configuration', () => {
  let walletName
  let passphrase

  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreNetwork(handler)
        cy.restoreNetwork(handler, 'test2')
        cy.restoreWallet(handler)
      })
      .then(() => {})
  })

  beforeEach(() => {
    passphrase = Cypress.env('testWalletPassphrase')
    walletName = Cypress.env('testWalletName')
    cy.waitForHome()
    unlockWallet(walletName, passphrase)
    cy.getByTestId('network-drawer').click()
  })

  it('change network and persists after reload', () => {
    cy.getByTestId('network-select').click()
    cy.getByTestId('select-test2').click()
    cy.getByTestId('service-status').should(
      'contain.text',
      'Wallet Service: Loading'
    )
    cy.getByTestId('service-status').should(
      'contain.text',
      'Wallet Service: test2'
    )

    cy.reload()
    unlockWallet(walletName, passphrase)

    cy.getByTestId('service-status')
      .contains('Wallet Service: test2 on http://127.0.0.1:1789')
      .should('exist')

    cy.getByTestId('network-select').click()
    cy.getByTestId('select-test').click()
    cy.getByTestId('service-status').should(
      'contain.text',
      'Wallet Service: test'
    )
  })

  it('view network details', () => {
    cy.getByTestId('network-select').should('have.text', 'test')
    cy.getByTestId('service-url').should('not.be.empty')
    cy.getByTestId('nodes-list').each($node => {
      // eslint-disable-next-line no-unused-expressions
      expect($node.text()).not.to.be.empty
    })
    cy.getByTestId('log-level').should('have.text', 'info')
    cy.getByTestId('token-expiry').should('have.text', '168h0m0s')
  })

  it('edit network details displayed', () => {
    cy.getByTestId('manage-networks').click()
    cy.getByTestId('edit-network-test').first().click()
    cy.getByTestId('service-host').invoke('val').should('not.be.empty')
    cy.getByTestId('service-port').invoke('val').should('not.be.empty')
    cy.getByTestId('node-list').invoke('val').should('not.be.empty')
    cy.getByTestId('log-level').invoke('val').should('not.be.empty')
    cy.getByTestId('node-retries').invoke('val').should('not.be.empty')
    cy.getByTestId('token-expiry').invoke('val').should('not.be.empty')
  })

  it('remove network', () => {
    cy.getByTestId('manage-networks').click()
    cy.getByTestId('remove-network-test2').click()
    cy.getByTestId('toast').contains('Successfully removed network')
  })
})
