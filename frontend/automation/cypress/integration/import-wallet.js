describe('import wallet', () => {
  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreNetwork(handler, 'mainnet1')
        cy.restoreWallet(handler)
      })
      .then(() => {
        cy.reload()
        cy.getByTestId('home-splash', { timeout: 30000 }).should('exist')
      })
  })

  it('recover wallet', () => {
    cy.visit('/')
    cy.getByTestId('import-wallet').click()

    const walletName = 'import test'
    const passphrase = '123'
    const recoveryPhrase = Cypress.env('testWalletRecoveryPhrase')

    fillInRecoveryForm(walletName, passphrase, recoveryPhrase)
    cy.getByTestId('toast').contains('Wallet imported to')

    // Can open newly imported wallet
    cy.getByTestId('wallet-import-test').click()
    cy.getByTestId('public-key')
      .invoke('text')
      .then(text => {
        expect(text).to.eq(Cypress.env('recoveredWalletPublicKey'))
      })
  })

  it('recover wallet with same name', () => {
    const recoveryPhrase = Cypress.env('testWalletRecoveryPhrase')
    const existingWalletName = Cypress.env('testWalletName')
    const existingWalletPassphrase = Cypress.env('testWalletPassphrase')
    cy.visit('/')
    cy.getByTestId('import-wallet').click()
    fillInRecoveryForm(
      existingWalletName,
      existingWalletPassphrase,
      recoveryPhrase
    )

    cy.getByTestId('toast')
      .contains('Error')
      .should('have.text', 'Error: a wallet with the same name already exists')
  })

  it('recover wallet with different version', () => {
    const recoveryPhrase = Cypress.env('testWalletRecoveryPhrase')
    cy.visit('/')
    cy.getByTestId('import-wallet').click()
    fillInRecoveryForm('newwallet', '123', recoveryPhrase, 1)
    cy.getByTestId('toast').contains('Wallet imported to')
  })

  it('form validation', () => {
    cy.visit('/')
    cy.getByTestId('import-wallet').click()
    cy.getByTestId('submit').click()
    cy.getByTestId('Required').should('have.length', 4)
  })

  it('incorrect recovery phrase', () => {
    cy.visit('/')
    cy.getByTestId('import-wallet').click()
    fillInRecoveryForm('newallet', '123', 'incorrect')
    cy.getByTestId('toast').should(
      'have.text',
      "Error: couldn't import the wallet: recovery phrase is not valid"
    )
  })
})

function fillInRecoveryForm(
  walletName,
  passphrase,
  recoveryPhrase,
  version = 2
) {
  cy.getByTestId('wallet-name').type(walletName)
  cy.getByTestId('recovery-phrase').type(recoveryPhrase)
  cy.getByTestId('version').select(String(version))
  cy.getByTestId('passphrase').type(passphrase)
  cy.getByTestId('confirm-passphrase').type(passphrase)
  cy.getByTestId('submit').click()
}
