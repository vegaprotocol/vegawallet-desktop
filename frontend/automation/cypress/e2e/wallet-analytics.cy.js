describe('wallet analytics', () => {
  before(() => {
    cy.clean()
    cy.backend().then(handler => {
      cy.setVegaHome(handler)
      cy.restoreNetwork(handler)
      cy.restoreWallet(handler)
    })
  })

  it('prompts the user to choose whether analytics are sent', () => {
    // 0001-WALL-003
    cy.visit('/')
    cy.getByTestId('splash-loader').should('be.visible')
    cy.getByTestId('splash-loader').should('not.exist')
    cy.get('[role="dialog"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Report bugs and crashes').should('be.visible')
        cy.contains(
          'Selecting yes will help developers improve the software'
        ).should('be.visible')
        cy.get('button[role="radio"][value="no"]').should('be.visible')
        cy.get('button[role="radio"][value="yes"]').should('be.visible')
        cy.get('button').contains('Continue').should('be.visible')
      })
  })
})
