describe('create wallet', () => {
  const walletName = 'test'
  const passphrase = '123'

  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreNetwork(handler, 'mainnet1')
      })
      .then(() => {
        cy.reload()
        cy.getByTestId('home-splash', { timeout: 30000 }).should('exist')
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
        cy.restoreNetwork(handler, 'mainnet1')
        cy.restoreWallet(handler)
      })
      .then(() => {
        cy.reload()
        cy.getByTestId('home-splash', { timeout: 30000 }).should('exist')
      })
  })

  beforeEach(() => {
    passphrase = Cypress.env('testWalletPassphrase')
    walletName = Cypress.env('testWalletName')
  })

  it('view wallet keypairs', () => {
    unlockWallet(walletName, passphrase)
    cy.getByTestId('passphrase-form').should('not.exist')
    cy.getByTestId('generate-keypair').should('exist')
    cy.getByTestId('log-out').should('exist')
  })

  it('wrong passphrase', () => {
    unlockWallet(walletName, 'invalid')
    cy.contains('Error').should('have.text', 'Error: wrong passphrase')
    cy.getByTestId('log-out').should('not.exist')
  })

  it('generate new key pair', () => {
    unlockWallet(walletName, passphrase)
    cy.getByTestId('wallet-list').should('have.length', 1)
    cy.getByTestId('generate-keypair').click()
    authenticate(passphrase)
    cy.getByTestId('wallet-list').should('have.length', 2)
  })

  it('key pair page', () => {
    unlockWallet(walletName, passphrase)
    cy.getByTestId('keypair-name').should('contain', 'key')
    cy.getByTestId('public-key')
      .invoke('text')
      .then(text => {
        expect(text.length).to.equal(64)
      })
  })

  it('wallets can be locked', () => {
    unlockWallet(walletName, passphrase)
    cy.getByTestId('keypair-name').should('contain', 'key')
    cy.getByTestId('log-out').click()
    cy.getByTestId('keypair-name').should('not.exist')
    cy.getByTestId('home-splash').should('exist')
  })

  it('message signing success', () => {
    unlockWallet(walletName, passphrase)
    cy.getByTestId('sign-page').click()
    signMessage('Sign message successfully')
    authenticate(passphrase)
    cy.contains('Message signed successfully')
    cy.getByTestId('sign-more').click()
    signMessage('Sign message successfully')
    cy.contains('Message signed successfully')

    function signMessage(message) {
      cy.getByTestId('message-field').clear().type(message)
      cy.getByTestId('sign').click()
    }
  })

  it('message signing failure', () => {
    unlockWallet(walletName, passphrase)
    cy.getByTestId('sign-page').click()
    signMessage('Sign message failure')
    authenticate('invalid')
    cy.contains('Error').should('have.text', 'Error: wrong passphrase')
  })
})

function unlockWallet(walletName, passphrase) {
  cy.visit('/')
  cy.getByTestId(`wallet-${walletName}`).click()
  authenticate(passphrase)
}

function signMessage(message) {
  cy.getByTestId('message-field').type(message)
  cy.getByTestId('sign').click()
}

function authenticate(passphrase) {
  cy.getByTestId('passphrase-form').should('be.visible')
  cy.getByTestId('input-passphrase').type(passphrase)
  cy.getByTestId('input-submit').click()
}
