export {}

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      getByTestId(
        selector: string,
        options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
      ): Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add('getByTestId', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})
