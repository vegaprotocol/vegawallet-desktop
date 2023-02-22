import { approveConnection, authenticate } from '../support/helpers'

describe.skip('wallet permissions', () => {
  const MOCK_HOSTNAME = 'https://best-blockchain.app'
  let walletName: string
  let passphrase: string

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
