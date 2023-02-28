import { authenticate, goToKey, unlockWallet } from '../support/helpers'

const passphrase = Cypress.env('testWalletPassphrase')
const walletName = Cypress.env('testWalletName')
const pubkey = Cypress.env('testWalletPublicKey')

describe('wallet sign key', () => {
  before(() => {
    cy.initApp()
    cy.restoreWallet()
  })

  beforeEach(() => {
    cy.visit('')
    unlockWallet(walletName, passphrase)
    goToKey(pubkey)
    cy.getByTestId('keypair-sign').click()
  })

  it('message signing - success', () => {
    signMessage('Sign message successfully')
    authenticate(passphrase)
    cy.getByTestId('toast').should(
      'contain.text',
      'Message signed successfully'
    )
  })

  it('message signing - able to sign multiple', () => {
    signMessage('Sign message successfully')
    authenticate(passphrase)
    cy.getByTestId('toast').should(
      'contain.text',
      'Message signed successfully'
    )
    cy.getByTestId('sign-more').click()
    signMessage('Sign message successfully')
    authenticate(passphrase)
    cy.contains('Message signed successfully')
  })

  it('message signing - prompt for content', () => {
    // 0001-WALL-062 must enter content to be signed with key
    cy.getByTestId('sign').click()
    cy.getByTestId('helper-text').should('have.text', 'Required')
    signMessage('Sign message successfully')
    authenticate(passphrase)
    cy.getByTestId('toast').should(
      'contain.text',
      'Message signed successfully'
    )
    cy.getByTestId('sign-more').click()
    signMessage('Sign message successfully')
    authenticate(passphrase)
    cy.contains('Message signed successfully')
  })

  it('message signing - hashed of signed content given', () => {
    // 0001-WALL-065 must be able to submit/sign the content and am
    // given a hash of the signed content as well as the message (now encoded)
    signMessage('I am a secret')
    authenticate(passphrase)
    cy.getByTestId('toast').should(
      'contain.text',
      'Message signed successfully'
    )

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
    signMessage('Sign message failure')
    authenticate('invalid')
    cy.getByTestId('toast')
      .contains('Error')
      .should('have.text', 'Error: wrong passphrase')
  })
})

function signMessage(message: string): void {
  cy.getByTestId('message-field').type(message)
  cy.getByTestId('sign').click()
}
