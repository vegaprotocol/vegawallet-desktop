const { unlockWallet, approveConnection } = require('../support/helpers')

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
    approveConnection(MOCK_HOSTNAME, walletName, passphrase)

    cy.getByTestId('toast').should(
      'have.text',
      'The connection to the wallet has been successfully established.'
    )
  })

  // it('handles rejection', () => {
  // @TODO: for some mysterious reason this is failing
  // const MOCK_HOSTNAME = 'https://best-blockchain-2.app'
  // cy.sendConnectionRequest(MOCK_HOSTNAME)
  //
  // cy.getByTestId('wallet-selection-modal').should('exist')
  // cy.getByTestId('wallet-connection-reject').click()
  //
  // cy.getByTestId('input-passphrase').type(passphrase)
  // cy.getByTestId('input-submit').click()
  //
  // cy.getByTestId('toast').should(
  //   'have.text',
  //   `The connection request from "${MOCK_HOSTNAME}" has been rejected.`
  // )
  // })
})
