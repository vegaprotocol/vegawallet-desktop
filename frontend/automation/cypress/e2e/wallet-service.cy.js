describe('wallet service', () => {
  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
      })
      .then(() => {
        cy.waitForHome()
      })
  })

  it('imports and starts mainnet automatically', () => {
    cy.getByTestId('service-status').should(
      'contain.text',
      'Wallet Service: mainnet1'
    )
  })
})
