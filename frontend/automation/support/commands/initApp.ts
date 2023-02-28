export {}
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      initApp(): Chainable<Subject>
    }
  }
}

Cypress.Commands.add('initApp', () => {
  cy.clean()
  cy.visit('/')
  cy.getByTestId('splash-loader', { timeout: 30000 }).should('not.exist')
  return cy
    .backend()
    .then(handler =>
      handler.InitialiseApp({
        vegaHome: Cypress.env('vegaHome')
      })
    )
    .then(() => {
      cy.visit('/')
      cy.getByTestId('splash-loader').should('be.visible')
      cy.getByTestId('splash-loader').should('not.exist')
    })
})
