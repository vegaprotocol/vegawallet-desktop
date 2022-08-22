const { unlockWallet, authenticate } = require('../support/helpers')

describe('wallet annotate metadata', () => {
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

  it('handles metadata updates', () => {
    unlockWallet(walletName, passphrase)
    goToMetadataPage()

    cy.getByTestId('metadata-key-0').contains('name')
    cy.getByTestId('metadata-value-0').should('exist')

    addPair('first', 'value-1')
    addPair('second', 'value-2')
    addPair('third', 'value-3')
    updateMetadata()
    authenticate(passphrase)
    assertSuccessfulUpdate()
    cy.reload()
    unlockWallet(walletName, passphrase)
    goToMetadataPage()
    cy.getByTestId('metadata-key-0').should('exist')
    const key = 'metadata-key'
    const value = 'metadata-value'

    cy.getByTestId(key).should('have.length', 3)
    cy.getByTestId(key).eq(0).should('have.value', 'first')
    cy.getByTestId(key).eq(1).should('have.value', 'second')
    cy.getByTestId(key).eq(2).should('have.value', 'third')

    cy.getByTestId(value).should('have.length', 3)
    cy.getByTestId(value).eq(0).should('have.value', 'value-1')
    cy.getByTestId(value).eq(1).should('have.value', 'value-2')
    cy.getByTestId(value).eq(2).should('have.value', 'value-3')

    cy.getByTestId('metadata-remove').eq(1).click()
    assertMetadataRemoved()
    updateMetadata()
    authenticate(passphrase)
    assertSuccessfulUpdate()
    cy.reload()
    unlockWallet(walletName, passphrase)
    goToMetadataPage()
    assertMetadataRemoved()
  })
})

function goToMetadataPage() {
  cy.getByTestId('wallet-actions').click()
  cy.getByTestId('wallet-action-metadata').click()
  cy.get('html').click() // close dropdown
}

function addPair(key, value) {
  cy.getByTestId('metadata-add').click()
  cy.getByTestId('metadata-key').last().type(key)
  cy.getByTestId('metadata-value').last().type(value)
}

function updateMetadata() {
  cy.getByTestId('metadata-submit').click()
}

function assertMetadataRemoved() {
  const key = 'metadata-key'
  const value = 'metadata-value'
  cy.getByTestId(value).should('have.length', 2)
  cy.getByTestId(key).eq(1).should('have.value', 'third')
  cy.getByTestId(value).eq(1).should('have.value', 'value-3')
}

function assertSuccessfulUpdate() {
  cy.getByTestId('toast').contains('Successfully updated metadata')
}
