export {}
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      waitForNetworkConnected(): Chainable<Subject>
    }
  }
}

Cypress.Commands.add('waitForNetworkConnected', () => {
  cy.get('body').then(body => {
    if (body.find('[data-testid="network-compatibility-dialog"]').length > 0) {
      cy.get('button[data-testid="network-compatibility-continue"]').click()
    }
  })
  cy.getByTestId('network-compatibility-dialog', { timeout: 30000 }).should(
    'not.exist'
  )
  cy.getByTestId('service-status').should('not.contain.text', 'Not running')
  cy.getByTestId('service-status', { timeout: 40000 }).should(
    'not.contain.text',
    'Loading'
  )
})
