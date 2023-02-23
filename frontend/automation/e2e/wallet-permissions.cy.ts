import { approveConnection, authenticate } from '../support/helpers'

const MOCK_HOSTNAME = 'https://best-blockchain.app'
const passphrase = Cypress.env('testWalletPassphrase')
const walletName = Cypress.env('testWalletName')

describe.skip('wallet permissions', () => {
  before(() => {
    cy.clean()
    cy.backend().then(handler => {
      cy.setVegaHome(handler)
      cy.restoreNetwork(handler)
      cy.restoreWallet(handler)
    })
  })

  beforeEach(() => {
    cy.waitForHome()
    approveConnection(MOCK_HOSTNAME, walletName, passphrase)
  })

  it('handles approval', () => {
    cy.sendPermissionsRequest(MOCK_HOSTNAME, {
      public_keys: 'read'
    })

    cy.getByTestId('wallet-request-permissions').should('exist')
    cy.getByTestId('wallet-request-permissions-approve').click()
    authenticate(passphrase)

    cy.getByTestId('toast').should(
      'have.text',
      'The permissions have been successfully updated.'
    )
  })

  it('handles rejection', () => {
    cy.sendPermissionsRequest(MOCK_HOSTNAME, {
      public_keys: 'read'
    })

    cy.getByTestId('wallet-request-permissions').should('exist')
    cy.getByTestId('wallet-request-permissions-reject').click()
    cy.getByTestId('wallet-request-permissions').should('not.exist')
  })
})
