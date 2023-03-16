export {}
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      removeNetwork(name?: string): Chainable<Subject>
    }
  }
}

Cypress.Commands.add('removeNetwork', (name?: string) => {
  if (name) {
    cy.log(`Removing network ${name}...`)
    return removeNetwork(name)
  } else {
    cy.log('Removing all networks...')
    return listNetworks().then(networks => networks.forEach(removeNetwork))
  }
})

function removeNetwork(name: string) {
  return cy.backend().then(handler => {
    handler
      .SubmitWalletAPIRequest({
        id: '0',
        jsonrpc: '2.0',
        method: 'admin.remove_network',
        params: {
          name
        }
      })
      .then(res => res.result)
  })
}

function listNetworks(): Cypress.Chainable<string[]> {
  return cy.backend().then(handler =>
    handler
      .SubmitWalletAPIRequest({
        id: '0',
        jsonrpc: '2.0',
        method: 'admin.list_networks'
      })
      .then(res =>
        res.result.networks.map((network: { name: string }) => network.name)
      )
  )
}
