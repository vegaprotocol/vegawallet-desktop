const {
  authenticate,
  unlockWallet,
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
    cy.getByTestId('create-new-wallet').click()
    cy.getByTestId('create-wallet-form-name').type(walletName)
    cy.getByTestId('create-wallet-form-passphrase').type(passphrase)
    cy.getByTestId('create-wallet-form-passphrase-confirm').type(passphrase)
    cy.getByTestId('submit').click()
    cy.contains('Wallet created!')
    cy.getByTestId('recovery-phrase-warning').should('not.be.empty')
    cy.getByTestId('wallet-version').next('p').should('contain', 2)
    cy.getByTestId('recovery-phrase')
      .invoke('text')
      .then(text => {
        expect(text.split(' ').length).to.equal(24)
      })
    cy.getByTestId('create-wallet-success-cta').click()
    cy.url().should('contain', `/wallet/${walletName}/keypair`)
    cy.getByTestId('wallet-name').contains(walletName)
  })
})

describe('wallet', () => {
  let passphrase = ''
  let walletName = ''

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

  it('view wallet keypairs', () => {
    cy.visit('/')
    unlockWallet(walletName, passphrase)
    cy.getByTestId('passphrase-form').should('not.exist')
    cy.getByTestId('generate-keypair').should('exist')
    cy.getByTestId('log-out').should('exist')
  })

  it('wrong passphrase', () => {
    cy.visit('/')
    unlockWallet(walletName, 'invalid')
    cy.contains('Error').should('have.text', 'Error: could not retrieve the wallet: wrong passphrase')
    cy.getByTestId('log-out').should('not.exist')
  })

  it('generate new key pair', () => {
    cy.visit('/')
    unlockWallet(walletName, passphrase)
    cy.getByTestId('wallet-item').should('have.length', 1)
    cy.getByTestId('generate-keypair').click()
    authenticate(passphrase)
    cy.getByTestId('wallet-item').should('have.length', 2)
  })

  it('key pair page', () => {
    cy.visit('/')
    unlockWallet(walletName, passphrase)
    cy.getByTestId('keypair-name').should('contain', 'Key 1')
    cy.getByTestId('public-key')
      .invoke('text')
      .then(text => {
        expect(text.length).to.equal(64)
      })
  })

  it('wallets can be locked', () => {
    cy.visit('/')
    unlockWallet(walletName, passphrase)
    cy.getByTestId('keypair-name').should('contain', 'Key 1')
    cy.getByTestId('log-out').click()
    cy.getByTestId('keypair-name').should('not.exist')
    cy.getByTestId('home-splash').should('exist')
  })

  it('can navigate between child pages', () => {
    cy.visit('/')
    unlockWallet(walletName, passphrase)
    cy.getByTestId('wallet-actions').click()
    cy.getByTestId('wallet-action-sign').click()
    cy.getByTestId('keypair-sign').should('be.visible')
    cy.getByTestId('wallet-action-taint').click()
    cy.getByTestId('keypair-taint').should('be.visible')
    cy.getByTestId('wallet-action-metadata').click()
    cy.getByTestId('keypair-metadata').should('be.visible')
  })
})
