export {}
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
declare type Handler = typeof import('../../../src/wailsjs/go/backend/Handler')
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      restoreNetwork(handler: Handler, name?: String): any
    }
  }
}

Cypress.Commands.add('restoreNetwork', (handler, name = 'test') => {
  handler
    .SubmitWalletAPIRequest({
      id: '0',
      jsonrpc: '2.0',
      method: 'admin.import_network',
      params: {
        filePath: Cypress.env('testNetworkPath'),
        name
      }
    })
    .then(res => res.result)
})
