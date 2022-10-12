const { unlockWallet } = require('../support/helpers')

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
    cy.backend().then(handler => {
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
    const MOCK_HOSTNAME = 'https://best-blockchain.app'
    cy.sendConnectionRequest(MOCK_HOSTNAME)

    cy.getByTestId(testIds.SELECTION_MODAL).should('exist')
    cy.getByTestId(testIds.SELECTION_MODAL).should('be.visible')
    cy.getByTestId(testIds.APPROVE_SELECTION_BUTTON).click()

    cy.getByTestId('input-passphrase').type(passphrase)
    cy.getByTestId('input-submit').click()

    cy.getByTestId('toast').should(
      'have.text',
      'The connection to the wallet has been successfully established.'
    )
  })

  it('handles rejection', () => {
    const MOCK_HOSTNAME = 'https://best-blockchain-2.app'
    cy.sendConnectionRequest(MOCK_HOSTNAME)

    cy.getByTestId(testIds.SELECTION_MODAL).should('exist')
    cy.getByTestId(testIds.SELECTION_MODAL).should('be.visible')
    cy.getByTestId(testIds.REJECT_CONNECTION_BUTTON).click()

    cy.getByTestId('input-passphrase').type(passphrase)
    cy.getByTestId('input-submit').click()

    cy.getByTestId('toast').should(
      'have.text',
      `The connection request from "${MOCK_HOSTNAME}" has been rejected.`
    )
  })
})
