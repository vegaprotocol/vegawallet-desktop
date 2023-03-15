before(() => {
  cy.initApp()
  cy.waitForNetworkConnected()
})
beforeEach(() => {
  cy.visit('/')
})

describe('onboarding', () => {
  it('create new wallet', () => {
    const randomNum = Math.floor(Math.random() * 101)
    const walletName = `Test ${randomNum.toString()}`
    const passphrase = '123'
    cy.getByTestId('create-new-wallet').click()
    cy.getByTestId('create-wallet-form-name').type(walletName)
    cy.getByTestId('create-wallet-form-passphrase').type(passphrase)
    cy.getByTestId('create-wallet-form-passphrase-confirm').type(passphrase)
    cy.getByTestId('create-wallet-form-submit').click()
    cy.getByTestId('toast').should('contain.text', 'Wallet created!')
    cy.getByTestId('toast').should('not.exist')
    cy.getByTestId('create-wallet-success-cta').click()
    cy.getByTestId('header-title').should('have.text', walletName)
  })

  it('create multiple wallets - switch between them', () => {
    // 0001-WALL-066 must be able to create multiple wallets
    // 0001-WALL-067 must be able to switch between wallets
    const randomNum = Math.floor(Math.random() * 101)
    const randomNum2 = Math.floor(Math.random() * 101)
    const walletName = `Test ${randomNum.toString()}`
    const walletName2 = `Test ${randomNum2.toString()}`
    const passphrase = '123'

    // Create first new wallet
    cy.getByTestId('create-new-wallet').click()
    cy.getByTestId('create-wallet-form-name').type(walletName)
    cy.getByTestId('create-wallet-form-passphrase').type(passphrase)
    cy.getByTestId('create-wallet-form-passphrase-confirm').type(passphrase)
    cy.getByTestId('create-wallet-form-submit').click()
    cy.getByTestId('toast').should('contain.text', 'Wallet created!')
    cy.getByTestId('toast').should('not.exist')
    cy.getByTestId('create-wallet-success-cta').click()
    cy.getByTestId('header-title').should('have.text', walletName)

    // Create another new wallet
    cy.getByTestId('back').click()
    cy.getByTestId('create-new-wallet').click()
    cy.getByTestId('create-wallet-form-name').type(walletName2)
    cy.getByTestId('create-wallet-form-passphrase').type(passphrase)
    cy.getByTestId('create-wallet-form-passphrase-confirm').type(passphrase)
    cy.getByTestId('create-wallet-form-submit').click()
    cy.getByTestId('toast').should('contain.text', 'Wallet created!')
    cy.getByTestId('toast').should('not.exist')
    cy.getByTestId('create-wallet-success-cta').click()
    cy.getByTestId('header-title').should('have.text', walletName2)

    // Access first wallet
    cy.getByTestId('back').click()
    cy.get('button').contains(walletName).click()
    cy.getByTestId('header-title').should('have.text', walletName)

    // Back out and access wallet2
    cy.getByTestId('back').click()
    cy.get('button').contains(walletName2).click()
    cy.getByTestId('header-title').should('have.text', walletName2)
  })

  it('import default wallets', () => {
    // 0001-WALL-009 - must have Mainnet and Fairground (testnet) pre-configured (with Mainnet being the default network)
    cy.getByTestId('network-drawer').click()
    cy.getByTestId('network-select').click()
    cy.get(`[role="menuitem"]`)
      .should('contain.text', 'mainnet1')
      .and('contain.text', 'testnet2')
      .and('contain.text', 'fairground')
  })

  it('import wallet', () => {
    const walletName = 'test'
    const passphrase = '123'
    const recoveryPhrase = Cypress.env('testWalletRecoveryPhrase')
    cy.getByTestId('import-wallet').click()
    cy.getByTestId('wallet-import-form-name').type(walletName)
    cy.getByTestId('wallet-import-form-recovery-phrase').type(recoveryPhrase)
    cy.getByTestId('version').select(String(2))
    cy.getByTestId('wallet-import-form-passphrase').type(passphrase)
    cy.getByTestId('wallet-import-form-passphrase-confirm').type(passphrase)
    cy.getByTestId('wallet-import-form-submit').click()

    cy.getByTestId('toast').should('contain.text', 'Wallet imported to:')
  })

  it('import wallet validation', () => {
    cy.getByTestId('import-wallet').click()
    cy.getByTestId('wallet-import-form-submit').click()
    cy.getByTestId('helper-text').should('have.length', 4)
  })

  it('import wallet with invalid recovery phrase', () => {
    const walletName = 'test-invalid'
    const passphrase = '123'
    const invalidRecoveryPhrase = 'invalid'
    cy.getByTestId('import-wallet').click()
    cy.getByTestId('wallet-import-form-name').type(walletName)
    cy.getByTestId('wallet-import-form-recovery-phrase').type(
      invalidRecoveryPhrase
    )
    cy.getByTestId('version').select(String(2))
    cy.getByTestId('wallet-import-form-passphrase').type(passphrase)
    cy.getByTestId('wallet-import-form-passphrase-confirm').type(passphrase)
    cy.getByTestId('wallet-import-form-submit').click()

    cy.getByTestId('toast').should(
      'contain.text',
      'Error: could not import the wallet: the recovery phrase is not valid'
    )
  })
})
