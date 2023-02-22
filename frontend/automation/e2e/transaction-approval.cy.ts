import { unlockWallet } from '../support/helpers'

const orderTransaction = {
  orderSubmission: {
    marketId:
      '062ddcb97beae5b7cc4fa20621fe0c83b2a6f7e76cf5b129c6bd3dc14e8111ef',
    size: '1',
    type: 'TYPE_MARKET',
    side: 'SIDE_BUY',
    timeInForce: 'TIME_IN_FORCE_IOC'
  }
}

const voteTransaction = {
  voteSubmission: {
    proposalId:
      '062ddcb97beae5b7cc4fa20621fe0c83b2a6f7e76cf5b129c6bd3dc14e8111ef',
    value: 'VALUE_YES'
  }
}

const testIds = {
  TRANSACTION_DIALOG: 'transaction-dialog',
  TRANSACTION: 'transaction',
  TRANSACTION_PAYLOAD: 'transaction-payload',
  TRANSACTION_TITLE: 'transaction-title',
  REJECT_BTN: 'reject-transaction',
  APPROVE_BTN: 'approve-transaction',
  DISMISS_BTN: 'dismiss-transaction',
  WALLET_ITEM: 'wallet-item'
}

describe.skip('transaction approval', () => {
  let passphrase = ''
  let walletName = ''

  before(() => {
    cy.clean()
    cy.backend().then(handler => {
      cy.setVegaHome(handler)
      cy.restoreNetwork(handler)
      cy.restoreWallet(handler)
    })
  })

  beforeEach(() => {
    passphrase = Cypress.env('testWalletPassphrase')
    walletName = Cypress.env('testWalletName')
    cy.waitForHome()
    unlockWallet(walletName, passphrase)
  })

  it('handles approval', () => {
    cy.intercept('POST', `${Cypress.env('walletServiceUrl')}/command/sync`).as(
      'transaction'
    )
    cy.sendTransaction(orderTransaction)
    cy.getByTestId(testIds.TRANSACTION_DIALOG).should('exist')
    cy.getByTestId(testIds.TRANSACTION_DIALOG).should('be.visible')
    cy.getByTestId(testIds.APPROVE_BTN).click()
    cy.wait('@transaction').its('response.statusCode').should('eq', 200)
    cy.getByTestId(testIds.DISMISS_BTN).click()
    cy.getByTestId(testIds.TRANSACTION_DIALOG).should('not.exist')
  })

  it('handles rejection', () => {
    cy.intercept('POST', `${Cypress.env('walletServiceUrl')}/command/sync`).as(
      'transaction'
    )
    cy.sendTransaction(orderTransaction)
    cy.getByTestId(testIds.TRANSACTION_DIALOG).should('exist')
    cy.getByTestId(testIds.TRANSACTION_DIALOG).should('be.visible')
    cy.getByTestId(testIds.REJECT_BTN).click()
    cy.getByTestId(testIds.TRANSACTION_DIALOG).should('not.exist')
    cy.wait('@transaction').its('response.statusCode').should('eq', 401)
  })

  it('displays transaction information', () => {
    cy.sendTransaction(orderTransaction)

    cy.getByTestId(testIds.TRANSACTION_DIALOG).should('exist')
    cy.getByTestId(testIds.TRANSACTION_DIALOG).should('be.visible')
    cy.contains('Public key')
      .next('dd')
      .should('have.text', Cypress.env('testWalletPublicKey'))
    cy.contains('Signature').next('dd').should('not.be.empty')
    cy.contains('Received at').next('dd').should('not.be.empty')
    cy.getByTestId(testIds.TRANSACTION_PAYLOAD)
      .invoke('text')
      .then(text => JSON.parse(text))
      .should('deep.eq', orderTransaction.orderSubmission)
    cy.getByTestId(testIds.REJECT_BTN).should('exist')
    cy.getByTestId(testIds.APPROVE_BTN).should('exist')

    // reject at the end so we dont get leftover hanging transactions
    cy.getByTestId(testIds.REJECT_BTN).click()
  })

  it('handles multiple transactions', () => {
    const expectedTxs = 2
    cy.sendTransaction(orderTransaction)
    cy.sendTransaction(voteTransaction)

    cy.getByTestId(testIds.TRANSACTION_DIALOG).should('exist')
    cy.getByTestId(testIds.TRANSACTION).should('have.length', expectedTxs)
    cy.contains(`${expectedTxs} pending transactions`)
    cy.getByTestId(testIds.TRANSACTION_TITLE)
      .first()
      .contains('Order submission')
    cy.getByTestId(testIds.TRANSACTION_TITLE).last().contains('Vote submission')
    cy.getByTestId(testIds.REJECT_BTN).first().click()
    cy.getByTestId(testIds.TRANSACTION).should('have.length', 1)
    cy.contains(/pending transactions/i).should('not.exist')
    cy.getByTestId(testIds.REJECT_BTN).first().click()
  })
})
