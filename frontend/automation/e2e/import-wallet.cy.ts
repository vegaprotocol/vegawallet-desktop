import { unlockWallet } from '../support/helpers'

const walletName = 'import test'
const recoveryPhrase = Cypress.env('testWalletRecoveryPhrase')
const pubkey = Cypress.env('testWalletPublicKey')
const existingWalletName = Cypress.env('testWalletName')
const passphrase = Cypress.env('testWalletPassphrase')

describe('import wallet', () => {
  before(() => {
    cy.initApp()
    cy.restoreWallet()
    cy.waitForNetworkConnected()
  })

  beforeEach(() => {
    cy.visit('/')
    cy.getByTestId('import-wallet').click()
  })

  it('recover wallet', () => {
    // 0001-WALL-004
    fillInRecoveryForm(walletName, passphrase, recoveryPhrase)
    cy.getByTestId('toast').should('contain.text', 'Wallet imported to')

    // Can open newly imported wallet
    unlockWallet(walletName.replace(' ', '-'), passphrase)
    cy.getByTestId(`wallet-keypair-${pubkey}`).click()
    cy.getByTestId('public-key')
      .invoke('text')
      .then(text => {
        expect(text).to.eq(pubkey)
      })
  })

  it('recover wallet with same name', () => {
    fillInRecoveryForm(existingWalletName, passphrase, recoveryPhrase)

    cy.getByTestId('toast')
      .contains('Error')
      .should('have.text', 'Error: a wallet with the same name already exists')
  })

  it('recover wallet with different version', () => {
    const recoveryPhrase = Cypress.env('testWalletRecoveryPhrase')
    fillInRecoveryForm('newwallet', '123', recoveryPhrase, 1)
    cy.getByTestId('toast').should('contain.text', 'Wallet imported to')
  })

  it('form validation', () => {
    cy.getByTestId('submit').click()
    cy.getByTestId('helper-text').should('have.length', 4)
  })

  it('incorrect recovery phrase', () => {
    fillInRecoveryForm('newallet', '123', 'incorrect')
    cy.getByTestId('toast').should(
      'contain.text',
      'Error: could not import the wallet: the recovery phrase is not valid'
    )
  })
})

function fillInRecoveryForm(
  walletName: string,
  passphrase: string,
  recoveryPhrase: string,
  version = 2
) {
  cy.getByTestId('wallet-name').type(walletName)
  cy.getByTestId('recovery-phrase').type(recoveryPhrase)
  cy.getByTestId('version').select(String(version))
  cy.getByTestId('passphrase').type(passphrase)
  cy.getByTestId('confirm-passphrase').type(passphrase)
  cy.getByTestId('submit').click()
}
