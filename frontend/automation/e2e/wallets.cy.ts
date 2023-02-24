import { authenticate, goToKey, unlockWallet } from '../support/helpers'

const passphrase = Cypress.env('testWalletPassphrase')
const walletName = Cypress.env('testWalletName')
const pubkey = Cypress.env('testWalletPublicKey')

describe('create wallet', () => {
  before(() => {
    cy.initApp()
    cy.waitForNetworkConnected()
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
  before(() => {
    cy.initApp()
    cy.log('shit')
    cy.waitForNetworkConnected()
    cy.restoreWallet()
  })

  beforeEach(() => {
    cy.visit('/')
    unlockWallet(walletName, passphrase)
  })

  it('view wallet keypairs', () => {
    cy.getByTestId('passphrase-form').should('not.exist')
    cy.getByTestId('generate-keypair').should('exist')
    cy.getByTestId('remove-wallet').should('exist')
    cy.getByTestId(`wallet-keypair-${pubkey}`).should('exist')
  })

  it('wrong passphrase', () => {
    cy.visit('')
    unlockWallet(walletName, 'invalid')
    cy.getByTestId('toast').should('contain.text', 'Error: wrong passphrase')
  })

  it('generate new key pair', () => {
    // 0001-WALL-052 must be able to create new keys (derived from the source of wallet)
    cy.getByTestId('wallet-keypair').should('have.length', 1)
    cy.getByTestId('generate-keypair').click()
    authenticate(passphrase)
    cy.getByTestId('wallet-keypair').should('have.length', 2)
  })

  it('copy public key from keylist', { browser: 'chrome' }, function () {
    // 0001-WALL-054 must see full public key or be able to copy it to clipboard
    const copyButton = '[data-state="closed"] > svg'
    cy.monitor_clipboard().as('clipboard')
    cy.getByTestId('wallet-keypair').within(() => {
      cy.get(copyButton).first().click()
    })
    cy.get('@clipboard')
      .get_copied_text_from_clipboard()
      .should('match', /\w{64}$/)
  })

  it('copy public key from key details', { browser: 'chrome' }, function () {
    // 0001-WALL-054 must see full public key or be able to copy it to clipboard
    goToKey(pubkey)
    cy.monitor_clipboard().as('clipboard')
    cy.getByTestId('public-key').next().click()
    cy.get('@clipboard')
      .get_copied_text_from_clipboard()
      .should('match', /\w{64}$/)
  })

  it('key pair page', () => {
    goToKey(pubkey)
    cy.getByTestId('header-title').should('contain', 'Key 1')
    cy.getByTestId('public-key')
      .invoke('text')
      .then(text => {
        expect(text.length).to.equal(64)
      })
  })

  it('wallet stays logged in', () => {
    // 0001-WALL-016 must select a wallet and enter the passphrase only once per "session"
    cy.getByTestId('back').click()
    cy.getByTestId(`wallet-${walletName}`).click()
    cy.getByTestId('passphrase-form').should('not.exist')
    cy.getByTestId('header-title').should('have.text', walletName)
  })

  it('can navigate to transactions page', () => {
    goToKey(pubkey)
    cy.getByTestId('keypair-transactions').should('be.visible')
    cy.getByTestId('keypair-transactions').click()
    cy.getByTestId('header-title').should('contain', 'Transactions')
  })
})
