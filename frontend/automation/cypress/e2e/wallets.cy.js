const {
  authenticate,
  unlockWallet,
  goToKey,
  generateAccounts
} = require('../support/helpers')

describe('create wallet', () => {
  const walletName = 'test'
  const passphrase = '123'

  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreNetwork(handler)
      })
      .then(() => {
        cy.waitForHome()
      })
  })

  it('create wallet', () => {
    // 0001-WALL-005
    cy.getByTestId('create-new-wallet').click()
    cy.getByTestId('create-wallet-form-name').type(walletName)
    cy.getByTestId('create-wallet-form-passphrase').type(passphrase)
    cy.getByTestId('create-wallet-form-passphrase-confirm').type(passphrase)
    cy.getByTestId('submit').click()
    cy.contains('Wallet created!')
    cy.getByTestId('recovery-phrase-warning').should('not.be.empty')
    cy.getByTestId('wallet-version').next('p').should('contain', 2)

    // 0001-WALL-006
    cy.getByTestId('recovery-phrase')
      .invoke('text')
      .then(text => {
        expect(text.split(' ').length).to.equal(24)
      })
    cy.getByTestId('create-wallet-success-cta').click()
    cy.getByTestId('header-title').should('have.text', walletName)

    // 0001-WALL-008
    cy.getByTestId('wallet-keypair')
      .contains('Key 1')
      .should('be.visible')
      .parent()
      .siblings()
      .invoke('text')
      .should('match', /\w{6}.\w{4}$/)
    cy.getByTestId('wallet-keypair').contains('Key 1').click()
    cy.getByTestId('public-key')
      .invoke('text')
      .should('match', /\w{64}$/)
  })
})

describe('wallet', () => {
  let passphrase = ''
  let walletName = ''
  let pubkey = ''

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
  })

  it('view wallet keypairs', () => {
    unlockWallet(walletName, passphrase)
    cy.getByTestId('passphrase-form').should('not.exist')
    cy.getByTestId('generate-keypair').should('exist')
    cy.getByTestId('remove-wallet').should('exist')
    cy.getByTestId(`wallet-keypair-${pubkey}`).should('exist')
  })

  it('wrong passphrase', () => {
    unlockWallet(walletName, 'invalid')
    cy.getByTestId('toast').should(
      'have.text',
      'Error: could not retrieve the wallet: wrong passphrase'
    )
  })

  it('generate new key pair', () => {
    // 0001-WALL-052
    unlockWallet(walletName, passphrase)
    cy.getByTestId('wallet-keypair').should('have.length', 1)
    cy.getByTestId('generate-keypair').click()
    authenticate(passphrase)
    cy.getByTestId('wallet-keypair').should('have.length', 2)
  })

  it('key pair page', () => {
    unlockWallet(walletName, passphrase)
    goToKey(pubkey)
    cy.getByTestId('header-title').should('contain', 'Key 1')
    cy.getByTestId('public-key')
      .invoke('text')
      .then(text => {
        expect(text.length).to.equal(64)
      })
  })

  it('wallets can be locked', () => {
    unlockWallet(walletName, passphrase)
    cy.getByTestId('wallet-keypair').should('contain', 'Key 1')
    cy.getByTestId('back').click()
    cy.getByTestId('wallet-keypair').should('not.exist')
    cy.getByTestId('wallet-home').should('exist')
  })

  it('can navigate to transactions page', () => {
    unlockWallet(walletName, passphrase)
    goToKey(pubkey)
    cy.getByTestId('keypair-transactions').should('be.visible')
    cy.getByTestId('keypair-transactions').click()
    cy.getByTestId('header-title').should('contain', 'Transactions')
  })
  
})
