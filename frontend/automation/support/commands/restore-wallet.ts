export {}
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      restoreWallet(): Chainable<Subject>
    }
  }
}

Cypress.Commands.add('restoreWallet', () => {
  const passphrase = '123'
  return cy
    .backend()
    .then(handler =>
      handler.SubmitWalletAPIRequest({
        id: '0',
        jsonrpc: '2.0',
        method: 'admin.import_wallet',
        params: {
          wallet: 'test',
          recoveryPhrase: Cypress.env('testWalletRecoveryPhrase'),
          version: 2,
          passphrase
        }
      })
    )
    .then(res => res.result)
    .then(() => cy.reload())
})
