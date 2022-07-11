const { unlockWallet } = require('../support/helpers')

describe('wallet service', () => {
  let passphrase = ''
  let walletName = ''

  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreNetwork(handler, 'fairground')
        cy.restoreWallet(handler)
      })
      .then(() => {
        cy.reload()
        cy.getByTestId('home-splash', { timeout: 30000 }).should('exist')
      })
  })

  beforeEach(() => {
    passphrase = Cypress.env('testWalletPassphrase')
    walletName = Cypress.env('testWalletName')
  })

  it('starts service automatically', () => {
    cy.visit('/')
    unlockWallet(`wallet-${walletName}`, passphrase)
    cy.getByTestId('service-status').should(
      'contain.text',
      'Wallet Service: fairground'
    )
  })

  it('starts service with Token DApp', () => {
    const url = Cypress.env('tokenServiceUrl')
    cy.visit('/')
    unlockWallet(`wallet-${walletName}`, passphrase)
    expandNetworkDrawer()
    cy.getByTestId('service-token').contains('Start').click()
    cy.getByTestId('dapp-status').should('contain.text', 'TokenDApp')
    cy.request(url).as('status')
    cy.get('@status').should('have.a.property', 'status', 200)
    cy.getByTestId('service-token').contains('Stop').click()
    cy.getByTestId('dapp-status').should('not.contain.text', 'TokenDApp')
  })

  it('starts service with Console', () => {
    const url = Cypress.env('consoleServiceUrl')
    cy.visit('/')
    unlockWallet(`wallet-${walletName}`, passphrase)
    expandNetworkDrawer()
    cy.getByTestId('service-console').find('button').click()
    cy.getByTestId('dapp-status').should('contain.text', 'Console')
    cy.request(url).as('status')
    cy.get('@status').should('have.a.property', 'status', 200)
    cy.getByTestId('service-console').contains('Stop').click()
    cy.getByTestId('dapp-status').should('not.contain.text', 'Console')
  })
})

function expandNetworkDrawer() {
  cy.getByTestId('network-drawer').click()
}
