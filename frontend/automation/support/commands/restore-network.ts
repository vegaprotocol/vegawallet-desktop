import path from 'path'
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
  const location = path.join(
    Cypress.config('projectRoot'),
    'automation/network-config/test.toml'
  )
  Cypress.env('testNetworkPath', location)

  handler
    .SubmitWalletAPIRequest({
      id: '0',
      jsonrpc: '2.0',
      method: 'admin.import_network',
      params: {
        filePath: location,
        name
      }
    })
    .then(res => res.result)
})
