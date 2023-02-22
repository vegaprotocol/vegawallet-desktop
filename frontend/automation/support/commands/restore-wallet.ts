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
  return handler
    .SubmitWalletAPIRequest({
      id: '0',
      jsonrpc: '2.0',
      method: 'admin.import_wallet',
      params: {
        wallet: 'test',
        recoveryPhrase:
          'behave unveil treat stone forward priority shoulder output woman dinner wide oval once fire move perfect together sail hero local try cinnamon clip hawk',
        version: 2,
        passphrase
      }
    })
    .then(res => {
      // Store env vars for later use in tests and then import a network
      Cypress.env('testWalletPassphrase', passphrase)
      Cypress.env('testWalletName', res.result.wallet.name)
      Cypress.env('testWalletPublicKey', res.result.key.publicKey)
    })
})
