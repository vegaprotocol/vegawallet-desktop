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
      .then(() => {
        cy.waitForHome()
      })
  })

  beforeEach(() => {
    passphrase = Cypress.env('testWalletPassphrase')
    walletName = Cypress.env('testWalletName')
  })

  it('handles approval', () => {
    cy.sendConnectionRequest(MOCK_HOSTNAME)
    cy.getByTestId(testIds.SELECTION_MODAL).should('exist')
    cy.getByTestId(testIds.SELECTION_MODAL).should('be.visible')
    cy.getByTestId(testIds.APPROVE_SELECTION_BUTTON).click()

    cy.getByTestId('passphrase').type(passphrase)
    cy.getByTestId('submit').click()
  })

  // currently all incoming requests are auto-approved for now
  // it('handles rejection', () => {
  //
  // })
})
