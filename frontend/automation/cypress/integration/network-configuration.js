const { unlockWallet } = require('../support/helpers')

describe('network configuration', () => {
  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreNetwork(handler, 'mainnet1')
        cy.restoreNetwork(handler, 'fairground')
        cy.restoreWallet(handler)
      })
      .then(() => {
        cy.reload()
        cy.getByTestId('home-splash', { timeout: 30000 }).should('exist')
      })
  })

  it('change network', () => {
    const passphrase = Cypress.env('testWalletPassphrase')
    const walletName = Cypress.env('testWalletName')

    cy.visit('/')
    unlockWallet(`wallet-${walletName}`, passphrase)
    cy.getByTestId('network-drawer').click()
    cy.getByTestId('network-select').click()
    cy.getByTestId('select-fairground').click()
    cy.getByTestId('service-status').should(
      'contain.text',
      'Wallet Service: fairground'
    )
    cy.getByTestId('network-select').click()
    cy.getByTestId('select-mainnet1').click()
    cy.getByTestId('service-status').should(
      'contain.text',
      'Wallet Service: mainnet1'
    )
  })

  it('view network details', () => {
    const passphrase = Cypress.env('testWalletPassphrase')
    const walletName = Cypress.env('testWalletName')

    cy.visit('/')
    unlockWallet(`wallet-${walletName}`, passphrase)
    cy.getByTestId('network-drawer').click()
    cy.getByTestId('network-select').should('have.text', 'mainnet1')
    cy.getByTestId('service-url').should('not.be.empty')
    cy.getByTestId('service-console').should('not.be.empty')
    cy.getByTestId('console-url').should('not.be.empty')
    cy.getByTestId('service-token').should('not.be.empty')
    cy.getByTestId('token-url').should('not.be.empty')
    cy.getByTestId('nodes-list').each($node => {
      // eslint-disable-next-line no-unused-expressions
      expect($node.text()).not.to.be.empty
    })
    cy.getByTestId('log-level').should('have.text', 'info')
    cy.getByTestId('token-expiry').should('have.text', '168h0m0s')
  })

  it('edit network details displayed', () => {
    const passphrase = Cypress.env('testWalletPassphrase')
    const walletName = Cypress.env('testWalletName')

    cy.visit('/')
    unlockWallet(`wallet-${walletName}`, passphrase)
    cy.getByTestId('network-drawer').click()
    cy.getByTestId('manage-networks').click()
    cy.getByTestId('edit').first().click()
    cy.getByTestId('service-host').invoke('val').should('not.be.empty')
    cy.getByTestId('service-port').invoke('val').should('not.be.empty')
    cy.getByTestId('token-url').invoke('val').should('not.be.empty')
    cy.getByTestId('node-list').invoke('val').should('not.be.empty')
    cy.getByTestId('log-level').invoke('val').should('not.be.empty')
    cy.getByTestId('node-retries').invoke('val').should('not.be.empty')
    cy.getByTestId('token-expiry').invoke('val').should('not.be.empty')
  })
})
