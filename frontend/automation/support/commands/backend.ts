export {}
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
declare type Handler = typeof import('../../../src/wailsjs/go/backend/Handler')
declare type Win = Window &
  typeof globalThis & { go: { backend: { Handler: Handler } } }

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      backend(): Chainable<Handler>
    }
  }
}

Cypress.Commands.add('backend', () => {
  cy.visit('/')
  cy.getByTestId('splash-loader', { timeout: 30000 }).should('not.exist')

  return cy.window().then(win => {
    return (win as Win).go.backend.Handler as Handler
  })
})
