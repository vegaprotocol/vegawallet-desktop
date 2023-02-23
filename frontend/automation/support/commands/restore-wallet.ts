export {}
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
declare type Handler = typeof import('../../../src/wailsjs/go/backend/Handler')
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      restoreWallet(handler: Handler): void
    }
  }
}

Cypress.Commands.add('restoreWallet', handler => {
  const passphrase = '123'
  return handler.SubmitWalletAPIRequest({
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
})
