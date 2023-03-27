import { approveConnection, unlockWallet } from '../support/helpers'

const passphrase = Cypress.env('testWalletPassphrase')
const walletName = Cypress.env('testWalletName')

describe.skip('wallet connection', () => {
  before(() => {
    cy.clean()
    cy.initApp()
    cy.restoreWallet()
    cy.waitForNetworkConnected()
    unlockWallet(walletName, passphrase)
  })

  // Tests skipped because currently wails and Cypress both receive an event and send an auto-approve.
  // Need to find a way to disable one of the UIs from interactions
  it.skip('handles approval', () => {
    const MOCK_HOSTNAME = 'https://best-blockchain.app'
    approveConnection(MOCK_HOSTNAME, walletName, passphrase)

    cy.getByTestId('toast').should(
      'have.text',
      'The connection to the wallet has been successfully established.'
    )
  })

  it.skip('handles rejection', () => {
    const MOCK_HOSTNAME = 'https://best-blockchain-2.app'
    cy.sendConnectionRequest(MOCK_HOSTNAME)

    cy.getByTestId('wallet-selection-modal').should('exist')
    cy.getByTestId('wallet-connection-reject').click()

    cy.getByTestId('input-passphrase').type(passphrase)
    cy.getByTestId('input-submit').click()

    cy.getByTestId('toast').should(
      'have.text',
      `The connection request from "${MOCK_HOSTNAME}" has been rejected.`
    )
  })
})