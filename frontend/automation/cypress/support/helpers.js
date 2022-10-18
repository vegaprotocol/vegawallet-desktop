export function unlockWallet(name, passphrase) {
  cy.getByTestId(`wallet-${name}`).click()
  authenticate(passphrase)
  // wait for form to be unmounted so that other elements can be interacted with as
  // the dialog adds pointer-events: none to the body element
  cy.getByTestId('passphrase-form').should('not.exist')
}

export function goToKey(pubkey) {
  cy.getByTestId(`wallet-keypair-${pubkey}`).click()
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
      balance: '10000000',
      market: {
        __typename: 'Market',
        id: 'market-id',
        name: 'Test Market'
      },
      asset: {
        __typename: 'Asset',
        id: 'asset-id',
        name: 'tBTC TEST',
        symbol: 'tBTC',
        decimals: 5
      }
    },
    {
      __typename: 'Account',
      type: 'General',
      balance: '112672538',
      market: {
        __typename: 'Market',
        id: 'market-id',
        name: 'Test Market'
      },
      asset: {
        __typename: 'Asset',
        id: 'asset-id1',
        name: 'tDAI TEST',
        symbol: 'tDAI',
        decimals: 5
      }
    }
  ]
  return accounts
}
