const { unlockWallet } = require('../support/helpers')

const MOCK_HOSTNAME = 'https://best-blockchain.app'

const testIds = {
  SELECTION_MODAL: 'wallet-selection-modal',
  REJECT_CONNECTION_BUTTON: 'wallet-connection-reject',
  APPROVE_SELECTION_BUTTON: 'wallet-selection-button'
}

describe('wallet connection', () => {
  let walletName
  let passphrase

  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreNetwork(handler)
        cy.restoreWallet(handler)
      })
  })

  beforeEach(() => {
    passphrase = Cypress.env('testWalletPassphrase')
    walletName = Cypress.env('testWalletName')
    cy.waitForHome()
    unlockWallet(walletName, passphrase)
  })

  it('handles approval', () => {
    cy.sendConnectionRequest(MOCK_HOSTNAME)
    cy.getByTestId(testIds.SELECTION_MODAL).should('exist')
    cy.getByTestId(testIds.SELECTION_MODAL).should('be.visible')
    cy.getByTestId(testIds.APPROVE_SELECTION_BUTTON).click()

    cy.getByTestId('input-passphrase').type(passphrase)
    cy.getByTestId('input-submit').click()

    cy.getByTestId('toast').should('have.text', 'Connection approved')
  })

  // currently all incoming requests are auto-approved for now
  // it('handles rejection', () => {
  //
  // })
})
