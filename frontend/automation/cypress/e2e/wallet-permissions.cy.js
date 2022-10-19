const {
  authenticate,
  unlockWallet,
  approveConnection
} = require('../support/helpers')

const testIds = {
  SELECTION_MODAL: 'wallet-selection-modal',
  REJECT_CONNECTION_BUTTON: 'wallet-connection-reject',
  APPROVE_SELECTION_BUTTON: 'wallet-connection-approve'
}

describe('wallet permissions', () => {
  const MOCK_HOSTNAME = 'https://best-blockchain.app'
  let walletName
  let passphrase
  let clientToken

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
    // approveConnection(MOCK_HOSTNAME, walletName, passphrase)
  })

  it('handles approval', () => {
    // cy.sendPermissionsRequest(MOCK_HOSTNAME, {
    //   public_keys: 'read'
    // })
    //
    // cy.getByTestId('wallet-request-permissions').should('exist')
    // cy.getByTestId('wallet-request-permissions-approve').click()
    // authenticate(passphrase)
    //
    // cy.getByTestId('toast').should(
    //   'have.text',
    //   'The permissions have been successfully updated.'
    // )
  })

  it('handles rejection', () => {
    // cy.sendPermissionsRequest(MOCK_HOSTNAME, {
    //   public_keys: 'read'
    // })
    //
    // cy.getByTestId('wallet-request-permissions').should('exist')
    // cy.getByTestId('wallet-request-permissions-reject').click()
    // cy.getByTestId('wallet-request-permissions').should('not.exist')
  })
})
