export {}
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      restoreNetwork(name?: String): Chainable<Subject>
    }
  }
}

Cypress.Commands.add('restoreNetwork', (name = 'test') => {
  return cy.backend().then(handler => {
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
})
