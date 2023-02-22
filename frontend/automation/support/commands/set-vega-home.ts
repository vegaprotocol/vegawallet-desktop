declare module Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    setVegaHome(handler: Handler): void
  }
}

Cypress.Commands.add('setVegaHome', handler => {
  return handler.InitialiseApp({
    vegaHome: Cypress.env('vegaHome')
  })
})
