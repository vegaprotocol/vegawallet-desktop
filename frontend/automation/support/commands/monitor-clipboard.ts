export {}
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      monitor_clipboard(): Chainable<Subject>
    }
  }
}

Cypress.Commands.add('monitor_clipboard', () => {
  cy.window().then(win => {
    return cy.stub(win, 'prompt').returns(win.prompt)
  })
})
