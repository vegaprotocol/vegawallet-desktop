const { unlockWallet, authenticate, goToKey } = require('../support/helpers')

describe('wallet sign key', () => {
  let walletName
  let passphrase
  let pubkey

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
    passphrase = Cypress.env('testWalletPassphrase')
    walletName = Cypress.env('testWalletName')
    pubkey = Cypress.env('testWalletPublicKey')
    unlockWallet(walletName, passphrase)
    goToKey(pubkey)
    cy.goToSign()
  })

  it('message signing - success', () => {
    cy.signMessage('Sign message successfully')
    authenticate(passphrase)
    cy.getByTestId('toast').contains('Message signed successfully')
  })

  it('message signing - able to sign multiple', () => {
    cy.signMessage('Sign message successfully')
    authenticate(passphrase)
    cy.getByTestId('toast').contains('Message signed successfully')
    cy.getByTestId('sign-more').click()
    cy.signMessage('Sign message successfully')
    authenticate(passphrase)
    cy.contains('Message signed successfully')
  })

  it('message signing - prompt for content', () => {
    // 0001-WALL-062 must enter content to be signed with key
    cy.getByTestId('sign').click()
    cy.getByTestId('helper-text').should('have.text', 'Required')
    cy.signMessage('Sign message successfully')
    authenticate(passphrase)
    cy.getByTestId('toast').contains('Message signed successfully')
    cy.getByTestId('sign-more').click()
    cy.signMessage('Sign message successfully')
    authenticate(passphrase)
    cy.contains('Message signed successfully')
  })

  it('message signing - hashed of signed content given', () => {
    // 0001-WALL-065 must be able to submit/sign the content and am
    // given a hash of the signed content as well as the message (now encoded)
    cy.signMessage('I am a secret')
    authenticate(passphrase)
    cy.getByTestId('toast').contains('Message signed successfully')

    const hashedMessage = '[data-state="closed"]'

    cy.contains('Signed message')
      .parent()
      .within(() => {
        cy.get(hashedMessage)
          .invoke('text')
          .then(hash => {
            assert.equal(
              hash.length,
              88,
              'Checking 88 chars representing hash are present'
            )
          })
        cy.contains('I am a secret').should('not.exist')
      })
  })

  it('message signing - failure', () => {
    cy.getByTestId('sign').click()
    cy.signMessage('Sign message failure')
    authenticate('invalid')
    cy.getByTestId('toast')
      .contains('Error')
      .should(
        'have.text',
        'Error: could not retrieve the wallet: wrong passphrase'
      )
  })
})

Cypress.Commands.add('goToSign', () => {
  cy.getByTestId('keypair-sign').click()
})

Cypress.Commands.add('signMessage', message => {
  cy.getByTestId('message-field').type(message)
  cy.getByTestId('sign').click()
})
