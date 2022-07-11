const { unlockWallet } = require('../support/helpers')

describe('app config', () => {
  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreNetwork(handler, 'mainnet1')
        cy.restoreNetwork(handler, 'fairground') // restore second network for switching
        cy.restoreWallet(handler)
      })
      .then(() => {
        cy.reload()
        cy.getByTestId('home-splash', { timeout: 30000 }).should('exist')
      })
  })

  it('persists selected network', () => {
    const passphrase = Cypress.env('testWalletPassphrase')
    const walletName = Cypress.env('testWalletName')

    unlockWallet(`wallet-${walletName}`, passphrase)
    assertNetwork('fairground')
    changeNetwork('mainnet1')
    cy.reload()
    unlockWallet(`wallet-${walletName}`, passphrase)
    assertNetwork('mainnet1')
    changeNetwork('fairground')
    cy.reload()
    unlockWallet(`wallet-${walletName}`, passphrase)
    assertNetwork('fairground')

    function changeNetwork(network) {
      cy.getByTestId('network-drawer').click()
      cy.getByTestId('network-select').click()
      cy.getByTestId(`select-${network}`).click()
    }

    function assertNetwork(network) {
      cy.getByTestId('service-status')
        .contains(`Wallet Service: ${network} on http://127.0.0.1:1789`)
        .should('exist')
    }
  })
})
