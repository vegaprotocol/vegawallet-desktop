describe('onboarding', () => {
  beforeEach(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
      })
      .then(() => {
        cy.waitForHome()
      })
    cy.visit('/#/onboard')
  })

  it('create new wallet', () => {
    // Create wallet
    const randomNum = Math.floor(Math.random() * 101)
    const walletName = `Test ${randomNum.toString()}`
    const passphrase = '123'
    cy.getByTestId('create-new-wallet').click()
    cy.getByTestId('create-wallet-form-name').type(walletName)
    cy.getByTestId('create-wallet-form-passphrase').type(passphrase)
    cy.getByTestId('create-wallet-form-passphrase-confirm').type(passphrase)
    cy.getByTestId('submit').click()
    cy.getByTestId('toast').contains('Wallet created!')
    cy.getByTestId('toast').should('not.exist')

    // Import network
    cy.getByTestId('onboard-import-network-button').click()
    cy.getByTestId('show-test-networks').click()
    cy.getByTestId('import-network-fairground').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    // cy.wait(100)
    cy.getByTestId('toast')
      .should('be.visible')
      .first()
      .contains('Network imported to:')
  })

  it('import wallet', () => {
    const walletName = 'test'
    const passphrase = '123'
    const recoveryPhrase = Cypress.env('testWalletRecoveryPhrase')
    cy.getByTestId('import-wallet').click()
    cy.getByTestId('wallet-name').type(walletName)
    cy.getByTestId('recovery-phrase').type(recoveryPhrase)
    cy.getByTestId('version').select(String(2))
    cy.getByTestId('passphrase').type(passphrase)
    cy.getByTestId('confirm-passphrase').type(passphrase)
    cy.getByTestId('submit').click()

    cy.getByTestId('toast').contains('Wallet imported to:')
  })

  it('import wallet validation', () => {
    cy.getByTestId('import-wallet').click()
    cy.getByTestId('submit').click()
    cy.getByTestId('helper-text').should('have.length', 4)
  })

  it('import wallet with invalid recovery phrase', () => {
    const walletName = 'test'
    const passphrase = '123'
    const invalidRecoveryPhrase = 'invalid'
    cy.getByTestId('import-wallet').click()
    cy.getByTestId('wallet-name').type(walletName)
    cy.getByTestId('recovery-phrase').type(invalidRecoveryPhrase)
    cy.getByTestId('version').select(String(2))
    cy.getByTestId('passphrase').type(passphrase)
    cy.getByTestId('confirm-passphrase').type(passphrase)
    cy.getByTestId('submit').click()

    cy.getByTestId('toast').should(
      'have.text',
      'Error: could not import the wallet: the recovery phrase is not valid'
    )
  })
})
