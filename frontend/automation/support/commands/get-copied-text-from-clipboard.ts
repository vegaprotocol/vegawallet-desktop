export {}
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      get_copied_text_from_clipboard(): Chainable<Subject>
    }
  }
}

Cypress.Commands.add(
  'get_copied_text_from_clipboard',
  { prevSubject: true },
  clipboard => {
    // Must first setup with cy.monitor_clipboard().as('clipboard')
    // This function then chained off a cy.get('@clipboard')
    return clipboard.args[0][1]
  }
)
