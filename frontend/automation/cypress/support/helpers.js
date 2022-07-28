export function unlockWallet(name, passphrase) {
  cy.getByTestId(`wallet-${name}`).click()
  authenticate(passphrase)
  // wait for form to be unmounted so that other elements can be interacted with as
  // the dialog adds pointer-events: none to the body element
  cy.getByTestId('passphrase-form').should('not.exist')
}

export function authenticate(passphrase) {
  cy.getByTestId('passphrase-form').should('be.visible')
  cy.getByTestId('input-passphrase').type(passphrase)
  cy.getByTestId('input-submit').click()
}

export function generateAccounts() {
  const accounts = [
    {
      __typename: 'Account',
      type: 'General',
      balance: '100',
      market: {
        __typename: 'Market',
        id: 'market-id',
        name: 'Test Market'
      },
      asset: {
        __typename: 'Asset',
        id: 'asset-id',
        symbol: 'SYM',
        decimals: 0
      }
    }
  ]
  return accounts
}
