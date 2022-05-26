import { And, Given, Then } from 'cypress-cucumber-preprocessor/steps'

const selectors = {
  TRANSACTION_DIALOG: 'transaction-dialog',
  TRANSACTION: 'transaction'
}

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

Given('I have an existing wallet', () => {
  cy.restoreWallet()
  cy.getByTestId('wallet-list').should('have.length', 1)
})

And('an order transaction is sent', () => {
  cy.intercept('POST', `${Cypress.env('walletServiceUrl')}/command/sync`).as(
    'transaction'
  )
  cy.sendTransaction(orderTransaction)
})

And('a vote transaction is sent', () => {
  cy.intercept('POST', `${Cypress.env('walletServiceUrl')}/command/sync`).as(
    'transaction'
  )
  cy.sendTransaction(voteTransaction)
})

And('I approve the transaction', () => {
  cy.getByTestId('approve-transaction').click()
})

And('I reject the transaction', () => {
  cy.getByTestId('reject-transaction').click()
})

Then('the transaction dialog is opened', () => {
  cy.getByTestId(selectors.TRANSACTION_DIALOG).should('exist')
  cy.getByTestId(selectors.TRANSACTION_DIALOG).should('be.visible')
})

Then('the transaction dialog is closed', () => {
  cy.getByTestId(selectors.TRANSACTION_DIALOG).should('not.exist')
})

And('the transaction is approved', () => {
  cy.wait('@transaction').its('response.statusCode').should('eq', 200)
})

And('the transaction is rejected', () => {
  cy.wait('@transaction').its('response.statusCode').should('eq', 401)
})

Then('the transaction dialog displays correctly', () => {
  cy.contains('Public key')
    .next('td')
    .should('have.text', Cypress.env('testWalletPublicKey'))
  cy.contains('Signature').next('td').should('not.be.empty')
  cy.contains('Received at').next('td').should('not.be.empty')
  cy.getByTestId('transaction-payload')
    .invoke('text')
    .then(text => JSON.parse(text))
    .should('deep.eq', orderTransaction.orderSubmission)
  cy.getByTestId('reject-transaction').should('exist')
  cy.getByTestId('approve-transaction').should('exist')

  // reject at the end so we dont get leftover hanging transactions
  cy.getByTestId('reject-transaction').click()
})

Then('both transactions are shown', () => {
  const expectedTxs = 2
  cy.getByTestId(selectors.TRANSACTION_DIALOG).should('exist')
  cy.getByTestId(selectors.TRANSACTION).should('have.length', expectedTxs)
  cy.contains(`${expectedTxs} pending transactions`)
  cy.contains('Order submission')
  cy.contains('Vote submission')
  cy.getByTestId('reject-transaction').first().click()
  cy.getByTestId(selectors.TRANSACTION).should('have.length', 1)
  cy.contains(/pending transactions/i).should('not.exist')
  cy.getByTestId('reject-transaction').first().click()
})
