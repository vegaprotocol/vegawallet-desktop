before(() => {
  cy.clean()
  cy.setVegaHome().then(() => {
    cy.getByTestId('app-chrome').should('have.length', 1)
  })
})
